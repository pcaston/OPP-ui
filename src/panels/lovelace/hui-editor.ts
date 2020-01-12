import {
  customElement,
  LitElement,
  html,
  TemplateResult,
  CSSResult,
  css,
  property,
} from "lit-element";
import { classMap } from "lit-html/directives/class-map";
import { safeDump, safeLoad } from "js-yaml";

import "@polymer/app-layout/app-header-layout/app-header-layout";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@material/mwc-button";
import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-spinner/paper-spinner";

import { struct } from "./common/structs/struct";
import { Lovelace } from "./types";

import "../../components/op-icon";
import { opStyle } from "../../resources/styles";
import "../../components/op-code-editor";
// This is not a duplicate import, one is for types, one is for element.
// tslint:disable-next-line
import { OpCodeEditor } from "../../components/op-code-editor";
import { OpenPeerPower } from "../../types";
import { computeRTL } from "../../common/util/compute_rtl";

const lovelaceStruct = struct.interface({
  title: "string?",
  views: ["object"],
  resources: struct.optional(["object"]),
});

@customElement("hui-editor")
class LovelaceFullConfigEditor extends LitElement {
  @property() public opp!: OpenPeerPower;
  @property() public lovelace?: Lovelace;
  @property() public closeEditor?: () => void;
  @property() private _saving?: boolean;
  @property() private _changed?: boolean;

  private _generation = 1;

  public render(): TemplateResult | void {
    return html`
      <app-header-layout>
        <app-header>
          <app-toolbar>
            <paper-icon-button
              icon="opp:close"
              @click="${this._closeEditor}"
            ></paper-icon-button>
            <div main-title>
              ${this.opp!.localize(
                "ui.panel.lovelace.editor.raw_editor.header"
              )}
            </div>
            <div
              class="save-button
              ${classMap({
                saved: this._saving! === false || this._changed === true,
              })}"
            >
              ${this._changed
                ? this.opp!.localize(
                    "ui.panel.lovelace.editor.raw_editor.unsaved_changes"
                  )
                : this.opp!.localize(
                    "ui.panel.lovelace.editor.raw_editor.saved"
                  )}
            </div>
            <mwc-button
              raised
              @click="${this._handleSave}"
              .disabled=${!this._changed}
              >${this.opp!.localize(
                "ui.panel.lovelace.editor.raw_editor.save"
              )}</mwc-button
            >
          </app-toolbar>
        </app-header>
        <div class="content">
          <op-code-editor
            mode="yaml"
            autofocus
            .rtl=${computeRTL(this.opp)}
            .opp="${this.opp}"
            @value-changed="${this._yamlChanged}"
            @editor-save="${this._handleSave}"
          >
          </op-code-editor>
        </div>
      </app-header-layout>
    `;
  }

  protected firstUpdated() {
    this.yamlEditor.value = safeDump(this.lovelace!.config);
  }

  static get styles(): CSSResult[] {
    return [
      opStyle,
      css`
        :host {
          --code-mirror-height: 100%;
        }

        app-header-layout {
          height: 100vh;
        }

        app-toolbar {
          background-color: var(--dark-background-color, #455a64);
          color: var(--dark-text-color);
        }

        mwc-button[disabled] {
          background-color: var(--mdc-theme-on-primary);
          border-radius: 4px;
        }

        .comments {
          font-size: 16px;
        }

        .content {
          height: calc(100vh - 68px);
        }

        hui-code-editor {
          height: 100%;
        }

        .save-button {
          opacity: 0;
          font-size: 14px;
          padding: 0px 10px;
        }

        .saved {
          opacity: 1;
        }
      `,
    ];
  }

  private _yamlChanged() {
    this._changed = !this.yamlEditor
      .codemirror!.getDoc()
      .isClean(this._generation);
    if (this._changed && !window.onbeforeunload) {
      window.onbeforeunload = () => {
        return true;
      };
    } else if (!this._changed && window.onbeforeunload) {
      window.onbeforeunload = null;
    }
  }

  private _closeEditor() {
    if (this._changed) {
      if (
        !confirm(
          this.opp.localize(
            "ui.panel.lovelace.editor.raw_editor.confirm_unsaved_changes"
          )
        )
      ) {
        return;
      }
    }
    window.onbeforeunload = null;
    if (this.closeEditor) {
      this.closeEditor();
    }
  }

  private async _handleSave() {
    this._saving = true;

    if (this.yamlEditor.hasComments) {
      if (
        !confirm(
          this.opp.localize(
            "ui.panel.lovelace.editor.raw_editor.confirm_unsaved_comments"
          )
        )
      ) {
        return;
      }
    }

    let value;
    try {
      value = safeLoad(this.yamlEditor.value);
    } catch (err) {
      alert(
        this.opp.localize(
          "ui.panel.lovelace.editor.raw_editor.error_parse_yaml",
          "error",
          err
        )
      );
      this._saving = false;
      return;
    }
    try {
      value = lovelaceStruct(value);
    } catch (err) {
      alert(
        this.opp.localize(
          "ui.panel.lovelace.editor.raw_editor.error_invalid_config",
          "error",
          err
        )
      );
      return;
    }
    try {
      await this.lovelace!.saveConfig(value);
    } catch (err) {
      alert(
        this.opp.localize(
          "ui.panel.lovelace.editor.raw_editor.error_save_yaml",
          "error",
          err
        )
      );
    }
    this._generation = this.yamlEditor
      .codemirror!.getDoc()
      .changeGeneration(true);
    window.onbeforeunload = null;
    this._saving = false;
    this._changed = false;
  }

  private get yamlEditor(): OpCodeEditor {
    return this.shadowRoot!.querySelector("op-code-editor")! as OpCodeEditor;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-editor": LovelaceFullConfigEditor;
  }
}
