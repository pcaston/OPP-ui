import "@polymer/paper-input/paper-input";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../components/op-card";
import "../../../components/buttons/op-progress-button";
import "../../../layouts/opp-subpage";
import "../../../resources/op-style";
import { EventsMixin } from "../../../mixins/events-mixin";

/*
 * @appliesMixin EventsMixin
 */
class HaConfigCloudForgotPassword extends EventsMixin(PolymerElement) {
  static get template() {
    return html`
      <style include="iron-flex op-style">
        .content {
          padding-bottom: 24px;
          direction: ltr;
        }

        op-card {
          max-width: 600px;
          margin: 0 auto;
          margin-top: 24px;
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
        .card-actions a {
          color: var(--primary-text-color);
        }
        [hidden] {
          display: none;
        }
      </style>
      <opp-subpage header="Forgot Password">
        <div class="content">
          <op-card header="Forgot your password">
            <div class="card-content">
              <p>
                Enter your email address and we will send you a link to reset
                your password.
              </p>
              <div class="error" hidden$="[[!_error]]">[[_error]]</div>
              <paper-input
                autofocus=""
                id="email"
                label="E-mail"
                value="{{email}}"
                type="email"
                on-keydown="_keyDown"
                error-message="Invalid email"
              ></paper-input>
            </div>
            <div class="card-actions">
              <op-progress-button
                on-click="_handleEmailPasswordReset"
                progress="[[_requestInProgress]]"
                >Send reset email</op-progress-button
              >
            </div>
          </op-card>
        </div>
      </opp-subpage>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      email: {
        type: String,
        notify: true,
        observer: "_emailChanged",
      },
      _requestInProgress: {
        type: Boolean,
        value: false,
      },
      _error: {
        type: String,
        value: "",
      },
    };
  }

  _emailChanged() {
    this._error = "";
    this.$.email.invalid = false;
  }

  _keyDown(ev) {
    // validate on enter
    if (ev.keyCode === 13) {
      this._handleEmailPasswordReset();
      ev.preventDefault();
    }
  }

  _handleEmailPasswordReset() {
    if (!this.email || !this.email.includes("@")) {
      this.$.email.invalid = true;
    }

    if (this.$.email.invalid) return;

    this._requestInProgress = true;

    this.opp
      .callApi("post", "cloud/forgot_password", {
        email: this.email,
      })
      .then(
        () => {
          this._requestInProgress = false;
          this.fire("cloud-done", {
            flashMessage:
              "Check your email for instructions on how to reset your password.",
          });
        },
        (err) =>
          this.setProperties({
            _requestInProgress: false,
            _error:
              err && err.body && err.body.message
                ? err.body.message
                : "Unknown error",
          })
      );
  }
}

customElements.define(
  "op-config-cloud-forgot-password",
  HaConfigCloudForgotPassword
);
