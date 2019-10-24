import "@polymer/paper-input/paper-input";
import "@material/mwc-button";
import {
  LitElement,
  CSSResult,
  css,
  html,
  PropertyValues,
  property,
  customElement,
  TemplateResult,
} from "lit-element";
import { genClientId } from "../open-peer-power-js-websocket/lib";
import { onboardUserStep } from "../data/onboarding";
import { PolymerChangedEvent } from "../polymer-types";
import { LocalizeFunc } from "../common/translations/localize";
import { fireEvent } from "../common/dom/fire_event";
import { loadTokens, saveTokens } from "../common/auth/token_storage";

@customElement("onboarding-create-user")
class OnboardingCreateUser extends LitElement {
  @property() public localize!: LocalizeFunc;

  @property() private _name = "";
  @property() private _username = "";
  @property() private _password = "";
  @property() private _passwordConfirm = "";
  @property() private _loading = false;
  @property() private _errorMsg?: string = undefined;

  protected render(): TemplateResult | void {
    return html`
    <p>
     Take control of your power and keep your privacy.
    </p>

    <p>
      Register your user account.
    </p>

    ${
      this._errorMsg
        ? html`
            <p class="error">
              Fill in all required fields
            </p>
          `
        : ""
    }

    <form>
      <paper-input
        name="name"
        label="Name"
        .value=${this._name}
        @value-changed=${this._handleValueChanged}
        required
        auto-validate
        autocapitalize='on'
        .errorMessage="Required"
        @blur=${this._maybePopulateUsername}
      ></paper-input>

      <paper-input
        name="username"
        label="Username"
        value=${this._username}
        @value-changed=${this._handleValueChanged}
        required
        auto-validate
        autocapitalize='none'
        .errorMessage="Required"
      ></paper-input>

      <paper-input
        name="password"
        label="Password"
        value=${this._password}
        @value-changed=${this._handleValueChanged}
        required
        type='password'
        auto-validate
        .errorMessage="Required"
      ></paper-input>

      <paper-input
        name="passwordConfirm"
        label="Confirm Password"
        value=${this._passwordConfirm}
        @value-changed=${this._handleValueChanged}
        required
        type='password'
        .invalid=${this._password !== "" &&
          this._passwordConfirm !== "" &&
          this._passwordConfirm !== this._password}
        .errorMessage="Passwords don't match"
      ></paper-input>

      <p class="action">
        <mwc-button
          raised
          @click=${this._submitForm}
          .disabled=${this._loading}
        >
          Create Account
        </mwc-button>
      </p>
    </div>
  </form>
`;
  }

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);
    setTimeout(
      () => this.shadowRoot!.querySelector("paper-input")!.focus(),
      100
    );
    this.addEventListener("keypress", (ev) => {
      if (ev.keyCode === 13) {
        this._submitForm(ev);
      }
    });
  }

  private _handleValueChanged(ev: PolymerChangedEvent<string>): void {
    const name = (ev.target as any).name;
    this[`_${name}`] = ev.detail.value;
  }

  private _maybePopulateUsername(): void {
    if (this._username) {
      return;
    }

    const parts = this._name.split(" ");

    if (parts.length) {
      this._username = parts[0].toLowerCase();
    }
  }

  private async _submitForm(ev): Promise<void> {
    ev.preventDefault();
    if (!this._name || !this._username || !this._password) {
      this._errorMsg = "required_fields";
      return;
    }

    if (this._password !== this._passwordConfirm) {
      this._errorMsg = "password_not_match";
      return;
    }

    this._loading = true;
    this._errorMsg = "";
    var ws = new WebSocket("ws://127.0.0.1:8123/api/websocket");
    let that = this;
    ws.onmessage = function (event) {
      let data = JSON.parse(event.data);
      console.log(data);
      switch (data.type) {
        case 'auth_required':
            if (localStorage.getItem('auth_token')) {
              const authobj = 
              {
                type: "auth",
                access_token: localStorage.getItem('auth_token')
              };
              ws.send(JSON.stringify(authobj));
              localStorage.removeItem('auth_token');
            } 
            else {
              const clientId = genClientId();
              const result = {
              type: "login",
              client_id: clientId,
              name: that._name,
              username: that._username,
              password: that._password,
            };
            ws.send(JSON.stringify(result));
            }
          break;
        case 'auth_ok':
          localStorage.setItem('auth_token', data.auth_token);
          let fetchstate = 
          {
            "id": "1",
            "type": "get_states"
          }
          ws.send(JSON.stringify(fetchstate));
          break;
        default:
          console.error(
            "unsupported event", data);
      }
    }

    //try {

      //fireEvent(this, "onboarding-step", {
      //  type: "user",
      //  result,
      //});
    //} catch (err) {
      // tslint:disable-next-line
      //console.error(err);
      //this._loading = false;
      //this._errorMsg = err.body.message;
    //}
  }

  static get styles(): CSSResult {
    return css`
      .error {
        color: red;
      }

      .action {
        margin: 32px 0;
        text-align: center;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "onboarding-create-user": OnboardingCreateUser;
  }
}
