import { LitElement, html, css, property, PropertyValues, customElement } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from 'pwa-helpers/router';
import { updateMetadata } from 'pwa-helpers/metadata';
import { OpenPeerPower } from '../types';
import { loadTokens } from "../common/auth/token_storage";

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import { menuIcon } from './my-icons';
import { OpenPeerPowerAppEl } from '../layouts/open-peer-power';


declare global {
    interface Window {
    decodeURIComponent(pathname: string): any;
  }
}
@customElement('opp-ui')
export class OPPui extends LitElement {
  @property({type: String}) appTitle = '';
  @property({type: String}) _page = '';
  @property({type: Boolean}) _drawerOpened = false;
  @property({type: Boolean}) _offline = false;
  @property({type: String}) opp: OpenPeerPower = {'ws': new WebSocket("ws://127.0.0.1:8123/api/websocket")};

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-drawer-width: 256px;

          --app-primary-color: #e91e63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: #78909c;
        }

        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
        }

        .toolbar-top {
          background-color: var(--app-header-background-color);
        }

        [main-title] {
          font-family: 'Pacifico';
          text-transform: lowercase;
          font-size: 30px;
          /* In the narrow layout, the toolbar is offset by the width of the
          drawer button, and the text looks not centered. Add a padding to
          match that button */
          padding-right: 44px;
        }

        .toolbar-list {
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
        }

        .menu-btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          min-height: 100vh;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          padding: 24px;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
        }

        /* Wide layout: when the viewport width is bigger than 460px, layout
        changes to a wide layout */
        @media (min-width: 460px) {
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none;
          }

          .main-content {
            padding-top: 107px;
          }

          /* The drawer button isn't shown in the wide layout, so we don't
          need to offset the title */
          [main-title] {
            padding-right: 0px;
          }
        }
      `
    ];
  }

  protected render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <!-- Header -->
      <app-header condenses reveals effects="waterfall">
        <app-toolbar class="toolbar-top">
          <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
          <div main-title>${this.appTitle}</div>
        </app-toolbar>

        <!-- This gets hidden on a small screen-->
        <nav class="toolbar-list">
          <a ?selected="${this._page === 'view_appliances'}" href="/view_appliances">View Appliances</a>
          <a ?selected="${this._page === 'view1'}" href="/view1">View One</a>
          <a ?selected="${this._page === 'opp'}" href="/opp">OPP</a>
          <a ?selected="${this._page === 'about'}" href="/about">About</a>
          <a ?selected="${this._page === 'login'}" href="/login">login</a>
        </nav>
      </app-header>

      <!-- Drawer content -->
      <app-drawer
          .opened="${this._drawerOpened}"
          @opened-changed="${this._drawerOpenedChanged}">
        <nav class="drawer-list">
          <a ?selected="${this._page === 'view_appliances'}" href="/view_appliances">View Appliances</a>
          <a ?selected="${this._page === 'view1'}" href="/view1">View One</a>
          <a ?selected="${this._page === 'opp'}" href="/opp">OPP</a>          
          <a ?selected="${this._page === 'about'}" href="/about">About</a>
          <a ?selected="${this._page === 'login'}" href="/login">login</a>       
        </nav>
      </app-drawer>

      <!-- Main content -->
      <main role="main" class="main-content">
        <my-view1 class="page" ?active="${this._page === 'view1'}"></my-view1>
        <opp-home-view .opp="${this.opp}" class="page" ?active="${this._page === 'view_appliances'}"></opp-home-view>
        <open-peer-power .opp="${this.opp}" class="page" ?active="${this._page === 'opp'}"></open-peer-power>
        <about-page class="page" ?active="${this._page === 'about'}"></about-page>
        <opp-login .opp="${this.opp}" class="page" ?active="${this._page === 'login'}"></opp-login>
        <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
      </main>
      <footer>
        <p>Open Peer Power</p>
      </footer>
      <script type="module">
        import "./entrypoints/core";
        import "./entrypoints/app";
        window.customPanelJS = "./entrypoints/custom-panel";
      </script>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
    //let  opp: OpenPeerPower = {'ws': new WebSocket("ws://127.0.0.1:8123/api/websocket")};
    this.opp.ws.onmessage = (event) => {
      let data = JSON.parse(event.data);
      let access_token = loadTokens()
      switch (data.type) {
        case 'auth_required':
          if (access_token) {
            const authobj = 
            {
              'type': "auth",
              'access_token': access_token
            };
            this.opp.ws.send(JSON.stringify(authobj));
          }
          else {
            document.location.assign('/login');
          };
          break;
        case 'auth_ok':
          let fetchstate = 
          {
            "id": "1",
            "type": "get_states"
          }
          this.opp.ws.send(JSON.stringify(fetchstate));
          if (access_token) {}
          else {
            var opp_login_obj = this.shadowRoot!.querySelector("opp-login")
            if (opp_login_obj) {
              opp_login_obj!.dispatchEvent(new CustomEvent("authorised",
              {bubbles: false, composed: true, detail:{item:data.access_token}}));
            };
          };
          break;
        case 'result':
          this.opp.states = data.result;
          console.log('opp-ui case result');
          break;
        default:
          console.error(
            "unsupported event", data);
      }
    }
  }

  protected firstUpdated() {
    installRouter((location) => this._locationChanged(location));
    installOfflineWatcher((offline) => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: 460px)`,
        () => this._layoutChanged());
  }

  protected updated(changedProps: PropertyValues) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  protected _layoutChanged() {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    this._updateDrawerState(false);
  }

  protected _offlineChanged(offline: boolean) {
    const previousOffline = this._offline;
    this._offline = offline;

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return;
    }
  }

  protected _locationChanged(location: Location) {
    const path = window.decodeURIComponent(location.pathname);
    const page = path === '/' ? 'view_appliances' : path.slice(1);
    this._loadPage(page);
    // Any other info you might want to extract from the path (like page type),
    // you can do here.
    //"""Serve the index view."""
    //opp = request.app['opp']

    //if not opp.components.onboarding.async_is_onboarded():
    //    return web.Response(status=302, headers={
    //       'location': '/onboarding.html'
    //    })

    // Close the drawer - in case the *path* change came from a link in the drawer.
    this._updateDrawerState(false);
  }

  protected _updateDrawerState(opened: boolean) {
    if (opened !== this._drawerOpened) {
      this._drawerOpened = opened;
    }
  }

  protected _loadPage(page: string) {
    switch(page) {
      case 'view1':
        import('../components/my-view1').then(() => {
          // Put code in here that you want to run every time when
          // navigating to view1 after my-view1 is loaded.
        });
        break;
      case 'view_appliances':
        import('../components/opp-home-view');
        break;
      case 'opp':
        import('../layouts/open-peer-power');
        break;
      case 'about':
        import('../components/about-page');
        break;
      case 'login':
          import('../components/opp-login');
          break;
      default:
        page = 'view404';
        import('../components/my-view404');
    }

    this._page = page;
  }

  protected _menuButtonClicked() {
    this._updateDrawerState(true);
  }

  protected _drawerOpenedChanged(e: { target: { opened: boolean; }; }) {
    this._updateDrawerState(e.target.opened);
  }
// Tests
  connectedCallback() {
    super.connectedCallback();
    console.log('connected');
  }

}