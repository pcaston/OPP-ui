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
  genClientId,
  Auth,
} from "../open-peer-power-js-websocket/lib";
import { litLocalizeLiteMixin } from "../mixins/lit-localize-lite-mixin";
import {
  OnboardingStep,
  ValidOnboardingStep,
  OnboardingResponses,
  fetchOnboardingOverview,
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
class OpOnboarding extends litLocalizeLiteMixin(OppElement) {
  public translationFragment = "page-onboarding";

  @property() private _loading = false;
  @property() private _steps?: OnboardingStep[];

  protected render(): TemplateResult | void {
    debugger;
    const step = this._curStep()!;

    if (this._loading || !step) {
      return html`
        <onboarding-loading></onboarding-loading>
      `;
    } else if (step.step === "user") {
      return html`
        <onboarding-create-user
          .localize=${this.localize}
          .language='en'
        ></onboarding-create-user>
      `;
    } else if (step.step === "integration") {
      return html`
        <onboarding-integrations
          .opp=${this.opp}
          .onboardingLocalize=${this.localize}
        ></onboarding-integrations>
      `;
    }
  }

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);
    this._fetchOnboardingSteps();
    import("./onboarding-integrations");
    registerServiceWorker(false);
    this.addEventListener("onboarding-step", (ev) => this._handleStepDone(ev));
  }

  private _curStep() {
    return this._steps ? this._steps.find((stp) => !stp.done) : undefined;
  }

  private async _fetchOnboardingSteps() {
    try {
      const response = await (window.stepsPromise || fetchOnboardingOverview());

      if (response.status === 404) {
        // We don't load the component when onboarding is done
        document.location.assign("/");
        return;
      }

      const steps: OnboardingStep[] = await response.json();

      if (steps.every((step) => step.done)) {
        // Onboarding is done!
        document.location.assign("/");
        return;
      }

      if (steps[0].done) {
        // First step is already done, so we need to get auth somewhere else.
        const auth = await getAuth({
          oppUrl,
        });
        await this._connectOpp(auth);
      }

      this._steps = steps;
    } catch (err) {
      alert("Something went wrong loading loading onboarding, try refreshing");
    }
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
      this._loading = true;
      try {
        const auth = await getAuth({
          oppUrl,
          authCode: result.auth_code,
        });
        await this._connectOpp(auth);
      } catch (err) {
        alert("Ah snap, something went wrong!");
        location.reload();
      } finally {
        this._loading = false;
      }
    } else if (stepResult.type === "integration") {
      const result = stepResult.result as OnboardingResponses["integration"];
      this._loading = true;

      // Revoke current auth token.
      await this.opp!.auth.revoke();

      const state = btoa(
        JSON.stringify({
          oppUrl: `${location.protocol}//${location.host}`,
          clientId: genClientId(),
        })
      );
      document.location.assign(
        `/?auth_callback=1&code=${encodeURIComponent(
          result.auth_code
        )}&state=${state}`
      );
    }
  }

  private async _connectOpp(auth: Auth) {
    const conn = await createConnection({ auth });
    this.initializeOpp(auth, conn);
    // Load config strings for integrations
    (this as any)._loadFragmentTranslations(this.opp!.language, "config");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "op-onboarding": OpOnboarding;
  }
}
