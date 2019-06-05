import "@polymer/paper-icon-button/paper-icon-button";
import {
  property,
  TemplateResult,
  LitElement,
  html,
  customElement,
} from "lit-element";

import { fireEvent } from "../common/dom/fire_event";

@customElement("op-menu-button")
class HaMenuButton extends LitElement {
  @property({ type: Boolean })
  public oppio = false;

  protected render(): TemplateResult | void {
    return html`
      <paper-icon-button
        .icon=${this.oppio ? "oppio:menu" : "opp:menu"}
        @click=${this._toggleMenu}
      ></paper-icon-button>
    `;
  }

  // We are not going to use ShadowDOM as we're rendering a single element
  // without any CSS used.
  protected createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  private _toggleMenu(): void {
    fireEvent(this, "opp-toggle-menu");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-menu-button": HaMenuButton;
  }
}
