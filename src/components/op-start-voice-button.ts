import "@polymer/paper-icon-button/paper-icon-button";
import { html } from "@polymer/polymer/lib/utils/html-tag";
import { PolymerElement } from "@polymer/polymer/polymer-element";

import { EventsMixin } from "../mixins/events-mixin";

import isComponentLoaded from "../common/config/is_component_loaded";
import { fireEvent } from "../common/dom/fire_event";

/*
 * @appliesMixin EventsMixin
 */
class OpStartVoiceButton extends EventsMixin(PolymerElement) {
  static get template() {
    return html`
      <paper-icon-button
        icon="opp:microphone"
        hidden$="[[!canListen]]"
        on-click="handleListenClick"
      ></paper-icon-button>
    `;
  }

  static get properties() {
    return {
      opp: {
        type: Object,
        value: null,
      },

      canListen: {
        type: Boolean,
        computed: "computeCanListen(opp)",
        notify: true,
      },
    };
  }

  computeCanListen(opp) {
    return (
      "webkitSpeechRecognition" in window &&
      isComponentLoaded(opp, "conversation")
    );
  }

  handleListenClick() {
    fireEvent(this, "show-dialog", {
      dialogImport: () =>
        import("../dialogs/op-voice-command-dialog"),
      dialogTag: "op-voice-command-dialog",
    });
  }
}

customElements.define("op-start-voice-button", OpStartVoiceButton);
