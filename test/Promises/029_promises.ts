const ERR_INVALID_AUTH = 2;
const MSG_TYPE_AUTH_REQUIRED = "auth_required";
const MSG_TYPE_AUTH_INVALID = "auth_invalid";
const MSG_TYPE_AUTH_OK = "auth_ok";

type ConnectionOptions = {
  setupRetry: number;
  auth?: Auth;
  createSocket: (options: ConnectionOptions) => Promise<WebSocket>;
};

type CommandWithAnswerInFlight = {
  resolve: (result?: any) => void;
  reject: (err: any) => void;
};

type CommandInFlight =
  | SubscribeEventCommmandInFlight<any>
  | CommandWithAnswerInFlight;

type SubscriptionUnsubscribe = () => Promise<void>;  
interface SubscribeEventCommmandInFlight<T> {
  resolve: (result?: any) => void;
  reject: (err: any) => void;
  callback: (ev: T) => void;
  subscribe: () => Promise<SubscriptionUnsubscribe>;
  unsubscribe: SubscriptionUnsubscribe;
}
type Events = "ready" | "disconnected" | "reconnect-error";

type ConnectionEventListener = (
  conn: Connection,
  eventData?: any
) => void;

type SubscribeEventMessage = {
  type: "subscribe_events";
  event_type?: string;
};

type WebSocketEventResponse = {
  id: number;
  type: "event";
  event: OppEvent;
};

type WebSocketResultResponse = {
  id: number;
  type: "result";
  success: true;
  result: any;
};

type WebSocketResponse =
  | WebSocketEventResponse
  | WebSocketResultResponse;

function subscribeEvents(eventType?: string) {
  const message: SubscribeEventMessage = {
    type: "subscribe_events"
  };

  if (eventType) {
    message.event_type = eventType;
  }

  return message;
}

type OppEventBase = {
  origin: string;
  time_fired: string;
  context: {
    id: string;
    user_id: string;
  };
};

type OppEvent = OppEventBase & {
  event_type: string;
  data: { [key: string]: any };
};

function unsubscribeEvents(subscription: number) {
  return {
    type: "unsubscribe_events",
    subscription
  };
}

type MessageBase = {
  id?: number;
  type: string;
  [key: string]: any;
};

class Auth {
    private _saveTokens?: SaveTokensFunc;
    data: AuthData;
  
    constructor(data: AuthData, saveTokens?: SaveTokensFunc) {
      this.data = data;
      this._saveTokens = saveTokens;
    }
  
    get wsUrl() {
      // Convert from http:// -> ws://, https:// -> wss://
      //return `ws${this.data.oppUrl.substr(4)}/api/websocket`;
      return `ws://127.0.0.1:8123/api/websocket`;
    }  
}

class Connection {
    options: ConnectionOptions;
    commandId: number;
    commands: Map<number, CommandInFlight>;
    eventListeners: Map<string, ConnectionEventListener[]>;
    closeRequested: boolean;
    // @ts-ignore: incorrectly claiming it's not set in constructor.
    socket: WebSocket;
  
    constructor(socket: WebSocket, options: ConnectionOptions) {
      // connection options
      //  - setupRetry: amount of ms to retry when unable to connect on initial setup
      //  - createSocket: create a new Socket connection
      this.options = options;
      // id if next command to send
      this.commandId = 1;
      // info about active subscriptions and commands in flight
      this.commands = new Map();
      // map of event listeners
      this.eventListeners = new Map();
      // true if a close is requested by the user
      this.closeRequested = false;
  
      this.setSocket(socket);
    }
  
    setSocket(socket: WebSocket) {
      const oldSocket = this.socket;
      this.socket = socket;
      socket.addEventListener("message", ev => this._handleMessage(ev));
  
      if (oldSocket) {
        const oldCommands = this.commands;
  
        // reset to original state
        this.commandId = 1;
        this.commands = new Map();
  
        oldCommands.forEach(info => {
          if ("subscribe" in info) {
            info.subscribe().then(unsub => {
              info.unsubscribe = unsub;
              // We need to resolve this in case it wasn't resolved yet.
              // This allows us to subscribe while we're disconnected
              // and recover properly.
              info.resolve();
            });
          }
        });
  
        this.fireEvent("ready");
      }
    }
  
    addEventListener(eventType: Events, callback: ConnectionEventListener) {
      let listeners = this.eventListeners.get(eventType);
  
      if (!listeners) {
        listeners = [];
        this.eventListeners.set(eventType, listeners);
      }
  
      listeners.push(callback);
    }
  
