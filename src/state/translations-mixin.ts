import { translationMetadata } from "../resources/translations-metadata";
import {
  getTranslation,
} from "../util/opp-translation";
import { Constructor, LitElement } from "lit-element";
import { OppBaseEl } from "./opp-base-mixin";
import { computeLocalize } from "../common/translations/localize";
import { computeRTL } from "../common/util/compute_rtl";
import { OpenPeerPower } from "../types";
import { saveFrontendUserData } from "../data/frontend";
import { storeState } from "../util/op-pref-storage";
import { getOppTranslations } from "../data/translation";

/*
 * superClass needs to contain `this.opp` and `this._updateOpp`.
 */

export default (superClass: Constructor<LitElement & OppBaseEl>) =>
  class extends superClass {
    protected firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      debugger;
      this.addEventListener("opp-language-select", (e) =>
        this._selectLanguage((e as CustomEvent).detail.language, true)
      );
      this._loadCoreTranslations('en');
    }

    protected oppConnected() {
      super.oppConnected();
      this._selectLanguage('en', false);
      this._applyTranslations(this.opp!);
    }

    protected oppReconnected() {
      super.oppReconnected();
      this._applyTranslations(this.opp!);
    }

    protected panelUrlChanged(newPanelUrl) {
      super.panelUrlChanged(newPanelUrl);
      // this may be triggered before oppConnected
      this._loadFragmentTranslations(
        this.opp ? this.opp.language : 'en',
        newPanelUrl
      );
    }

    private _selectLanguage(language: string, saveToBackend: boolean) {
      if (!this.opp) {
        // should not happen, do it to avoid use this.opp!
        return;
      }

      // update selectedLanguage so that it can be saved to local storage
      this._updateOpp({ language, selectedLanguage: language });
      storeState(this.opp);
      if (saveToBackend) {
        saveFrontendUserData(this.opp, "language", { language });
      }

      this._applyTranslations(this.opp);
    }

    private _applyTranslations(opp: OpenPeerPower) {
      this.style.direction = computeRTL(opp) ? "rtl" : "ltr";
      this._loadCoreTranslations(opp.language);
      this._loadOppTranslations(opp.language);
      this._loadFragmentTranslations(opp.language, opp.panelUrl);
    }

    private async _loadOppTranslations(language: string) {
      const resources = await getOppTranslations(this.opp!, language);

      // Ignore the repsonse if user switched languages before we got response
      if (this.opp!.language !== language) {
        return;
      }

      this._updateResources(language, resources);
    }

    private async _loadFragmentTranslations(
      language: string,
      panelUrl: string
    ) {
      if (translationMetadata.fragments.includes(panelUrl)) {
        const result = await getTranslation(panelUrl, language);
        this._updateResources(result.language, result.data);
      }
    }

    private async _loadCoreTranslations(language: string) {
      const result = await getTranslation(null, language);
      this._updateResources(result.language, result.data);
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
