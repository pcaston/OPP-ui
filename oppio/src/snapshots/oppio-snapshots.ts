import {
  LitElement,
  TemplateResult,
  html,
  CSSResultArray,
  css,
  property,
  PropertyValues,
  customElement,
} from "lit-element";
import "@material/mwc-button";
import "@polymer/paper-card/paper-card";
import "@polymer/paper-checkbox/paper-checkbox";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-radio-button/paper-radio-button";
import "@polymer/paper-radio-group/paper-radio-group";

import "../components/oppio-card-content";
import { oppioStyle } from "../resources/oppio-style";
import { haStyle } from "../../../src/resources/styles";

import { showOppioSnapshotDialog } from "../dialogs/snapshot/show-dialog-oppio-snapshot";
import { OpenPeerPower } from "../../../src/types";
import {
  OppioSnapshot,
  fetchOppioSnapshots,
  reloadOppioSnapshots,
  OppioFullSnapshotCreateParams,
  OppioPartialSnapshotCreateParams,
  createOppioFullSnapshot,
  createOppioPartialSnapshot,
} from "../../../src/data/oppio/snapshot";
import { OppioSupervisorInfo } from "../../../src/data/oppio/supervisor";
import { PolymerChangedEvent } from "../../../src/polymer-types";
import { fireEvent } from "../../../src/common/dom/fire_event";

// Not duplicate, used for typing
// tslint:disable-next-line
import { PaperInputElement } from "@polymer/paper-input/paper-input";
// tslint:disable-next-line
import { PaperRadioGroupElement } from "@polymer/paper-radio-group/paper-radio-group";
// tslint:disable-next-line
import { PaperCheckboxElement } from "@polymer/paper-checkbox/paper-checkbox";

interface CheckboxItem {
  slug: string;
  name: string;
  checked: boolean;
}

@customElement("oppio-snapshots")
class OppioSnapshots extends LitElement {
  @property() public opp!: OpenPeerPower;
  @property() public supervisorInfo!: OppioSupervisorInfo;
  @property() private _snapshotName = "";
  @property() private _snapshotPassword = "";
  @property() private _snapshotHasPassword = false;
  @property() private _snapshotType: OppioSnapshot["type"] = "full";
  @property() private _snapshots?: OppioSnapshot[] = [];
  @property() private _addonList: CheckboxItem[] = [];
  @property() private _folderList: CheckboxItem[] = [
    {
      slug: "openpeerpower",
      name: "Open Peer Power configuration",
      checked: true,
    },
    { slug: "ssl", name: "SSL", checked: true },
    { slug: "share", name: "Share", checked: true },
    { slug: "addons/local", name: "Local add-ons", checked: true },
  ];
  @property() private _creatingSnapshot = false;
  @property() private _error = "";

  public async refreshData() {
    await reloadOppioSnapshots(this.opp);
    await this._updateSnapshots();
  }

