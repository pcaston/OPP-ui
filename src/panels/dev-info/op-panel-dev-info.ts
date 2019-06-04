import {
  LitElement,
  html,
  PropertyDeclarations,
  CSSResult,
  css,
  TemplateResult,
} from "lit-element";
import "@polymer/app-layout/app-header-layout/app-header-layout";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import "../../components/op-menu-button";

import { OpenPeerPower } from "../../types";
import { haStyle } from "../../resources/styles";

import "./system-log-card";
import "./error-log-card";
import "./system-health-card";

const JS_VERSION = __BUILD__;
const OPT_IN_PANEL = "states";

class HaPanelDevInfo extends LitElement {
  public opp?: OpenPeerPower;

  static get properties(): PropertyDeclarations {
    return {
      opp: {},
    };
  }

  protected render(): TemplateResult | void {
    const opp = this.opp;
    if (!opp) {
      return html``;
    }
    const customUiList: Array<{ name: string; url: string; version: string }> =
      (window as any).CUSTOM_UI_LIST || [];

    const nonDefaultLink =
      localStorage.defaultPage === OPT_IN_PANEL && OPT_IN_PANEL === "states"
        ? "/lovelace"
        : "/states";

    const nonDefaultLinkText =
      localStorage.defaultPage === OPT_IN_PANEL && OPT_IN_PANEL === "states"
        ? "Go to the Lovelace UI"
        : "Go to the states UI";

    const defaultPageText = `${
      localStorage.defaultPage === OPT_IN_PANEL ? "Remove" : "Set"
    } ${OPT_IN_PANEL} as default page on this device`;

    return html`
      <app-header-layout has-scrolling-region>
        <app-header slot="header" fixed>
          <app-toolbar>
            <op-menu-button></op-menu-button>
            <div main-title>About</div>
          </app-toolbar>
        </app-header>

        <div class="content">
          <div class="about">
            <p class="version">
              <a href="https://www..io" target="_blank"
                ><img src="/static/icons/favicon-192x192.png" height="192"/></a
              ><br />
              Open Peer Power<br />
              ${opp.config.version}
            </p>
            <p>
              Path to configuration.yaml: ${opp.config.config_dir}
            </p>
            <p class="develop">
              <a
                href="https://www..io/developers/credits/"
                target="_blank"
              >
                Developed by a bunch of awesome people.
              </a>
            </p>
            <p>
              Published under the Apache 2.0 license<br />
              Source:
              <a
                href="https://github.com//"
                target="_blank"
                >server</a
              >
              &mdash;
              <a
                href="https://github.com//-polymer"
                target="_blank"
                >frontend-ui</a
              >
            </p>
            <p>
              Built using
              <a href="https://www.python.org">Python 3</a>,
              <a href="https://www.polymer-project.org" target="_blank"
                >Polymer</a
              >, Icons by
              <a href="https://www.google.com/design/icons/" target="_blank"
                >Google</a
              >
              and
              <a href="https://MaterialDesignIcons.com" target="_blank"
                >MaterialDesignIcons.com</a
              >.
            </p>
            <p>
              Frontend JavaScript version: ${JS_VERSION}
              ${customUiList.length > 0
                ? html`
                    <div>
                      Custom UIs:
                      ${customUiList.map(
                        (item) => html`
                          <div>
                            <a href="${item.url}" target="_blank">
                              ${item.name}</a
                            >: ${item.version}
                          </div>
                        `
                      )}
                    </div>
                  `
                : ""}
            </p>
            <p>
              <a href="${nonDefaultLink}">${nonDefaultLinkText}</a><br />
              <mwc-button @click="${this._toggleDefaultPage}" raised>
                ${defaultPageText}
              </mwc-button>
            </p>
          </div>
          <system-health-card .opp=${this.opp}></system-health-card>
          <system-log-card .opp=${this.opp}></system-log-card>
          <error-log-card .opp=${this.opp}></error-log-card>
        </div>
      </app-header-layout>
    `;
  }

  protected firstUpdated(changedProps): void {
    super.firstUpdated(changedProps);

    // Legacy custom UI can be slow to register, give them time.
    const customUI = ((window as any).CUSTOM_UI_LIST || []).length;
    setTimeout(() => {
      if (((window as any).CUSTOM_UI_LIST || []).length !== customUI.length) {
        this.requestUpdate();
      }
    }, 1000);
  }

  protected _toggleDefaultPage(): void {
    if (localStorage.defaultPage === OPT_IN_PANEL) {
      delete localStorage.defaultPage;
    } else {
      localStorage.defaultPage = OPT_IN_PANEL;
    }
    this.requestUpdate();
  }

  static get styles(): CSSResult[] {
    return [
      haStyle,
      css`
        :host {
          -ms-user-select: initial;
          -webkit-user-select: initial;
          -moz-user-select: initial;
        }

        .content {
          padding: 16px 0px 16px 0;
          direction: ltr;
        }

        .about {
          text-align: center;
          line-height: 2em;
        }

        .version {
          @apply --paper-font-headline;
        }

        .develop {
          @apply --paper-font-subhead;
        }

        .about a {
          color: var(--dark-primary-color);
        }

        system-health-card {
          display: block;
          max-width: 600px;
          margin: 0 auto;
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-panel-dev-info": HaPanelDevInfo;
  }
}

customElements.define("op-panel-dev-info", HaPanelDevInfo);