    removeEventListener(eventType: Events, callback: ConnectionEventListener) {
      const listeners = this.eventListeners.get(eventType);
  
      if (!listeners) {
        return;
      }
  
      const index = listeners.indexOf(callback);
  
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  
    fireEvent(eventType: Events, eventData?: any) {
      (this.eventListeners.get(eventType) || []).forEach(callback =>
        callback(this, eventData)
      );
    }
  
    close() {
      this.closeRequested = true;
      this.socket.close();
    }
  
    /**
     * Subscribe to a specific or all events.
     *
     * @param callback Callback  to be called when a new event fires
     * @param eventType
     * @returns promise that resolves to an unsubscribe function
     */
    
    async subscribeEvents<EventType>(
      callback: (ev: EventType) => void,
      eventType?: string
    ): Promise<SubscriptionUnsubscribe> {
      return this.subscribeMessage(callback, subscribeEvents(eventType));
    }
   
    sendMessage(message: MessageBase, commandId?: number): void {
  
      if (!commandId) {
        commandId = this._genCmdId();
      }
      message.id = commandId;
  
      this.socket.send(JSON.stringify(message));
    }
  
    sendMessagePromise<Result>(message: MessageBase): Promise<Result> {
      return new Promise((resolve, reject) => {
        const commandId = this._genCmdId();
        this.commands.set(commandId, { resolve, reject });
        this.sendMessage(message, commandId);
      });
    }
  
    /**
     * Call a websocket command that starts a subscription on the backend.
     *
     * @param message the message to start the subscription
     * @param callback the callback to be called when a new item arrives
     * @returns promise that resolves to an unsubscribe function
     */
    async subscribeMessage<Result>(
      callback: (result: Result) => void,
      subscribeMessage: MessageBase
    ): Promise<SubscriptionUnsubscribe> {
      // Command ID that will be used
      const commandId = this._genCmdId();
      let info: SubscribeEventCommmandInFlight<Result>;
  
      await new Promise((resolve, reject) => {
        // We store unsubscribe on info object. That way we can overwrite it in case
        // we get disconnected and we have to subscribe again.
        info = {
          resolve,
          reject,
          callback,
          subscribe: () => this.subscribeMessage(callback, subscribeMessage),
          unsubscribe: async () => {
            await this.sendMessagePromise(unsubscribeEvents(commandId));
            this.commands.delete(commandId);
          }
        };
        this.commands.set(commandId, info);
  
        try {
          this.sendMessage(subscribeMessage, commandId);
        } catch (err) {
          // Happens when the websocket is already closing.
          // Don't have to handle the error, reconnect logic will pick it up.
        }
      });
  
      return () => info.unsubscribe();
    }
  
    private _handleMessage(event: MessageEvent) {
      const message: WebSocketResponse = JSON.parse(event.data);
   
      const info = this.commands.get(message.id);
  
      switch (message.type) {
        case "event":
          if (info) {
            (info as SubscribeEventCommmandInFlight<any>).callback(message.event);
          } else {
            console.warn(
              `Received event for unknown subscription ${
                message.id
              }. Unsubscribing.`
            );
            this.sendMessagePromise(unsubscribeEvents(message.id));
          }
          break;
        default:
      }
    }
  
    private _genCmdId() {
      return ++this.commandId;
    }
}

declare global {
interface Window {
    __tokenCache: {
        // undefined: we haven't loaded yet
        // null: none stored
    tokens?: AuthData | null;
    writeEnabled?: boolean;
    };
  }
}

declare global {
    interface Window {
      oppConnection: Promise<{ auth: Auth; conn: Connection }>;
    }
  }
  
type AuthData = {
  oppUrl: string;
  clientId: string;
  expires?: number;
  refresh_token?: string;
  access_token?: string;
  expires_in?: number;
};

type SaveTokensFunc = (data: AuthData | null) => void;
type LoadTokensFunc = () => Promise<AuthData | null | undefined>;

function saveTokens(tokens: AuthData | null) {
  tokenCache.tokens = tokens;
  if (tokenCache.writeEnabled) {
    try {
      storage.Tokens = JSON.stringify(tokens);
    } catch (err) {
      // write failed, ignore it. Happens if storage is full or private mode.
    }
  }
}

type getAuthOptions = {
    oppUrl?: string;
    clientId?: string;
    authCode?: string;
    saveTokens?: SaveTokensFunc;
    loadTokens?: LoadTokensFunc;
  };

let tokenCache = window.__tokenCache;
if (!tokenCache) {
  tokenCache = window.__tokenCache = {
  tokens: undefined
  };
}

const storage = window.localStorage || {};

const authProm = () =>
      getAuth({
        oppUrl,
        clientId,
        authCode,
        saveTokens,
        loadTokens: () => Promise.resolve(loadTokens()),
      });

let oppUrl = 'http://127.0.0.1:8123';
let clientId = 'http://127.0.0.1:8081';
let authCode = 'afsddfas';

async function getAuth(options: getAuthOptions = {}): Promise<Auth> {
    let data: AuthData | null | undefined;
  
    let oppUrl = options.oppUrl;
    // Strip trailing slash.
    if (oppUrl && oppUrl[oppUrl.length - 1] === "/") {
      oppUrl = oppUrl.substr(0, oppUrl.length - 1);
    }
    const clientId = 'http://127.0.0.1:8081';
  
    // Check for stored tokens
    if (!data && options.loadTokens) {
      data = await options.loadTokens();
    }
  
    if (data) {
      return new Auth(data, options.saveTokens);
    }
    
    data = 
      {oppUrl: oppUrl = oppUrl,
       clientId: oppUrl = clientId
      };
    return new Auth(data, options.saveTokens);
  }
  
