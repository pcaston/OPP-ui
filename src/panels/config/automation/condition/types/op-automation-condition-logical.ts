import { customElement, html, LitElement, property } from "lit-element";
import { fireEvent } from "../../../../../common/dom/fire_event";
import { OpenPeerPower } from "../../../../../types";
import { ConditionElement } from "../op-automation-condition-row";
import "../op-automation-condition";
import { LogicalCondition } from "../../../../../data/automation";

@customElement("op-automation-condition-logical")
export class OpLogicalCondition extends LitElement implements ConditionElement {
  @property() public opp!: OpenPeerPower;
  @property() public condition!: LogicalCondition;

  public static get defaultConfig() {
    return { conditions: [{ condition: "state" }] };
  }

  protected render() {
    return html`
      <op-automation-condition
        .conditions=${this.condition.conditions || []}
        @value-changed=${this._valueChanged}
        .opp=${this.opp}
      ></op-automation-condition>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    fireEvent(this, "value-changed", {
      value: { ...this.condition, conditions: ev.detail.value },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-automation-condition-logical": OpLogicalCondition;
  }
}
