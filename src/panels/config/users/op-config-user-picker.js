import "@polymer/paper-fab/paper-fab";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-item/paper-item-body";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import "../../../layouts/opp-subpage";
import "../../../components/op-icon-next";
import "../../../components/op-card";

import LocalizeMixin from "../../../mixins/localize-mixin";
import NavigateMixin from "../../../mixins/navigate-mixin";
import { EventsMixin } from "../../../mixins/events-mixin";

import { computeRTL } from "../../../common/util/compute_rtl";

let registeredDialog = false;

/*
 * @appliesMixin LocalizeMixin
 * @appliesMixin NavigateMixin
 * @appliesMixin EventsMixin
 */
class OpUserPicker extends EventsMixin(
  NavigateMixin(LocalizeMixin(PolymerElement))
) {
  static get template() {
    return html`
      <style>
        paper-fab {
          position: fixed;
          bottom: 16px;
          right: 16px;
          z-index: 1;
        }
        paper-fab[is-wide] {
          bottom: 24px;
          right: 24px;
        }
        paper-fab[rtl] {
          right: auto;
          left: 16px;
        }
        paper-fab[rtl][is-wide] {
          bottom: 24px;
          right: auto;
          left: 24px;
        }

        op-card {
          max-width: 600px;
          margin: 16px auto;
          overflow: hidden;
        }
        a {
          text-decoration: none;
          color: var(--primary-text-color);
        }
      </style>

      <opp-subpage header="[[localize('ui.panel.config.users.picker.title')]]">
        <op-card>
          <template is="dom-repeat" items="[[users]]" as="user">
            <a href="[[_computeUrl(user)]]">
              <paper-item>
                <paper-item-body two-line>
                  <div>[[_withDefault(user.name, 'Unnamed User')]]</div>
                  <div secondary="">
                    [[_computeGroup(localize, user)]]
                    <template is="dom-if" if="[[user.system_generated]]">
                      - System Generated
                    </template>
                  </div>
                </paper-item-body>
                <op-icon-next></op-icon-next>
              </paper-item>
            </a>
          </template>
        </op-card>

        <paper-fab
          is-wide$="[[isWide]]"
          icon="opp:plus"
          title="[[localize('ui.panel.config.users.picker.add_user')]]"
          on-click="_addUser"
          rtl$="[[rtl]]"
        ></paper-fab>
      </opp-subpage>
    `;
  }

  static get properties() {
    return {
      opp: Object,
      users: Array,

      rtl: {
        type: Boolean,
        reflectToAttribute: true,
        computed: "_computeRTL(opp)",
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    if (!registeredDialog) {
      registeredDialog = true;
      this.fire("register-dialog", {
        dialogShowEvent: "show-add-user",
        dialogTag: "op-dialog-add-user",
        dialogImport: () =>
          import(/* webpackChunkName: "op-dialog-add-user" */ "./op-dialog-add-user"),
      });
    }
  }

  _withDefault(value, defaultValue) {
    return value || defaultValue;
  }

  _computeUrl(user) {
    return `/config/users/${user.id}`;
  }

  _computeGroup(localize, user) {
    return localize(`groups.${user.group_ids[0]}`);
  }

  _computeRTL(opp) {
    return computeRTL(opp);
  }

  _addUser() {
    this.fire("show-add-user", {
      opp: this.opp,
      dialogClosedCallback: async ({ userId }) => {
        this.fire("reload-users");
        if (userId) this.navigate(`/config/users/${userId}`);
      },
    });
  }
}

customElements.define("op-config-user-picker", OpUserPicker);