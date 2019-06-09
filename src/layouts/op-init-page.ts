import "@polymer/paper-spinner/paper-spinner-lite";
import "@material/mwc-button";

import { LitElement, html, CSSResult, css, property } from "lit-element";
import { removeInitSkeleton } from "../util/init-skeleton";

class HaInitPage extends LitElement {
  @property({ type: Boolean }) public error = false;

  protected render() {
    return html`
      <div>
        <img src="/images/manifest/icon-48x48.png" height="192" />
        <img src="/static/icons/favicon-192x192.png" height="192" />
        ${this.error
          ? html`
              <p>Unable to connect to Open Peer Power.</p>
              <mwc-button @click=${this._retry}>Retry</mwc-button>
            `
          : html`
              <paper-spinner-lite active></paper-spinner-lite>
              <p>Loading data</p>
            `}
      </div>
    `;
  }

  protected firstUpdated() {
    removeInitSkeleton();
  }

  private _retry() {
    location.reload();
  }

  static get styles(): CSSResult {
    return css`
      div {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      paper-spinner-lite {
        margin-top: 9px;
      }
      a {
        color: var(--primary-color);
      }
      p {
        max-width: 350px;
      }
    `;
  }
}

customElements.define("op-init-page", HaInitPage);
