import "@polymer/paper-input/paper-input";
import "@material/mwc-button";
import "../dialogs/op-store-auth-card";
import {
  CSSResult,
  css,
  html,
  PropertyValues,
  property,
  customElement,
  TemplateResult,
} from "lit-element";
import { genClientId, AuthData } from "../open-peer-power-js-websocket/lib";
import { PolymerChangedEvent } from "../polymer-types";
import { OpenPeerPower } from '../types';
import { loginUser, SetinvalidAuth } from "../data/auth";
import { OppElement } from "../state/opp-element";

@customElement("opp-login")
export class OppLogin extends OppElement {
  @property( {type: String} ) _name = "";
  @property( {type: String} ) _username = "";
  @property( {type: String} ) _password = "";
  @property( {type: String} ) _passwordConfirm = "";
  @property( {type: String} ) _loading = false;
  @property( {type: String} ) _errorMsg?: string = undefined;
  @property( {type: Object} ) opp!: OpenPeerPower;

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
    console.log('login firstupdated');
    console.log(this.opp);
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
    const clientId = genClientId();
    //const token  = await this.opp.callWS({
    //  type: "login",
    //  clientId,
    //  name: this._name,
    //  username: this._username,
    //  password: this._password
    //});
    let conn = (await window.oppConnection).conn;
    let socket = conn.socket;
    //socket.addEventListener("message", ev => this._handleMessage(ev), {once: true});
    socket.addEventListener("message", ev => this._handleMessage(ev));
    loginUser(conn, clientId, this._name, this._username, this._password);
  }

  private async _saveAuth(): Promise<void> {
    const el = document.createElement("op-store-auth-card");
    this.provideOpp(el);
    this.shadowRoot!.appendChild(el);
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
  constructor() {
    super();
  }
  _handleMessage(event: MessageEvent) {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case "auth_invalid":
        this._errorMsg = "login id or password invalid";
        SetinvalidAuth(true);
        break;

      case "auth_ok":
        SetinvalidAuth(false);
        let auth = this.opp.auth;
        auth.data.access_token = message.access_token;
        this._updateOpp({ auth });
        this._saveAuth()
        break;
      default:
      }
    };

}