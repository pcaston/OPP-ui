import { property, PropertyValues, customElement } from "lit-element";
import "../../layouts/opp-loading-screen";
import isComponentLoaded from "../../common/config/is_component_loaded";
import { OpenPeerPower } from "../../types";
import { CloudStatus, fetchCloudStatus } from "../../data/cloud";
import { listenMediaQuery } from "../../common/dom/media_query";
import { OppRouterPage, RouterOptions } from "../../layouts/opp-router-page";

@customElement("op-panel-config")
class HaPanelConfig extends OppRouterPage {
  @property() public opp!: OpenPeerPower;
  @property() public _wideSidebar: boolean = false;
  @property() public _wide: boolean = false;

  protected routerOptions: RouterOptions = {
    defaultPage: "dashboard",
    cacheAll: true,
    preloadAll: true,
    routes: {
      area_registry: {
        tag: "op-config-area-registry",
        load: () =>
          import(/* webpackChunkName: "panel-config-area-registry" */ "./area_registry/op-config-area-registry"),
      },
      automation: {
        tag: "op-config-automation",
        load: () =>
          import(/* webpackChunkName: "panel-config-automation" */ "./automation/op-config-automation"),
      },
      cloud: {
        tag: "op-config-cloud",
        load: () =>
          import(/* webpackChunkName: "panel-config-cloud" */ "./cloud/op-config-cloud"),
      },
      core: {
        tag: "op-config-core",
        load: () =>
          import(/* webpackChunkName: "panel-config-core" */ "./core/op-config-core"),
      },
      customize: {
        tag: "op-config-customize",
        load: () =>
          import(/* webpackChunkName: "panel-config-customize" */ "./customize/op-config-customize"),
      },
      dashboard: {
        tag: "op-config-dashboard",
        load: () =>
          import(/* webpackChunkName: "panel-config-dashboard" */ "./dashboard/op-config-dashboard"),
      },
      entity_registry: {
        tag: "op-config-entity-registry",
        load: () =>
          import(/* webpackChunkName: "panel-config-entity-registry" */ "./entity_registry/op-config-entity-registry"),
      },
      integrations: {
        tag: "op-config-integrations",
        load: () =>
          import(/* webpackChunkName: "panel-config-integrations" */ "./integrations/op-config-integrations"),
      },
      person: {
        tag: "op-config-person",
        load: () =>
          import(/* webpackChunkName: "panel-config-person" */ "./person/op-config-person"),
      },
      script: {
        tag: "op-config-script",
        load: () =>
          import(/* webpackChunkName: "panel-config-script" */ "./script/op-config-script"),
      },
      users: {
        tag: "op-config-users",
        load: () =>
          import(/* webpackChunkName: "panel-config-users" */ "./users/op-config-users"),
      },
      zha: {
        tag: "zopp-config-panel",
        load: () =>
          import(/* webpackChunkName: "panel-config-zha" */ "./zha/zha-config-panel"),
      },
      zwave: {
        tag: "op-config-zwave",
        load: () =>
          import(/* webpackChunkName: "panel-config-zwave" */ "./zwave/op-config-zwave"),
      },
    },
  };

  @property() private _cloudStatus?: CloudStatus;

  private _listeners: Array<() => void> = [];

  public connectedCallback() {
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

  public disconnectedCallback() {
    super.disconnectedCallback();
    while (this._listeners.length) {
      this._listeners.pop()!();
    }
  }

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);
    if (isComponentLoaded(this.opp, "cloud")) {
      this._updateCloudStatus();
    }
    this.addEventListener("op-refresh-cloud-status", () =>
      this._updateCloudStatus()
    );
  }

  protected updatePageEl(el) {
    el.route = this.routeTail;
    el.opp = this.opp;
    el.isWide = this.opp.dockedSidebar ? this._wideSidebar : this._wide;
    el.cloudStatus = this._cloudStatus;
  }

  private async _updateCloudStatus() {
    this._cloudStatus = await fetchCloudStatus(this.opp);

    if (this._cloudStatus.cloud === "connecting") {
      setTimeout(() => this._updateCloudStatus(), 5000);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-panel-config": HaPanelConfig;
  }
}