  protected render(): TemplateResult {
    return html`
      <div class="content">
        <h1>
          Create snapshot
        </h1>
        <p class="description">
          Snapshots allow you to easily backup and restore all data of your Home
          Assistant instance.
        </p>
        <div class="card-group">
          <paper-card>
            <div class="card-content">
              <paper-input
                autofocus
                label="Name"
                name="snapshotName"
                .value=${this._snapshotName}
                @value-changed=${this._handleTextValueChanged}
              ></paper-input>
              Type:
              <paper-radio-group
                name="snapshotType"
                .selected=${this._snapshotType}
                @selected-changed=${this._handleRadioValueChanged}
              >
                <paper-radio-button name="full">
                  Full snapshot
                </paper-radio-button>
                <paper-radio-button name="partial">
                  Partial snapshot
                </paper-radio-button>
              </paper-radio-group>
              ${this._snapshotType === "full"
                ? undefined
                : html`
                    Folders:
                    ${this._folderList.map(
                      (folder, idx) => html`
                        <paper-checkbox
                          .idx=${idx}
                          .checked=${folder.checked}
                          @checked-changed=${this._folderChecked}
                        >
                          ${folder.name}
                        </paper-checkbox>
                      `
                    )}
                    Add-ons:
                    ${this._addonList.map(
                      (addon, idx) => html`
                        <paper-checkbox
                          .idx=${idx}
                          .checked="{{item.checked}}"
                          @checked-changed=${this._addonChecked}
                        >
                          ${addon.name}
                        </paper-checkbox>
                      `
                    )}
                  `}
              Security:
              <paper-checkbox
                name="snapshotHasPassword"
                .checked=${this._snapshotHasPassword}
                @checked-changed=${this._handleCheckboxValueChanged}
              >
                Password protection
              </paper-checkbox>
              ${this._snapshotHasPassword
                ? html`
                    <paper-input
                      label="Password"
                      type="password"
                      name="snapshotPassword"
                      .value=${this._snapshotPassword}
                      @value-changed=${this._handleTextValueChanged}
                    ></paper-input>
                  `
                : undefined}
              ${this._error !== ""
                ? html`
                    <p class="error">${this._error}</p>
                  `
                : undefined}
            </div>
            <div class="card-actions">
              <mwc-button
                .disabled=${this._creatingSnapshot}
                @click=${this._createSnapshot}
              >
                Create
              </mwc-button>
            </div>
          </paper-card>
        </div>

        <h1>Available snapshots</h1>
        <div class="card-group">
          ${this._snapshots === undefined
            ? undefined
            : this._snapshots.length === 0
            ? html`
                <paper-card>
                  <div class="card-content">
                    You don't have any snapshots yet.
                  </div>
                </paper-card>
              `
            : this._snapshots.map(
                (snapshot) => html`
                  <paper-card
                    class="pointer"
                    .snapshot=${snapshot}
                    @click=${this._snapshotClicked}
                  >
                    <div class="card-content">
                      <oppio-card-content
                        .opp=${this.opp}
                        .title=${snapshot.name || snapshot.slug}
                        .description=${this._computeDetails(snapshot)}
                        .datetime=${snapshot.date}
                        .icon=${snapshot.type === "full"
                          ? "oppio:package-variant-closed"
                          : "oppio:package-variant"}
                        .
                        .icon-class="snapshot"
                      ></oppio-card-content>
                    </div>
                  </paper-card>
                `
              )}
        </div>
      </div>
    `;
  }

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);
    this._updateSnapshots();
  }

  protected updated(changedProps: PropertyValues) {
    if (changedProps.has("supervisorInfo")) {
      this._addonList = this.supervisorInfo.addons
        .map((addon) => ({
          slug: addon.slug,
          name: addon.name,
          checked: true,
        }))
        .sort((a, b) => (a.name < b.name ? -1 : 1));
    }
  }

  private _handleTextValueChanged(ev: PolymerChangedEvent<string>) {
    const input = ev.currentTarget as PaperInputElement;
    this[`_${input.name}`] = ev.detail.value;
  }

  private _handleCheckboxValueChanged(ev) {
    const input = ev.currentTarget as PaperCheckboxElement;
    this[`_${input.name}`] = input.checked;
  }

  private _handleRadioValueChanged(ev: PolymerChangedEvent<string>) {
    const input = ev.currentTarget as PaperRadioGroupElement;
    this[`_${input.getAttribute("name")}`] = ev.detail.value;
  }

  private _folderChecked(ev) {
    const { idx, checked } = ev.currentTarget!;
    this._folderList = this._folderList.map((folder, curIdx) =>
      curIdx === idx ? { ...folder, checked } : folder
    );
  }

  private _addonChecked(ev) {
    const { idx, checked } = ev.currentTarget!;
    this._addonList = this._addonList.map((addon, curIdx) =>
      curIdx === idx ? { ...addon, checked } : addon
    );
  }

  private async _updateSnapshots() {
    try {
      this._snapshots = await fetchOppioSnapshots(this.opp);
      this._snapshots.sort((a, b) => (a.date < b.date ? 1 : -1));
    } catch (err) {
      this._error = err.message;
    }
  }

  private async _createSnapshot() {
    this._error = "";
    if (this._snapshotHasPassword && !this._snapshotPassword.length) {
      this._error = "Please enter a password.";
      return;
    }
    this._creatingSnapshot = true;
    await this.updateComplete;

    const name =
      this._snapshotName ||
      new Date().toLocaleDateString(navigator.language, {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    try {
      if (this._snapshotType === "full") {
        const data: OppioFullSnapshotCreateParams = { name };
        if (this._snapshotHasPassword) {
          data.password = this._snapshotPassword;
        }
        await createOppioFullSnapshot(this.opp, data);
      } else {
        const addons = this._addonList
          .filter((addon) => addon.checked)
          .map((addon) => addon.slug);
        const folders = this._folderList
          .filter((folder) => folder.checked)
          .map((folder) => folder.slug);

        const data: OppioPartialSnapshotCreateParams = {
          name,
          folders,
          addons,
        };
        if (this._snapshotHasPassword) {
          data.password = this._snapshotPassword;
        }
        await createOppioPartialSnapshot(this.opp, data);
      }
      this._updateSnapshots();
      fireEvent(this, "opp-api-called", { success: true, response: null });
    } catch (err) {
      this._error = err.message;
    } finally {
      this._creatingSnapshot = false;
    }
  }

  private _computeDetails(snapshot: OppioSnapshot) {
    const type =
      snapshot.type === "full" ? "Full snapshot" : "Partial snapshot";
    return snapshot.protected ? `${type}, password protected` : type;
  }

  private _snapshotClicked(ev) {
    showOppioSnapshotDialog(this, {
      slug: ev.currentTarget!.snapshot.slug,
      onDelete: () => this._updateSnapshots(),
    });
  }

  static get styles(): CSSResultArray {
    return [
      haStyle,
      oppioStyle,
      css`
        paper-radio-group {
          display: block;
        }
        paper-radio-button {
          padding: 0 0 2px 2px;
        }
        paper-radio-button,
        paper-checkbox,
        paper-input[type="password"] {
          display: block;
          margin: 4px 0 4px 48px;
        }
        .pointer {
          cursor: pointer;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "oppio-snapshots": OppioSnapshots;
  }
}