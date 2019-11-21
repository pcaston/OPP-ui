import "@polymer/app-route/app-route";
import { timeOut } from "@polymer/polymer/lib/utils/async";
import { Debouncer } from "@polymer/polymer/lib/utils/debounce";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../op-config-section";
import "./op-config-cloud-account";
import "./op-config-cloud-forgot-password";
import "./op-config-cloud-login";
import "./op-config-cloud-register";
import NavigateMixin from "../../../mixins/navigate-mixin";

const LOGGED_IN_URLS = ["/account"];
const NOT_LOGGED_IN_URLS = ["/login", "/register", "/forgot-password"];

/*
 * @appliesMixin NavigateMixin
 */
class HaConfigCloud extends NavigateMixin(PolymerElement) {
  static get template() {
    return html`
      <app-route
        route="[[route]]"
        pattern="/:page"
        data="{{_routeData}}"
        tail="{{_routeTail}}"
      ></app-route>

      <template
        is="dom-if"
        if='[[_equals(_routeData.page, "account")]]'
        restamp=""
      >
        <op-config-cloud-account
          hass="[[hass]]"
          cloud-status="[[cloudStatus]]"
          is-wide="[[isWide]]"
        ></op-config-cloud-account>
      </template>

      <template
        is="dom-if"
        if='[[_equals(_routeData.page, "login")]]'
        restamp=""
      >
        <op-config-cloud-login
          page-name="login"
          hass="[[hass]]"
          is-wide="[[isWide]]"
          email="{{_loginEmail}}"
          flash-message="{{_flashMessage}}"
        ></op-config-cloud-login>
      </template>

      <template
        is="dom-if"
        if='[[_equals(_routeData.page, "register")]]'
        restamp=""
      >
        <op-config-cloud-register
          page-name="register"
          hass="[[hass]]"
          is-wide="[[isWide]]"
          email="{{_loginEmail}}"
        ></op-config-cloud-register>
      </template>

      <template
        is="dom-if"
        if='[[_equals(_routeData.page, "forgot-password")]]'
        restamp=""
      >
        <op-config-cloud-forgot-password
          page-name="forgot-password"
          hass="[[hass]]"
          email="{{_loginEmail}}"
        ></op-config-cloud-forgot-password>
      </template>
    `;
  }

  static get properties() {
    return {
      hass: Object,
      isWide: Boolean,
      loadingAccount: {
        type: Boolean,
        value: false,
      },
      cloudStatus: {
        type: Object,
      },
      _flashMessage: {
        type: String,
        value: "",
      },

      route: Object,

      _routeData: Object,
      _routeTail: Object,
      _loginEmail: String,
    };
  }

  static get observers() {
    return ["_checkRoute(route, cloudStatus)"];
  }

  ready() {
    super.ready();
    this.addEventListener("cloud-done", (ev) => {
      this._flashMessage = ev.detail.flashMessage;
      this.navigate("/config/cloud/login");
    });
  }

  _checkRoute(route) {
    this._debouncer = Debouncer.debounce(
      this._debouncer,
      timeOut.after(0),
      () => {
        if (
          !this.cloudStatus ||
          (!this.cloudStatus.logged_in &&
            !NOT_LOGGED_IN_URLS.includes(route.path))
        ) {
          this.navigate("/config/cloud/login", true);
        } else if (
          this.cloudStatus.logged_in &&
          !LOGGED_IN_URLS.includes(route.path)
        ) {
          this.navigate("/config/cloud/account", true);
        }
      }
    );
  }

  _equals(a, b) {
    return a === b;
  }
}

customElements.define("op-config-cloud", HaConfigCloud);
