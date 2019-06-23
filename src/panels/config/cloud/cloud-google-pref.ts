import {
  html,
  LitElement,
  PropertyDeclarations,
  TemplateResult,
  CSSResult,
  css,
} from "lit-element";
import "@material/mwc-button";
import "@polymer/paper-toggle-button/paper-toggle-button";
// tslint:disable-next-line
import { PaperToggleButtonElement } from "@polymer/paper-toggle-button/paper-toggle-button";
import "../../../components/buttons/op-call-api-button";

import "../../../components/op-card";

import { fireEvent } from "../../../common/dom/fire_event";
import { OpenPeerPower } from "../../../types";
import "./cloud-exposed-entities";
import { CloudStatusLoggedIn, updateCloudPref } from "../../../data/cloud";
import { PaperInputElement } from "@polymer/paper-input/paper-input";

export class CloudGooglePref extends LitElement {
  public opp?: OpenPeerPower;
  public cloudStatus?: CloudStatusLoggedIn;

  static get properties(): PropertyDeclarations {
    return {
      opp: {},
      cloudStatus: {},
    };
  }

  protected render(): TemplateResult | void {
    if (!this.cloudStatus) {
      return html``;
    }

    const {
      google_enabled,
      google_secure_devices_pin,
    } = this.cloudStatus.prefs;

    return html`
      <op-card header="Google Assistant">
        <paper-toggle-button
          id="google_enabled"
          .checked="${google_enabled}"
          @change="${this._toggleChanged}"
        ></paper-toggle-button>
        <div class="card-content">
          With the Google Assistant integration for Open Peer Power Cloud you'll
          be able to control all your Open Peer Power devices via any Google
          Assistant-enabled device.
          <ul>
            <li>
              <a
                href="https://assistant.google.com/services/a/uid/00000091fd5fb875?hl=en-US"
                target="_blank"
              >
                Activate the Open Peer Power skill for Google Assistant
              </a>
            </li>
            <li>
              <a
                href="https://www.nabucasa.com/config/google_assistant/"
                target="_blank"
              >
                Config documentation
              </a>
            </li>
          </ul>
          <em
            >This integration requires a Google Assistant-enabled device like
            the Google Home or Android phone.</em
          >
          ${google_enabled
            ? html`
                <div class="secure_devices">
                  Please enter a pin to interact with security devices. Security
                  devices are doors, garage doors and locks. You will be asked
                  to say/enter this pin when interacting with such devices via
                  Google Assistant.
                  <paper-input
                    label="Secure Devices Pin"
                    id="google_secure_devices_pin"
                    placeholder="Secure devices disabled"
                    .value=${google_secure_devices_pin || ""}
                    @change="${this._pinChanged}"
                  ></paper-input>
                </div>
                <p>Exposed entities:</p>
                <cloud-exposed-entities
                  .opp="${this.opp}"
                  .filter="${this.cloudStatus!.google_entities}"
                  .supportedDomains="${this.cloudStatus!.google_domains}"
                ></cloud-exposed-entities>
              `
            : ""}
        </div>
        <div class="card-actions">
          <op-call-api-button
            .opp="${this.opp}"
            .disabled="${!google_enabled}"
            path="cloud/google_actions/sync"
            >Sync devices</op-call-api-button
          >
        </div>
      </op-card>
    `;
  }

  private async _toggleChanged(ev) {
    const toggle = ev.target as PaperToggleButtonElement;
    try {
      await updateCloudPref(this.opp!, { [toggle.id]: toggle.checked! });
      fireEvent(this, "op-refresh-cloud-status");
    } catch (err) {
      toggle.checked = !toggle.checked;
    }
  }

  private async _pinChanged(ev) {
    const input = ev.target as PaperInputElement;
    try {
      await updateCloudPref(this.opp!, {
        [input.id]: input.value || null,
      });
      fireEvent(this, "op-refresh-cloud-status");
    } catch (err) {
      alert(`Unable to store pin: ${err.message}`);
      input.value = this.cloudStatus!.prefs.google_secure_devices_pin;
    }
  }

  static get styles(): CSSResult {
    return css`
      a {
        color: var(--primary-color);
      }
      op-card > paper-toggle-button {
        margin: -4px 0;
        position: absolute;
        right: 8px;
        top: 32px;
      }
      op-call-api-button {
        color: var(--primary-color);
        font-weight: 500;
      }
      .secure_devices {
        padding-top: 16px;
      }
      paper-input {
        width: 200px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cloud-google-pref": CloudGooglePref;
  }
}

customElements.define("cloud-google-pref", CloudGooglePref);
