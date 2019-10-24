import { property, customElement, PropertyValues } from "lit-element";
import { PolymerElement } from "@polymer/polymer";

import { OpenPeerPower, Panels } from "../types";
import {
  OppRouterPage,
  RouterOptions,
  RouteOptions,
} from "./opp-router-page";
import { removeInitSkeleton } from "../util/init-skeleton";

const CACHE_COMPONENTS = ["lovelace", "states"];
const COMPONENTS = {
  calendar: () =>
    import(/* webpackChunkName: "panel-calendar" */ "../panels/calendar/op-panel-calendar"),
  config: () =>
    import(/* webpackChunkName: "panel-config" */ "../panels/config/op-panel-config"),
  custom: () =>
    import(/* webpackChunkName: "panel-custom" */ "../panels/custom/op-panel-custom"),
  "dev-event": () =>
    import(/* webpackChunkName: "panel-dev-event" */ "../panels/dev-event/op-panel-dev-event"),
  "dev-info": () =>
    import(/* webpackChunkName: "panel-dev-info" */ "../panels/dev-info/op-panel-dev-info"),
  "dev-mqtt": () =>
    import(/* webpackChunkName: "panel-dev-mqtt" */ "../panels/dev-mqtt/op-panel-dev-mqtt"),
  "dev-service": () =>
    import(/* webpackChunkName: "panel-dev-service" */ "../panels/dev-service/op-panel-dev-service"),
  "dev-state": () =>
    import(/* webpackChunkName: "panel-dev-state" */ "../panels/dev-state/op-panel-dev-state"),
  "dev-template": () =>
    import(/* webpackChunkName: "panel-dev-template" */ "../panels/dev-template/op-panel-dev-template"),
  lovelace: () =>
    import(/* webpackChunkName: "panel-lovelace" */ "../panels/lovelace/op-panel-lovelace"),
  states: () =>
    import(/* webpackChunkName: "panel-states" */ "../panels/states/op-panel-states"),
  history: () =>
    import(/* webpackChunkName: "panel-history" */ "../panels/history/op-panel-history"),
  iframe: () =>
    import(/* webpackChunkName: "panel-iframe" */ "../panels/iframe/op-panel-iframe"),
  kiosk: () =>
    import(/* webpackChunkName: "panel-kiosk" */ "../panels/kiosk/op-panel-kiosk"),
  logbook: () =>
    import(/* webpackChunkName: "panel-logbook" */ "../panels/logbook/op-panel-logbook"),
  mailbox: () =>
    import(/* webpackChunkName: "panel-mailbox" */ "../panels/mailbox/op-panel-mailbox"),
  map: () =>
    import(/* webpackChunkName: "panel-map" */ "../panels/map/op-panel-map"),
  profile: () =>
    import(/* webpackChunkName: "panel-profile" */ "../panels/profile/op-panel-profile"),
  "shopping-list": () =>
    import(/* webpackChunkName: "panel-shopping-list" */ "../panels/shopping-list/op-panel-shopping-list"),
};

const getRoutes = (panels: Panels): RouterOptions => {
  const routes: { [route: string]: RouteOptions } = {};

  Object.values(panels).forEach((panel) => {
    routes[panel.url_path] = {
      load: COMPONENTS[panel.component_name],
      tag: `op-panel-${panel.component_name}`,
      cache: CACHE_COMPONENTS.includes(panel.component_name),
    };
  });

  return {
    showLoading: true,
    routes,
  };
};

@customElement("partial-panel-resolver")
class PartialPanelResolver extends OppRouterPage {
  @property() public opp?: OpenPeerPower;
  @property() public narrow?: boolean;

  protected updated(changedProps: PropertyValues) {
    super.updated(changedProps);

    if (!changedProps.has("opp")) {
      return;
    }

    const oldOpp = changedProps.get("opp") as this["opp"];

    if (
      this.opp!.panels &&
      (!oldOpp || oldOpp.panels !== this.opp!.panels)
    ) {
      this._updateRoutes();
    }
  }

  protected createLoadingScreen() {
    const el = super.createLoadingScreen();
    el.rootnav = true;
    return el;
  }

  protected updatePageEl(el) {
    const opp = this.opp!;

    if ("setProperties" in el) {
      // As long as we have Polymer panels
      (el as PolymerElement).setProperties({
        opp: this.opp,
        narrow: this.narrow,
        route: this.routeTail,
        panel: opp.panels[opp.panelUrl],
      });
    } else {
      el.opp = opp;
      el.narrow = this.narrow;
      el.route = this.routeTail;
      el.panel = opp.panels[opp.panelUrl];
    }
  }

  private async _updateRoutes() {
    this.routerOptions = getRoutes(this.opp!.panels);
    await this.rebuild();
    await this.pageRendered;
    removeInitSkeleton();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "partial-panel-resolver": PartialPanelResolver;
  }
}
