import "@material/mwc-button";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-ripple/paper-ripple";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-card";
import "../../../components/buttons/op-progress-button";
import "../../../layouts/opp-subpage";
import "../../../resources/op-style";

import "../op-config-section";
import { EventsMixin } from "../../../mixins/events-mixin";
import NavigateMixin from "../../../mixins/navigate-mixin";
import "../../../components/op-icon-next";
/*
 * @appliesMixin NavigateMixin
 * @appliesMixin EventsMixin
 */
class HaConfigCloudLogin extends NavigateMixin(EventsMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="iron-flex op-style">
        .content {
          padding-bottom: 24px;
          direction: ltr;
        }
        [slot="introduction"] {
          margin: -1em 0;
        }
        [slot="introduction"] a {
          color: var(--primary-color);
        }
        paper-item {
          cursor: pointer;
        }
        op-card {
          overflow: hidden;
        }
        op-card .card-header {
          margin-bottom: -8px;
        }
        h1 {
          @apply --paper-font-headline;
          margin: 0;
        }
        .error {
          color: var(--google-red-500);
        }
        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        [hidden] {
          display: none;
        }
        .flash-msg {
          padding-right: 44px;
        }
        .flash-msg paper-icon-button {
          position: absolute;
          top: 8px;
          right: 8px;
          color: var(--secondary-text-color);
        }
      </style>
      <opp-subpage header="Cloud Login">
        <div class="content">
          <op-config-section is-wide="[[isWide]]">
            <span slot="header">Open Peer Power Cloud</span>
            <div slot="introduction">
              <p>
                Open Peer Power Cloud provides you with a secure remote
                connection to your instance while away from home. It also allows
                you to connect with cloud-only services: Amazon Alexa and Google
                Assistant.
              </p>
              <p>
                This service is run by our partner
                <a href="https://www.nabucasa.com" target="_blank"
                  >Nabu&nbsp;Casa,&nbsp;Inc</a
                >, a company founded by the founders of Open Peer Power and
                Opp.io.
              </p>
              <p>
                Open Peer Power Cloud is a subscription service with a free one
                month trial. No payment information necessary.
              </p>
              <p>
                <a href="https://www.nabucasa.com" target="_blank"
                  >Learn more about Open Peer Power Cloud</a
                >
              </p>
            </div>

            <op-card hidden$="[[!flashMessage]]">
              <div class="card-content flash-msg">
                [[flashMessage]]
                <paper-icon-button icon="opp:close" on-click="_dismissFlash"
                  >Dismiss</paper-icon-button
                >
                <paper-ripple id="flashRipple" noink=""></paper-ripple>
              </div>
            </op-card>

            <op-card header="Sign in">
              <div class="card-content">
                <div class="error" hidden$="[[!_error]]">[[_error]]</div>
                <paper-input
                  label="Email"
                  id="email"
                  type="email"
                  value="{{email}}"
                  on-keydown="_keyDown"
                  error-message="Invalid email"
                ></paper-input>
                <paper-input
                  id="password"
                  label="Password"
                  value="{{_password}}"
                  type="password"
                  on-keydown="_keyDown"
                  error-message="Passwords are at least 8 characters"
                ></paper-input>
              </div>
              <div class="card-actions">
                <op-progress-button
                  on-click="_handleLogin"
                  progress="[[_requestInProgress]]"
                  >Sign in</op-progress-button
                >
                <button
                  class="link"
                  hidden="[[_requestInProgress]]"
                  on-click="_handleForgotPassword"
                >
                  forgot password?
                </button>
              </div>
            </op-card>

            <op-card>
              <paper-item on-click="_handleRegister">
                <paper-item-body two-line="">
                  Start your free 1 month trial
                  <div secondary="">No payment information necessary</div>
                </paper-item-body>
                <op-icon-next></op-icon-next>
              </paper-item>
            </op-card>
          </op-config-section>
        </div>
      </opp-subpage>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      isWide: Boolean,
      email: {
        type: String,
        notify: true,
      },
      _password: {
        type: String,
        value: "",
      },
      _requestInProgress: {
        type: Boolean,
        value: false,
      },
      flashMessage: {
        type: String,
        notify: true,
      },
      _error: String,
    };
  }

  static get observers() {
    return ["_inputChanged(email, _password)"];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.flashMessage) {
      // Wait for DOM to be drawn
      requestAnimationFrame(() =>
        requestAnimationFrame(() => this.$.flashRipple.simulatedRipple())
      );
    }
  }

  _inputChanged() {
    this.$.email.invalid = false;
    this.$.password.invalid = false;
    this._error = false;
  }

  _keyDown(ev) {
    // validate on enter
    if (ev.keyCode === 13) {
      this._handleLogin();
      ev.preventDefault();
    }
  }

  _handleLogin() {
    let invalid = false;

    if (!this.email || !this.email.includes("@")) {
      this.$.email.invalid = true;
      this.$.email.focus();
      invalid = true;
    }

    if (this._password.length < 8) {
      this.$.password.invalid = true;

      if (!invalid) {
        invalid = true;
        this.$.password.focus();
      }
    }

    if (invalid) return;

    this._requestInProgress = true;

    this.opp
      .callApi("post", "cloud/login", {
        email: this.email,
        password: this._password,
      })
      .then(
        () => {
          this.fire("op-refresh-cloud-status");
          this.setProperties({
            email: "",
            _password: "",
          });
        },
        (err) => {
          // Do this before setProperties because changing it clears errors.
          this._password = "";

          const errCode = err && err.body && err.body.code;
          if (errCode === "PasswordChangeRequired") {
            alert("You need to change your password before logging in.");
            this.navigate("/config/cloud/forgot-password");
            return;
          }

          const props = {
            _requestInProgress: false,
            _error:
              err && err.body && err.body.message
                ? err.body.message
                : "Unknown error",
          };

          if (errCode === "UserNotConfirmed") {
            props._error = "You need to confirm your email before logging in.";
          }

          this.setProperties(props);
          this.$.email.focus();
        }
      );
  }

  _handleRegister() {
    this.flashMessage = "";
    this.navigate("/config/cloud/register");
  }

  _handleForgotPassword() {
    this.flashMessage = "";
    this.navigate("/config/cloud/forgot-password");
  }

  _dismissFlash() {
    // give some time to let the ripple finish.
    setTimeout(() => {
      this.flashMessage = "";
    }, 200);
  }
}

customElements.define("op-config-cloud-login", HaConfigCloudLogin);
