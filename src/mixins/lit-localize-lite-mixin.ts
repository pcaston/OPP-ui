import {
  Constructor,
  LitElement,
  PropertyDeclarations,
  PropertyValues,
} from "lit-element";
import { getLocalLanguage } from "../util/opp-translation";
import { localizeLiteBaseMixin } from "./localize-lite-base-mixin";
import { computeLocalize, LocalizeFunc } from "../common/translations/localize";

const empty = () => "";

interface LitLocalizeLiteMixin {
  language: string;
  resources: {};
  translationFragment: string;
  localize: LocalizeFunc;
}

export const litLocalizeLiteMixin = <T extends LitElement>(
  superClass: Constructor<T>
): Constructor<T & LitLocalizeLiteMixin> =>
  // @ts-ignore
  class extends localizeLiteBaseMixin(superClass) {
    public localize: LocalizeFunc;

    static get properties(): PropertyDeclarations {
      return {
        localize: {},
        language: {},
        resources: {},
        translationFragment: {},
      };
    }

    constructor() {
      super();
      // This will prevent undefined errors if called before connected to DOM.
      this.localize = empty;
      // Use browser language setup before login.
      this.language = getLocalLanguage();
    }

    public connectedCallback(): void {
      super.connectedCallback();
      this._initializeLocalizeLite();
      this.resources = this.opp.resources;
      this.localize = computeLocalize(
        this.constructor.prototype,
        this.language!,
        this.resources!
      );
    }

    public updated(changedProperties: PropertyValues) {
      super.updated(changedProperties);
      if (
        changedProperties.has("language") ||
        changedProperties.has("resources")
      ) {
        this.localize = computeLocalize(
          this.constructor.prototype,
          this.language!,
          this.resources!
        );
      }
    }
  };
