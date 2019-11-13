export type Error = 1 | 2 | 3 | 4;

export type UnsubscribeFunc = () => void;

export type ConnectionOptions = {
    setupRetry: number;
    createSocket: (options: ConnectionOptions) => Promise<WebSocket>;
};

export type MessageBase = {
  id?: number;
  type: string;
  [key: string]: any;
};

export type OppEventBase = {
  origin: string;
  time_fired: string;
  context: {
    id: string;
    user_id: string;
  };
};

export type OppEvent = OppEventBase & {
  event_type: string;
  data: { [key: string]: any };
};

export type StateChangedEvent = OppEventBase & {
  event_type: "state_changed";
  data: {
    entity_id: string;
    new_state: OppEntity | null;
    old_state: OppEntity | null;
  };
};

export type OppService = {
  description: string;
  fields: {
    [field_name: string]: {
      description: string;
      example: string | boolean | number;
    };
  };
};

export type OppDomainServices = {
  [service_name: string]: OppService;
};

export type OppServices = {
  [domain: string]: OppDomainServices;
};

export type OppUser = {
  id: string;
  is_owner: boolean;
  name: string;
};
