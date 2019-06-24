/**
 * Lite mixin to add localization without depending on the Opp object.
 */
import { dedupingMixin } from "@polymer/polymer/lib/utils/mixin";
import { localizeLiteBaseMixin } from "./localize-lite-base-mixin";
import { computeLocalize } from "../common/translations/localize";

/**
 * @polymerMixin
 */
export const localizeLiteMixin = dedupingMixin(
  (superClass) =>
    class extends localizeLiteBaseMixin(superClass) {
      static get properties() {
        return {
          resources: Object,
          // The fragment to load.
          translationFragment: String,
          /**
           * Translates a string to the current  Any parameters to the
           * string should be passed in order, as follows:
           * `localize(stringKey, param1Name, param1Value, param2Name, param2Value)`
           */
          localize: {
            type: Function,
            computed: "__computeLocalize('en', resources, formats)",
          },
        };
      }

      public ready() {
        super.ready();
        this._initializeLocalizeLite();
      }

      protected __computeLocalize(resources, formats?) {
        return computeLocalize(
          this.constructor.prototype,
          resources,
          formats
        );
      }
    }
);