  function loadTokens() {
    if (tokenCache.tokens === undefined) {
      try {
        const tokens = storage.Tokens;
        if (tokens) {
          tokenCache.tokens = tokens;
        } else {
          tokenCache.tokens = null;
        }
      } catch (err) {
        tokenCache.tokens = null;
      }
    }
    return tokenCache.tokens;
  }
// sockets.ts
function createSocket(options: ConnectionOptions): Promise<WebSocket> {
  //if (!options.auth) {
  //  throw ERR_OPP_HOST_REQUIRED;
 // }
  const auth = options.auth;

  // Start refreshing expired tokens even before the WS connection is open.
  // We know that we will need auth anyway.
 // let authRefreshTask = auth.expired
 //   ? auth.refreshAccessToken().then(
 //       () => {
 //         authRefreshTask = undefined;
 //       },
 //       () => {
 //         authRefreshTask = undefined;
 //       }
 //     )
 //   : undefined;

  // Convert from http:// -> ws://, https:// -> wss://
  const url = auth!.wsUrl;

  function connect(
    triesLeft: number,
    promResolve: (socket: WebSocket) => void,
    promReject: (err: Error) => void
  ) {

    const socket = new WebSocket(url);

    // If invalid auth, we will not try to reconnect.
    let invalidAuth = false;

    const closeMessage = () => {
      // If we are in error handler make sure close handler doesn't also fire.
      socket.removeEventListener("close", closeMessage);
      if (invalidAuth) {
        promReject(ERR_INVALID_AUTH);
        return;
      }

      const newTries = triesLeft === -1 ? -1 : triesLeft - 1;
      // Try again in a second
      setTimeout(
        () =>
          connect(
            newTries,
            promResolve,
            promReject
          ),
        1000
      );
    };

    // Auth is mandatory, if an access toek is available send it right away.
    // Otherwise redirect to the login screen
    // @ts-ignore
    const handleOpen = async (event: MessageEventInit) => {
      if (auth!.accessToken) 
        try {
          socket.send(JSON.stringify(messages.auth(auth!.accessToken)));
        } catch (err) {
          // Refresh token failed
          invalidAuth = err === ERR_INVALID_AUTH;
          socket.close();
        }
    };

    const handleMessage = async (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case MSG_TYPE_AUTH_INVALID:
          invalidAuth = true;
          socket.close();
          break;

        case MSG_TYPE_AUTH_OK:
          socket.removeEventListener("open", handleOpen);
          socket.removeEventListener("message", handleMessage);
          socket.removeEventListener("close", closeMessage);
          socket.removeEventListener("error", closeMessage);
          promResolve(socket);
          break;

        default:
      }
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", closeMessage);
    socket.addEventListener("error", closeMessage);
  }

  return new Promise((resolve, reject) =>
    connect(
      options.setupRetry,
      resolve,
      reject
    )
  );
}
// end socket.ts
  // index.ts
  const defaultConnectionOptions: ConnectionOptions = {
    setupRetry: 3,
    createSocket
  };

   async function createConnection(options?: Partial<ConnectionOptions>) {
    const connOptions: ConnectionOptions = Object.assign(
      {},
      defaultConnectionOptions,
      options
    );
    const socket = await connOptions.createSocket(connOptions);
    const conn = new Connection(socket, connOptions);
    return conn;
  }
 // end index.ts
  const connProm = async (auth) => {
    try {
      const conn = await createConnection({ auth });
  
      // Clear url if we have been able to establish a connection
      if (location.search.includes("auth_callback=1")) {
        history.replaceState(null, "", location.pathname);
      }
  
      return { auth, conn };
    } catch (err) {
      if (err !== ERR_INVALID_AUTH) {
        throw err;
      }
      // We can get invalid auth if auth tokens were stored that are no longer valid
      // Clear stored tokens.
      saveTokens(null);
      auth = await authProm();
      const conn = await createConnection({ auth });
      return { auth, conn };
    }
  };

  debugger;
  window.oppConnection = authProm().then(connProm);
