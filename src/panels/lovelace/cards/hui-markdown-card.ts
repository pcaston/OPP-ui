import {
  html,
  LitElement,
  TemplateResult,
  customElement,
  property,
  css,
  CSSResult,
} from "lit-element";
import { classMap } from "lit-html/directives/class-map";

import "../../../components/op-card";
import "../../../components/op-markdown";

import { LovelaceCard, LovelaceCardEditor } from "../types";
import { MarkdownCardConfig } from "./types";

@customElement("hui-markdown-card")
export class HuiMarkdownCard extends LitElement implements LovelaceCard {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import(/* webpackChunkName: "hui-markdown-card-editor" */ "../editor/config-elements/hui-markdown-card-editor");
    return document.createElement("hui-markdown-card-editor");
  }

  public static getStubConfig(): object {
    return { content: " " };
  }

  @property() private _config?: MarkdownCardConfig;

  public getCardSize(): number {
    return this._config!.content.split("\n").length;
  }

  public setConfig(config: MarkdownCardConfig): void {
    if (!config.content) {
      throw new Error("Invalid Configuration: Content Required");
    }

    this._config = config;
  }

  protected render(): TemplateResult | void {
    if (!this._config) {
      return html``;
    }

    return html`
      <op-card .header="${this._config.title}">
        <op-markdown
          class="markdown ${classMap({
            "no-header": !this._config.title,
          })}"
          .content="${this._config.content}"
        ></op-markdown>
      </op-card>
    `;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        /* start paper-font-body1 style */
        font-family: "Roboto", "Noto", sans-serif;
        -webkit-font-smoothing: antialiased; /* OS X subpixel AA bleed bug */
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        /* end paper-font-body1 style */
      }
      op-markdown {
        display: block;
        padding: 0 16px 16px;
        -ms-user-select: initial;
        -webkit-user-select: initial;
        -moz-user-select: initial;
      }
      .markdown.no-header {
        padding-top: 16px;
      }
      op-markdown > *:first-child {
        margin-top: 0;
      }
      op-markdown > *:last-child {
        margin-bottom: 0;
      }
      op-markdown a {
        color: var(--primary-color);
      }
      op-markdown img {
        max-width: 100%;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-markdown-card": HuiMarkdownCard;
  }
}
