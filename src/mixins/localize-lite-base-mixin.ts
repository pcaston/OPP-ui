/**
 * Lite base mixin to add localization without depending on the Opp object.
 */
import { getTranslation } from "../util/opp-translation";
import { Resources } from "../types";

/**
 * @polymerMixin
 */
export const localizeLiteBaseMixin = (superClass) =>
  class extends superClass {
    public resources?: Resources;
    public language?: string;
    public translationFragment?: string;

    protected _initializeLocalizeLite() {
      if (this.resources) {
        return;
      }

      if (!this.translationFragment) {
        // In dev mode, we will issue a warning if after a second we are still
        // not configured correctly.
        return;
      }

      this._downloadResources();
    }

    private async _downloadResources() {
      const { language, data } = await getTranslation(
        this.translationFragment!,
        this.language!
      );
      this.resources = {
        [language]: data,
      };
    }
  };
