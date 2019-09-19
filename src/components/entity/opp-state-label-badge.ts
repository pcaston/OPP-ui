import {
  LitElement,
  html,
  PropertyValues,
  TemplateResult,
  css,
  CSSResult,
  customElement,
  property,
} from "lit-element";

import { OppEntity } from "../../open-peer-power-js-websocket/lib";
import { classMap } from "lit-html/directives/class-map";
import { fireEvent } from "../../common/dom/fire_event";
import { OpenPeerPower } from "../../types";

import computeStateDomain from "../../common/entity/compute_state_domain";
import computeStateName from "../../common/entity/compute_state_name";
import domainIcon from "../../common/entity/domain_icon";
import stateIcon from "../../common/entity/state_icon";
import timerTimeRemaining from "../../common/entity/timer_time_remaining";
import secondsToDuration from "../../common/datetime/seconds_to_duration";

import "../opp-label-badge";

@customElement("opp-state-label-badge")
export class OppStateLabelBadge extends LitElement {
  @property({ type : Object }) opp?: OpenPeerPower;
  @property({ type : Object }) state?: OppEntity;
  @property({ type : String }) _timerTimeRemaining?: number;

  private _connected?: boolean;

  private _updateRemaining?: number;

  public connectedCallback(): void {
    super.connectedCallback();
    this._connected = true;
    this.startInterval(this.state);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._connected = false;
    this.clearInterval();
  }

  protected render(): TemplateResult | void {
    debugger;
    const state = this.state;
    console.log("render opp-state-label-badge");

    if (!state) {
      return html`
        <opp-label-badge
          class="warning"
          label="state_badge.default.error"
          icon="opp:alert"
          description="entity_not_found"
        ></opp-label-badge>
      `;
    }

    const domain = computeStateDomain(state);
    return html`
      <opp-label-badge
        class="${classMap({
          [domain]: true,
          "has-unit_of_measurement": "unit_of_measurement" in state.attributes,
        })}"
        .value="${this._computeValue(domain, state)}"
        .icon="${this._computeIcon(domain, state)}"
        .image="${state.attributes.entity_picture}"
        .label="${this._computeLabel(domain, state, this._timerTimeRemaining)}"
        .description="${computeStateName(state)}"
      ></opp-label-badge>
    `;
  }

  protected firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (this.state) {
        fireEvent(this, "opp-more-info", { entityId: this.state.entity_id });
      }
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (this._connected && changedProperties.has("state")) {
      this.startInterval(this.state);
    }
  }

  private _computeValue(domain: string, state: OppEntity) {
    switch (domain) {
      case "binary_sensor":
      case "device_tracker":
      case "updater":
      case "sun":
      case "alarm_control_panel":
      case "timer":
        return null;
      case "sensor":
      default:
        return state.state === "unknown"
          ? "-"
          : `component.${domain}.state.${state.state}` ||
              state.state;
    }
  }

  private _computeIcon(domain: string, state: OppEntity) {
    if (state.state === "unavailable") {
      return null;
    }
    switch (domain) {
      case "alarm_control_panel":
        if (state.state === "pending") {
          return "opp:clock-fast";
        }
        if (state.state === "armed_away") {
          return "opp:nature";
        }
        if (state.state === "armed_home") {
          return "opp:home-variant";
        }
        if (state.state === "armed_night") {
          return "opp:weather-night";
        }
        if (state.state === "armed_custom_bypass") {
          return "opp:shield-home";
        }
        if (state.state === "triggered") {
          return "opp:alert-circle";
        }
        // state == 'disarmed'
        return domainIcon(domain, state.state);
      case "binary_sensor":
      case "device_tracker":
      case "updater":
      case "person":
        return stateIcon(state);
      case "sun":
        return state.state === "above_horizon"
          ? domainIcon(domain)
          : "opp:brightness-3";
      case "timer":
        return state.state === "active" ? "opp:timer" : "opp:timer-off";
      default:
        return null;
    }
  }

  private _computeLabel(domain, state, _timerTimeRemaining) {
    if (
      state.state === "unavailable" ||
      ["device_tracker", "alarm_control_panel", "person"].includes(domain)
    ) {
      // Localize the state with a special state_badge namespace, which has variations of
      // the state translations that are truncated to fit within the badge label. Translations
      // are only added for device_tracker, alarm_control_panel and person.
      return (
        `state_badge.${domain}.${state.state}` ||
        `state_badge.default.${state.state}` ||
        state.state
      );
    }
    if (domain === "timer") {
      return secondsToDuration(_timerTimeRemaining);
    }
    return state.attributes.unit_of_measurement || null;
  }

  private clearInterval() {
    if (this._updateRemaining) {
      clearInterval(this._updateRemaining);
      this._updateRemaining = undefined;
    }
  }

  private startInterval(stateObj) {
    this.clearInterval();
    if (stateObj && computeStateDomain(stateObj) === "timer") {
      this.calculateTimerRemaining(stateObj);

      if (stateObj.state === "active") {
        this._updateRemaining = window.setInterval(
          () => this.calculateTimerRemaining(this.state),
          1000
        );
      }
    }
  }

  private calculateTimerRemaining(stateObj) {
    this._timerTimeRemaining = timerTimeRemaining(stateObj);
  }

  static get styles(): CSSResult {
    return css`
      :host {
        cursor: pointer;
      }

      opp-label-badge {
        --opp-label-badge-color: var(--label-badge-red, #df4c1e);
      }
      opp-label-badge.has-unit_of_measurement {
        --opp-label-badge-label-text-transform: none;
      }

      opp-label-badge.binary_sensor,
      opp-label-badge.updater {
        --opp-label-badge-color: var(--label-badge-blue, #039be5);
      }

      .red {
        --opp-label-badge-color: var(--label-badge-red, #df4c1e);
      }

      .blue {
        --opp-label-badge-color: var(--label-badge-blue, #039be5);
      }

      .green {
        --opp-label-badge-color: var(--label-badge-green, #0da035);
      }

      .yellow {
        --opp-label-badge-color: var(--label-badge-yellow, #f4b400);
      }

      .grey {
        --opp-label-badge-color: var(--label-badge-grey, var(--paper-grey-500));
      }

      .warning {
        --opp-label-badge-color: var(--label-badge-yellow, #fce588);
      }
    `;
  }
  constructor() {
    super();
    console.log("OPP-state-label-badge constructor");
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "opp-state-label-badge": OppStateLabelBadge;
  }
}
