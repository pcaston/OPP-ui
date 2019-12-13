import {
  LitElement,
  TemplateResult,
  html,
  css,
  CSSResult,
  property,
} from "lit-element";

import { OpenPeerPower } from "../../../types";
import {
  EntityRegistryEntry,
  computeEntityRegistryName,
  subscribeEntityRegistry,
} from "../../../data/entity_registry";
import "../../../layouts/opp-subpage";
import "../../../layouts/opp-loading-screen";
import "../../../components/op-card";
import "../../../components/opp-icon";
import "../../../components/op-switch";
import domainIcon from "../../../common/entity/domain_icon";
import stateIcon from "../../../common/entity/state_icon";
import computeDomain from "../../../common/entity/compute_domain";
import "../op-config-section";
import {
  showEntityRegistryDetailDialog,
  loadEntityRegistryDetailDialog,
} from "./show-dialog-entity-registry-detail";
import { UnsubscribeFunc } from "../../../open-peer-power-js-websocket/lib";
import { OpSwitch } from "../../../components/op-switch";
import memoize from "memoize-one";
// tslint:disable-next-line
import {
  DataTableColumnContainer,
  RowClickedEvent,
} from "../../../components/data-table/op-data-table";

class OpConfigEntityRegistry extends LitElement {
  @property() public opp!: OpenPeerPower;
  @property() public isWide?: boolean;
  @property() private _entities?: EntityRegistryEntry[];
  @property() private _showDisabled = false;
  private _unsubEntities?: UnsubscribeFunc;

  private _columns = memoize(
    (_language): DataTableColumnContainer => {
      return {
        icon: {
          title: "",
          type: "icon",
          template: (icon) => html`
            <op-icon slot="item-icon" .icon=${icon}></op-icon>
          `,
        },
        name: {
          title: 
            "ui.panel.config.entity_registry.picker.headers.name",
          sortable: true,
          filterable: true,
          direction: "asc",
        },
        entity_id: {
          title:
            "ui.panel.config.entity_registry.picker.headers.entity_id",
          sortable: true,
          filterable: true,
        },
        platform: {
          title: "ui.panel.config.entity_registry.picker.headers.integration",
          sortable: true,
          filterable: true,
          template: (platform) =>
            html`
              component.${platform}.config.title ||
                platform}
            `,
        },
        disabled_by: {
          title: 
            "ui.panel.config.entity_registry.picker.headers.enabled"
          ,
          type: "icon",
          template: (disabledBy) => html`
            <op-icon
              slot="item-icon"
              .icon=${disabledBy ? "opp:cancel" : "opp:check-circle"}
            ></op-icon>
          `,
        },
      };
    }
  );

  private _filteredEntities = memoize(
    (entities: EntityRegistryEntry[], showDisabled: boolean) =>
      (showDisabled
        ? entities
        : entities.filter((entity) => !Boolean(entity.disabled_by))
      ).map((entry) => {
        const state = this.opp!.states[entry.entity_id];
        return {
          ...entry,
          icon: state
            ? stateIcon(state)
            : domainIcon(computeDomain(entry.entity_id)),
          name:
            computeEntityRegistryName(this.opp!, entry) ||
            "state.default.unavailable",
        };
      })
  );

  public disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubEntities) {
      this._unsubEntities();
    }
  }

  protected render(): TemplateResult | void {
    if (!this.opp || this._entities === undefined) {
      return html`
        <opp-loading-screen></opp-loading-screen>
      `;
    }
    return html`
      <opp-subpage
        header="ui.panel.config.entity_registry.caption"
      >
      <div class="content">
        <div class="intro">
          <h2>
            "ui.panel.config.entity_registry.picker.header"
          </h2>
          <p>
            "ui.panel.config.entity_registry.picker.introduction"
            <p>
              "ui.panel.config.entity_registry.picker.introduction2"
            </p>
            <a href="/config/integrations">
              "ui.panel.config.entity_registry.picker.integrations_page"
            </a>
            <op-switch
              ?checked=${this._showDisabled}
              @change=${this._showDisabledChanged}
              "ui.panel.config.entity_registry.picker.show_disabled"
            </op-switch>
          </div>
        </p>
        <op-data-table
          .columns=${this._columns(this.opp.language)}
          .data=${this._filteredEntities(this._entities, this._showDisabled)}
          @row-click=${this._openEditEntry}
          id="entity_id"
        >
        </op-data-table>
        </div>
      </opp-subpage>
    `;
  }

  protected firstUpdated(changedProps): void {
    super.firstUpdated(changedProps);
    loadEntityRegistryDetailDialog();
  }

  protected updated(changedProps) {
    super.updated(changedProps);
    if (!this._unsubEntities) {
      this._unsubEntities = subscribeEntityRegistry(
        this.opp.connection,
        (entities) => {
          this._entities = entities;
        }
      );
    }
  }

  private _showDisabledChanged(ev: Event) {
    this._showDisabled = (ev.target as OpSwitch).checked;
  }

  private _openEditEntry(ev: CustomEvent): void {
    const entryId = (ev.detail as RowClickedEvent).id;
    const entry = this._entities!.find(
      (entity) => entity.entity_id === entryId
    );
    if (!entry) {
      return;
    }
    showEntityRegistryDetailDialog(this, {
      entry,
    });
  }

  static get styles(): CSSResult {
    return css`
      a {
        color: var(--primary-color);
      }
      h2 {
        margin-top: 0;
        font-family: var(--paper-font-display1_-_font-family);
        -webkit-font-smoothing: var(
          --paper-font-display1_-_-webkit-font-smoothing
        );
        font-size: var(--paper-font-display1_-_font-size);
        font-weight: var(--paper-font-display1_-_font-weight);
        letter-spacing: var(--paper-font-display1_-_letter-spacing);
        line-height: var(--paper-font-display1_-_line-height);
        opacity: var(--dark-primary-opacity);
      }
      p {
        font-family: var(--paper-font-subhead_-_font-family);
        -webkit-font-smoothing: var(
          --paper-font-subhead_-_-webkit-font-smoothing
        );
        font-size: var(--paper-font-subhead_-_font-size);
        font-weight: var(--paper-font-subhead_-_font-weight);
        line-height: var(--paper-font-subhead_-_line-height);
        opacity: var(--dark-primary-opacity);
      }
      .intro {
        padding: 24px 16px 0;
      }
      .content {
        padding: 4px;
      }
      op-data-table {
        margin-bottom: 24px;
        margin-top: 0px;
      }
      op-switch {
        margin-top: 16px;
      }
    `;
  }
}

customElements.define("op-config-entity-registry", OpConfigEntityRegistry);
