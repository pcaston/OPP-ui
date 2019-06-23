import { handleFetchPromise } from "../util/opp-call-api";
import { OpenPeerPower } from "../types";

export interface OnboardingUserStepResponse {
  auth_code: string;
}

export interface OnboardingIntegrationStepResponse {
  auth_code: string;
}

export interface OnboardingResponses {
  user: OnboardingUserStepResponse;
  integration: OnboardingIntegrationStepResponse;
}

export type ValidOnboardingStep = keyof OnboardingResponses;

export interface OnboardingStep {
  step: ValidOnboardingStep;
  done: boolean;
}

export const fetchOnboardingOverview = () =>
  fetch("/api/onboarding", { credentials: "same-origin" });

export const onboardUserStep = (params: {
  client_id: string;
  name: string;
  username: string;
  password: string;
}) =>
  handleFetchPromise<OnboardingUserStepResponse>(
    fetch("/api/onboarding/users", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify(params),
    })
  );

export const onboardIntegrationStep = (
  opp: OpenPeerPower,
  params: { client_id: string }
) =>
  opp.callApi<OnboardingIntegrationStepResponse>(
    "POST",
    "onboarding/integration",
    params
  );
