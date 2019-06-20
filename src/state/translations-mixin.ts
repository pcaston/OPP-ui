import { Constructor, LitElement } from "lit-element";
import { OppBaseEl } from "./opp-base-mixin";
import { computeLocalize } from "../common/translations/localize";
import { computeRTL } from "../common/util/compute_rtl";
import { OpenPeerPower } from "../types";
import { getOppTranslations } from "../data/translation";

/*
 * superClass needs to contain `this.opp` and `this._updateOpp`.
 */

export default (superClass: Constructor<LitElement & OppBaseEl>) =>
  class extends superClass {
    protected firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      this._loadCoreTranslations('en');
    }

    protected oppConnected() {
      super.oppConnected();
      this._applyTranslations(this.opp!);
    }

    protected oppReconnected() {
      super.oppReconnected();
      this._applyTranslations(this.opp!);
    }

    protected panelUrlChanged(newPanelUrl) {
      super.panelUrlChanged(newPanelUrl);
      // this may be triggered before oppConnected
    }

    private _applyTranslations(opp: OpenPeerPower) {
      this.style.direction = computeRTL(opp) ? "rtl" : "ltr";
      this._loadCoreTranslations(opp.language);
      this._loadOppTranslations(opp.language);
    }

    private async _loadOppTranslations(language: string) {
      const resources = await getOppTranslations(this.opp!, language);

      this._updateResources(language, resources);
    }

    private _updateResources(language: string, data: any) {
      // Update the language in opp, and update the resources with the newly
      // loaded resources. This merges the new data on top of the old data for
      // this language, so that the full translation set can be loaded across
      // multiple fragments.
      const resources = {
        [language]: {
          ...(this.opp &&
            this.opp.resources &&
            this.opp.resources[language]),
          ...data,
        },
      };
      const changes: Partial<OpenPeerPower> = { resources };
      if (this.opp && language === this.opp.language) {
        changes.localize = computeLocalize(this, language, resources);
      }
      this._updateOpp(changes);
    }
  };
