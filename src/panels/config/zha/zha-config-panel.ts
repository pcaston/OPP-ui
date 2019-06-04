import "../../../layouts/opp-loading-screen";

import { customElement, property } from "lit-element";

import { listenMediaQuery } from "../../../common/dom/media_query";
import {
  HassRouterPage,
  RouterOptions,
} from "../../../layouts/opp-router-page";
import { OpenPeerPower } from "../../../types";

@customElement("zop-config-panel")
class ZHAConfigPanel extends HassRouterPage {
  @property() public opp!: OpenPeerPower;
  @property() public _wideSidebar: boolean = false;
  @property() public _wide: boolean = false;

  protected routerOptions: RouterOptions = {
    defaultPage: "configuration",
    cacheAll: true,
    preloadAll: true,
    routes: {
      configuration: {
        tag: "op-config-zha",
        load: () =>
          import(/* webpackChunkName: "zop-configuration-page" */ "./op-config-zha"),
      },
      add: {
        tag: "zop-add-devices-page",
        load: () =>
          import(/* webpackChunkName: "zop-add-devices-page" */ "./zop-add-devices-page"),
      },
    },
  };

  private _listeners: Array<() => void> = [];

  public connectedCallback(): void {
    super.connectedCallback();
    this._listeners.push(
      listenMediaQuery("(min-width: 1040px)", (matches) => {
        this._wide = matches;
      })
    );
    this._listeners.push(
      listenMediaQuery("(min-width: 1296px)", (matches) => {
        this._wideSidebar = matches;
      })
    );
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    while (this._listeners.length) {
      this._listeners.pop()!();
    }
  }

  protected updatePageEl(el): void {
    el.route = this.routeTail;
    el.opp = this.opp;
    el.isWide = this.opp.dockedSidebar ? this._wideSidebar : this._wide;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "zop-config-panel": ZHAConfigPanel;
  }
}
