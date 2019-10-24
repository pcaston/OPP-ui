import {
  html,
  LitElement,
  TemplateResult,
  property,
  customElement,
  css,
  CSSResult,
} from "lit-element";
import "@material/mwc-button";
import "@polymer/paper-tooltip/paper-tooltip";

import "../../../../components/op-relative-time";
import "../../../../components/op-markdown";
import "./hui-notification-item-template";

import { OpenPeerPower } from "../../../../types";
import { OppNotification } from "./types";

@customElement("hui-persistent-notification-item")
export class HuiPersistentNotificationItem extends LitElement {
  @property() public opp?: OpenPeerPower;

  @property() public notification?: OppNotification;

  protected render(): TemplateResult | void {
    if (!this.opp || !this.notification) {
      return html``;
    }

    return html`
      <hui-notification-item-template>
        <span slot="header">${this._computeTitle(this.notification)}</span>

        <op-markdown content="${this.notification.message}"></op-markdown>

        <div class="time">
          <span>
            <op-relative-time
              .opp="${this.opp}"
              .datetime="${this.notification.created_at}"
            ></op-relative-time>
            <paper-tooltip
              >${this._computeTooltip(
                this.opp,
                this.notification
              )}</paper-tooltip
            >
          </span>
        </div>

        <mwc-button slot="actions" @click="${this._handleDismiss}"
          >${this.opp.localize(
            "ui.card.persistent_notification.dismiss"
          )}</mwc-button
        >
      </hui-notification-item-template>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .time {
        display: flex;
        justify-content: flex-end;
        margin-top: 6px;
      }
      op-relative-time {
        color: var(--secondary-text-color);
      }
      a {
        color: var(--primary-color);
      }
    `;
  }

  private _handleDismiss(): void {
    this.opp!.callService("persistent_notification", "dismiss", {
      notification_id: this.notification!.notification_id,
    });
  }

  private _computeTitle(notification: OppNotification): string | undefined {
    return notification.title || notification.notification_id;
  }

  private _computeTooltip(
    opp: OpenPeerPower,
    notification: OppNotification
  ): string | undefined {
    if (!opp || !notification) {
      return undefined;
    }

    const d = new Date(notification.created_at!);
    return d.toLocaleDateString('en', {
      year: "numeric",
      month: "short",
      day: "numeric",
      minute: "numeric",
      hour: "numeric",
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-persistent-notification-item": HuiPersistentNotificationItem;
  }
}
