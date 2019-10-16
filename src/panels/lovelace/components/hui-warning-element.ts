import {
  html,
  LitElement,
  TemplateResult,
  CSSResult,
  css,
  customElement,
  property,
} from "lit-element";

import "../../../components/opp-icon";

@customElement("hui-warning-element")
export class HuiWarningElement extends LitElement {
  @property() public label?: string;

  protected render(): TemplateResult | void {
    return html`
      <opp-icon icon="opp:alert" .title="${this.label}"></opp-icon>
    `;
  }

  static get styles(): CSSResult {
    return css`
      opp-icon {
        color: #fce588;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-warning-element": HuiWarningElement;
  }
}
