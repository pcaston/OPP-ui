import {
  customElement,
  LitElement,
  html,
  property,
  TemplateResult,
  query,
} from "lit-element";
import { OpFormElement, OpFormSelectData, OpFormSelectSchema } from "./op-form";
import { fireEvent } from "../../common/dom/fire_event";

import "@polymer/paper-dropdown-menu/paper-dropdown-menu";
import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-item/paper-item";

@customElement("op-form-select")
export class OpFormSelect extends LitElement implements OpFormElement {
  @property() public schema!: OpFormSelectSchema;
  @property() public data!: OpFormSelectData;
  @property() public label!: string;
  @property() public suffix!: string;
  @query("paper-dropdown-menu") private _input?: HTMLElement;

  public focus() {
    if (this._input) {
      this._input.focus();
    }
  }

  protected render(): TemplateResult {
    return html`
      <paper-dropdown-menu .label=${this.label}>
        <paper-listbox
          slot="dropdown-content"
          attr-for-selected="item-value"
          .selected=${this.data}
          @selected-item-changed=${this._valueChanged}
        >
          ${this.schema.options!.map(
            (item) => html`
              <paper-item .itemValue=${this._optionValue(item)}>
                ${this._optionLabel(item)}
              </paper-item>
            `
          )}
        </paper-listbox>
      </paper-dropdown-menu>
    `;
  }

  private _optionValue(item) {
    return Array.isArray(item) ? item[0] : item;
  }

  private _optionLabel(item) {
    return Array.isArray(item) ? item[1] : item;
  }

  private _valueChanged(ev: CustomEvent) {
    if (!ev.detail.value) {
      return;
    }
    fireEvent(this, "value-changed", {
      value: ev.detail.value.itemValue,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-form-select": OpFormSelect;
  }
}
