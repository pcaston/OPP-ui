import {
  html,
  PropertyValues,
  customElement,
  TemplateResult,
  property,
} from "lit-element";
import {
  getAuth,
  createConnection,
  Auth,
} from "../open-peer-power-js-websocket/lib";
import {
  OnboardingStep,
  ValidOnboardingStep,
  OnboardingResponses,
} from "../data/onboarding";
import { registerServiceWorker } from "../util/register-service-worker";
import { OPPDomEvent } from "../common/dom/fire_event";
import "./onboarding-create-user";
import "./onboarding-loading";
import { oppUrl } from "../data/auth";
import { OppElement } from "../state/opp-element";

interface OnboardingEvent<T extends ValidOnboardingStep> {
  type: T;
  result: OnboardingResponses[T];
}

declare global {
  interface OPPDomEvents {
    "onboarding-step": OnboardingEvent<ValidOnboardingStep>;
  }

  interface GlobalEventHandlersEventMap {
    "onboarding-step": OPPDomEvent<OnboardingEvent<ValidOnboardingStep>>;
  }
}

@customElement("op-onboarding")
class OpOnboarding extends OppElement {
  @property() private _steps?: OnboardingStep[];

  protected render(): TemplateResult | void {
    return html`
      <onboarding-create-user></onboarding-create-user>
    `;
  }

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);
    registerServiceWorker(false);
    this.addEventListener("onboarding-step", (ev) => this._handleStepDone(ev));
  }

  private async _handleStepDone(
    ev: OPPDomEvent<OnboardingEvent<ValidOnboardingStep>>
  ) {
    const stepResult = ev.detail;
    this._steps = this._steps!.map((step) =>
      step.step === stepResult.type ? { ...step, done: true } : step
    );

    if (stepResult.type === "user") {
      const result = stepResult.result as OnboardingResponses["user"];
      try {
        const auth = await getAuth({
          oppUrl,
          authCode: result.auth_code,
        });
        await this._connectOpp(auth);
      } catch (err) {
        alert("Ah snap, something went wrong!");
        location.reload();
      }
    } 
  }

  private async _connectOpp(auth: Auth) {
    const conn = await createConnection({ auth });
    this.initializeOpp(auth, conn);
    // Load config strings for integrations
    (this as any)._loadFragmentTranslations('en', "config");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-onboarding": OpOnboarding;
  }
}
