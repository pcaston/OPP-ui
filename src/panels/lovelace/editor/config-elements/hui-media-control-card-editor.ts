import {
  html,
  LitElement,
  TemplateResult,
  customElement,
  property,
} from "lit-element";

import { struct } from "../../common/structs/struct";
import { EntitiesEditorEvent, EditorTarget } from "../types";
import { OpenPeerPower } from "../../../../types";
import { LovelaceCardEditor } from "../../types";
import { fireEvent } from "../../../../common/dom/fire_event";
import { MediaControlCardConfig } from "../../cards/hui-media-control-card";

import "../../../../components/entity/op-entity-picker";

const cardConfigStruct = struct({
  type: "string",
  entity: "string?",
});

@customElement("hui-media-control-card-editor")
export class HuiMediaControlCardEditor extends LitElement
  implements LovelaceCardEditor {
  @property() public opp?: OpenPeerPower;

  @property() private _config?: MediaControlCardConfig;

  public setConfig(config: MediaControlCardConfig): void {
    config = cardConfigStruct(config);
    this._config = config;
  }

  get _entity(): string {
    return this._config!.entity || "";
  }

  protected render(): TemplateResult | void {
    if (!this.opp) {
      return html``;
    }

    return html`
      <div class="card-config">
        <op-entity-picker
          .label="${this.opp.localize(
            "ui.panel.lovelace.editor.card.generic.entity"
          )} (${this.opp.localize(
            "ui.panel.lovelace.editor.card.config.required"
          )})"
          .opp="${this.opp}"
          .value="${this._entity}"
          .configValue=${"entity"}
          include-domains='["media_player"]'
          @change="${this._valueChanged}"
          allow-custom-entity
        ></op-entity-picker>
      </div>
    `;
  }

  private _valueChanged(ev: EntitiesEditorEvent): void {
    if (!this._config || !this.opp) {
      return;
    }
    const target = ev.target! as EditorTarget;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === "") {
        delete this._config[target.configValue!];
      } else {
        this._config = {
          ...this._config,
          [target.configValue!]: target.value,
        };
      }
    }
    fireEvent(this, "config-changed", { config: this._config });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-media-control-card-editor": HuiMediaControlCardEditor;
  }
}
