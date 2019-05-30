import {
  LitElement,
  property,
  TemplateResult,
  html,
  customElement,
  css,
  CSSResult,
} from "lit-element";
import "../components/op-menu-button";
import "../components/op-paper-icon-button-arrow-prev";

@customElement("opp-subpage")
class HassSubpage extends LitElement {
  @property()
  public header?: string;

  @property({ type: Boolean })
  public root = false;

  @property({ type: Boolean })
  public oppio = false;

  protected render(): TemplateResult | void {
    return html`
      <div class="toolbar">
        ${this.root
          ? html`
              <op-menu-button .oppio=${this.oppio}></op-menu-button>
            `
          : html`
              <op-paper-icon-button-arrow-prev
                .oppio=${this.oppio}
                @click=${this._backTapped}
              ></op-paper-icon-button-arrow-prev>
            `}

        <div main-title>${this.header}</div>
        <slot name="toolbar-icon"></slot>
      </div>
      <div class="content"><slot></slot></div>
    `;
  }

  private _backTapped(): void {
    history.back();
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        height: 100%;
        background-color: var(--primary-background-color);
      }

      .toolbar {
        display: flex;
        align-items: center;
        font-size: 20px;
        height: 64px;
        padding: 0 16px;
        pointer-events: none;
        background-color: var(--primary-color);
        font-weight: 400;
        color: var(--text-primary-color, white);
      }

      op-menu-button,
      op-paper-icon-button-arrow-prev,
      ::slotted([slot="toolbar-icon"]) {
        pointer-events: auto;
      }

      [main-title] {
        margin: 0 0 0 24px;
        line-height: 20px;
        flex-grow: 1;
      }

      .content {
        position: relative;
        width: 100%;
        height: calc(100% - 64px);
        overflow-y: auto;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "opp-subpage": HassSubpage;
  }
}
