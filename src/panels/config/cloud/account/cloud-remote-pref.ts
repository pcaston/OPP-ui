import {
  html,
  LitElement,
  TemplateResult,
  customElement,
  CSSResult,
  css,
  property,
} from "lit-element";
import "@material/mwc-button";
import "@polymer/paper-item/paper-item-body";

import "../../../../components/op-card";
import "../../../../components/op-switch";

// tslint:disable-next-line
import { OpSwitch } from "../../../../components/op-switch";
import { fireEvent } from "../../../../common/dom/fire_event";
import { OpenPeerPower } from "../../../../types";
import {
  connectCloudRemote,
  disconnectCloudRemote,
  CloudStatusLoggedIn,
} from "../../../../data/cloud";
import { showCloudCertificateDialog } from "../dialog-cloud-certificate/show-dialog-cloud-certificate";

@customElement("cloud-remote-pref")
export class CloudRemotePref extends LitElement {
  @property() public opp?: OpenPeerPower;
  @property() public cloudStatus?: CloudStatusLoggedIn;

  protected render(): TemplateResult {
    if (!this.cloudStatus) {
      return html``;
    }

    const {
      remote_connected,
      remote_domain,
      remote_certificate,
    } = this.cloudStatus;

    if (!remote_certificate) {
      return html`
        <op-card
          header=${this.opp!.localize(
            "ui.panel.config.cloud.account.remote.title"
          )}
        >
          <div class="preparing">
            ${this.opp!.localize(
              "ui.panel.config.cloud.account.remote.access_is_being_prepared"
            )}
          </div>
        </op-card>
      `;
    }

    return html`
      <op-card
        header=${this.opp!.localize(
          "ui.panel.config.cloud.account.remote.title"
        )}
      >
        <div class="switch">
          <op-switch
            .checked="${remote_connected}"
            @change="${this._toggleChanged}"
          ></op-switch>
        </div>
        <div class="card-content">
          ${this.opp!.localize("ui.panel.config.cloud.account.remote.info")}
          ${remote_connected
            ? this.opp!.localize(
                "ui.panel.config.cloud.account.remote.instance_is_available"
              )
            : this.opp!.localize(
                "ui.panel.config.cloud.account.remote.instance_will_be_available"
              )}
          <a href="https://${remote_domain}" target="_blank" class="break-word">
            https://${remote_domain}</a
          >.
        </div>
        <div class="card-actions">
          <a href="https://www.nabucasa.com/config/remote/" target="_blank">
            <mwc-button
              >${this.opp!.localize(
                "ui.panel.config.cloud.account.remote.link_learn_how_it_works"
              )}</mwc-button
            >
          </a>
          ${remote_certificate
            ? html`
                <div class="spacer"></div>
                <mwc-button @click=${this._openCertInfo}>
                  ${this.opp!.localize(
                    "ui.panel.config.cloud.account.remote.certificate_info"
                  )}
                </mwc-button>
              `
            : ""}
        </div>
      </op-card>
    `;
  }

  private _openCertInfo() {
    showCloudCertificateDialog(this, {
      certificateInfo: this.cloudStatus!.remote_certificate!,
    });
  }

  private async _toggleChanged(ev) {
    const toggle = ev.target as OpSwitch;

    try {
      if (toggle.checked) {
        await connectCloudRemote(this.opp!);
      } else {
        await disconnectCloudRemote(this.opp!);
      }
      fireEvent(this, "op-refresh-cloud-status");
    } catch (err) {
      alert(err.message);
      toggle.checked = !toggle.checked;
    }
  }

  static get styles(): CSSResult {
    return css`
      .preparing {
        padding: 0 16px 16px;
      }
      a {
        color: var(--primary-color);
      }
      .break-word {
        overflow-wrap: break-word;
      }
      .switch {
        position: absolute;
        right: 24px;
        top: 32px;
      }
      .card-actions {
        display: flex;
      }
      .card-actions a {
        text-decoration: none;
      }
      .spacer {
        flex-grow: 1;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "cloud-remote-pref": CloudRemotePref;
  }
}
