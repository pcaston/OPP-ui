import "@polymer/app-layout/app-toolbar/app-toolbar";
import "@polymer/paper-spinner/paper-spinner-lite";
import {
  LitElement,
  TemplateResult,
  html,
  CSSResultArray,
  css,
  customElement,
  property,
} from "lit-element";
import "../components/op-menu-button";
import "../components/op-paper-icon-button-arrow-prev";
import { opStyle } from "../resources/styles";

@customElement("opp-loading-screen")
class OppLoadingScreen extends LitElement {
  @property({ type: Boolean }) public rootnav? = false;

  protected render(): TemplateResult | void {
    debugger;
    return html`
      <app-toolbar>
        ${this.rootnav
          ? html`
              <op-menu-button></op-menu-button>
            `
          : html`
              <op-paper-icon-button-arrow-prev
                @click=${this._handleBack}
              ></op-paper-icon-button-arrow-prev>
            `}
      </app-toolbar>
      <div class="content">
        <paper-spinner-lite active></paper-spinner-lite>
      </div>
    `;
  }

  private _handleBack() {
    history.back();
  }

  static get styles(): CSSResultArray {
    return [
      opStyle,
      css`
        .content {
          height: calc(100% - 64px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "opp-loading-screen": OppLoadingScreen;
  }
}
