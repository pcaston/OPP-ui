import {
  LitElement,
  TemplateResult,
  html,
  css,
  CSSResult,
  PropertyDeclarations,
} from "lit-element";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-fab/paper-fab";

import { OpenPeerPower } from "../../../types";
import {
  Person,
  fetchPersons,
  updatePerson,
  deletePerson,
  createPerson,
} from "../../../data/person";
import "../../../components/op-card";
import "../../../layouts/opp-subpage";
import "../../../layouts/opp-loading-screen";
import { compare } from "../../../common/string/compare";
import "../op-config-section";
import {
  showPersonDetailDialog,
  loadPersonDetailDialog,
} from "./show-dialog-person-detail";
import { User, fetchUsers } from "../../../data/user";

class OpConfigPerson extends LitElement {
  public opp?: OpenPeerPower;
  public isWide?: boolean;
  private _storageItems?: Person[];
  private _configItems?: Person[];
  private _usersLoad?: Promise<User[]>;

  static get properties(): PropertyDeclarations {
    return {
      opp: {},
      isWide: {},
      _storageItems: {},
      _configItems: {},
    };
  }

  protected render(): TemplateResult | void {
    if (
      !this.opp ||
      this._storageItems === undefined ||
      this._configItems === undefined
    ) {
      return html`
        <opp-loading-screen></opp-loading-screen>
      `;
    }
    return html`
      <opp-subpage header="Persons">
        <op-config-section .isWide=${this.isWide}>
          <span slot="header">Persons</span>
          <span slot="introduction">
            Here you can define each person of interest in Open Peer Power.
            ${this._configItems.length > 0
              ? html`
                  <p>
                    Note: persons configured via configuration.yaml cannot be
                    edited via the UI.
                  </p>
                `
              : ""}
          </span>
          <op-card class="storage">
            ${this._storageItems.map((entry) => {
              return html`
                <paper-item @click=${this._openEditEntry} .entry=${entry}>
                  <paper-item-body>
                    ${entry.name}
                  </paper-item-body>
                </paper-item>
              `;
            })}
            ${this._storageItems.length === 0
              ? html`
                  <div class="empty">
                    Looks like you have not created any persons yet.
                    <mwc-button @click=${this._createPerson}>
                      CREATE PERSON</mwc-button
                    >
                  </div>
                `
              : html``}
          </op-card>
          ${this._configItems.length > 0
            ? html`
                <op-card header="Configuration.yaml persons">
                  ${this._configItems.map((entry) => {
                    return html`
                      <paper-item>
                        <paper-item-body>
                          ${entry.name}
                        </paper-item-body>
                      </paper-item>
                    `;
                  })}
                </op-card>
              `
            : ""}
        </op-config-section>
      </opp-subpage>

      <paper-fab
        ?is-wide=${this.isWide}
        icon="opp:plus"
        title="Create Area"
        @click=${this._createPerson}
      ></paper-fab>
    `;
  }

  protected firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this._fetchData();
    loadPersonDetailDialog();
  }

  private async _fetchData() {
    this._usersLoad = fetchUsers(this.opp!);
    const personData = await fetchPersons(this.opp!);

    this._storageItems = personData.storage.sort((ent1, ent2) =>
      compare(ent1.name, ent2.name)
    );
    this._configItems = personData.config.sort((ent1, ent2) =>
      compare(ent1.name, ent2.name)
    );
  }

  private _createPerson() {
    this._openDialog();
  }

  private _openEditEntry(ev: MouseEvent) {
    const entry: Person = (ev.currentTarget! as any).entry;
    this._openDialog(entry);
  }

  private _allowedUsers(users: User[], currentPerson?: Person) {
    const used = new Set();
    for (const coll of [this._configItems, this._storageItems]) {
      for (const pers of coll!) {
        if (pers.user_id) {
          used.add(pers.user_id);
        }
      }
    }
    const currentUserId = currentPerson ? currentPerson.user_id : undefined;
    return users.filter(
      (user) => user.id === currentUserId || !used.has(user.id)
    );
  }

  private async _openDialog(entry?: Person) {
    const users = await this._usersLoad!;

    showPersonDetailDialog(this, {
      entry,
      users: this._allowedUsers(users, entry),
      createEntry: async (values) => {
        const created = await createPerson(this.opp!, values);
        this._storageItems = this._storageItems!.concat(created).sort(
          (ent1, ent2) => compare(ent1.name, ent2.name)
        );
      },
      updateEntry: async (values) => {
        const updated = await updatePerson(this.opp!, entry!.id, values);
        this._storageItems = this._storageItems!.map((ent) =>
          ent === entry ? updated : ent
        );
      },
      removeEntry: async () => {
        if (
          !confirm(`Are you sure you want to delete this person?

All devices belonging to this person will become unassigned.`)
        ) {
          return false;
        }

        try {
          await deletePerson(this.opp!, entry!.id);
          this._storageItems = this._storageItems!.filter(
            (ent) => ent !== entry
          );
          return true;
        } catch (err) {
          return false;
        }
      },
    });
  }

  static get styles(): CSSResult {
    return css`
      a {
        color: var(--primary-color);
      }
      op-card {
        max-width: 600px;
        margin: 16px auto;
        overflow: hidden;
      }
      .empty {
        text-align: center;
        padding: 8px;
      }
      paper-item {
        padding-top: 4px;
        padding-bottom: 4px;
      }
      op-card.storage paper-item {
        cursor: pointer;
      }
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
    `;
  }
}

customElements.define("op-config-person", OpConfigPerson);
