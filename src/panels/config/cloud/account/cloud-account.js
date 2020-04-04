import "@material/mwc-button";
import "@polymer/paper-item/paper-item-body";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../../components/op-card";
import "../../../../components/buttons/op-call-api-button";
import "../../../../layouts/opp-subpage";
import "../../../../resources/op-style";
import "../../op-config-section";
import "./cloud-webhooks";
import "./cloud-alexa-pref";
import "./cloud-google-pref";
import "./cloud-remote-pref";

import { EventsMixin } from "../../../../mixins/events-mixin";
import { fetchCloudSubscriptionInfo } from "../../../../data/cloud";

import { formatDateTime } from "../../../../common/datetime/format_date_time";
import LocalizeMixin from "../../../../mixins/localize-mixin";

/*
 * @appliesMixin EventsMixin
 * @appliesMixin LocalizeMixin
 */
class CloudAccount extends EventsMixin(LocalizeMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="iron-flex op-style">
        [slot="introduction"] {
          margin: -1em 0;
        }
        [slot="introduction"] a {
          color: var(--primary-color);
        }
        .content {
          padding-bottom: 24px;
          direction: ltr;
        }
        .account-row {
          display: flex;
          padding: 0 16px;
        }
        mwc-button {
          align-self: center;
        }
        .soon {
          font-style: italic;
          margin-top: 24px;
          text-align: center;
        }
        .nowrap {
          white-space: nowrap;
        }
        .wrap {
          white-space: normal;
        }
        .status {
          text-transform: capitalize;
          padding: 16px;
        }
        a {
          color: var(--primary-color);
        }
      </style>
      <opp-subpage header="[[localize('ui.panel.config.cloud.caption')]]">
        <div class="content">
          <op-config-section is-wide="[[isWide]]">
            <span slot="header"
              >[[localize('ui.panel.config.cloud.caption')]]</span
            >
            <div slot="introduction">
              <p>
                [[localize('ui.panel.config.cloud.account.thank_you_note')]]
              </p>
            </div>

            <op-card
              header="[[localize('ui.panel.config.cloud.account.nabu_casa_account')]]"
            >
              <div class="account-row">
                <paper-item-body two-line="">
                  [[cloudStatus.email]]
                  <div secondary class="wrap">
                    [[_formatSubscription(_subscription)]]
                  </div>
                </paper-item-body>
              </div>

              <div class="account-row">
                <paper-item-body
                  >[[localize('ui.panel.config.cloud.account.connection_status')]]</paper-item-body
                >
                <div class="status">[[cloudStatus.cloud]]</div>
              </div>

              <div class="card-actions">
                <a href="https://account.nabucasa.com" target="_blank"
                  ><mwc-button
                    >[[localize('ui.panel.config.cloud.account.manage_account')]]</mwc-button
                  ></a
                >
                <mwc-button style="float: right" on-click="handleLogout"
                  >[[localize('ui.panel.config.cloud.account.sign_out')]]</mwc-button
                >
              </div>
            </op-card>
          </op-config-section>

          <op-config-section is-wide="[[isWide]]">
            <span slot="header"
              >[[localize('ui.panel.config.cloud.account.integrations')]]</span
            >
            <div slot="introduction">
              <p>
                [[localize('ui.panel.config.cloud.account.integrations_introduction')]]
              </p>
              <p>
                [[localize('ui.panel.config.cloud.account.integrations_introduction2')]]
                <a href="https://www.nabucasa.com" target="_blank"
                  >[[localize('ui.panel.config.cloud.account.integrations_link_all_features')]]</a
                >.
              </p>
            </div>

            <cloud-remote-pref
              opp="[[opp]]"
              cloud-status="[[cloudStatus]]"
            ></cloud-remote-pref>

            <cloud-alexa-pref
              opp="[[opp]]"
              cloud-status="[[cloudStatus]]"
            ></cloud-alexa-pref>

            <cloud-google-pref
              opp="[[opp]]"
              cloud-status="[[cloudStatus]]"
            ></cloud-google-pref>

            <cloud-webhooks
              opp="[[opp]]"
              cloud-status="[[cloudStatus]]"
            ></cloud-webhooks>
          </op-config-section>
        </div>
      </opp-subpage>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      isWide: Boolean,
      cloudStatus: Object,
      _subscription: {
        type: Object,
        value: null,
      },
    };
  }

  ready() {
    super.ready();
    this._fetchSubscriptionInfo();
  }

  _computeRemoteConnected(connected) {
    return connected
      ? this.opp.localize("ui.panel.config.cloud.account.connected")
      : this.opp.localize("ui.panel.config.cloud.account.not_connected");
  }

  async _fetchSubscriptionInfo() {
    this._subscription = await fetchCloudSubscriptionInfo(this.opp);
    if (
      this._subscription.provider &&
      this.cloudStatus &&
      this.cloudStatus.cloud !== "connected"
    ) {
      this.fire("op-refresh-cloud-status");
    }
  }

  handleLogout() {
    this.opp
      .callApi("post", "cloud/logout")
      .then(() => this.fire("op-refresh-cloud-status"));
  }

  _formatSubscription(subInfo) {
    if (subInfo === null) {
      return this.opp.localize(
        "ui.panel.config.cloud.account.fetching_subscription"
      );
    }

    let description = subInfo.human_description;

    if (subInfo.plan_renewal_date) {
      description = description.replace(
        "{periodEnd}",
        formatDateTime(
          new Date(subInfo.plan_renewal_date * 1000),
          this.opp.language
        )
      );
    }

    return description;
  }
}

customElements.define("cloud-account", CloudAccount);