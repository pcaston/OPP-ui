import {
  OppEntities,
  OppConfig,
  Auth,
  Connection,
  MessageBase,
  OppEntityBase,
  OppEntityAttributeBase,
  OppServices,
} from './open-peer-power-js-websocket/lib';
import { LocalizeFunc } from "./common/translations/localize";
import { ExternalMessaging } from "./external_app/external_messaging";

declare global {
  var __DEV__: boolean;
  var __DEMO__: boolean;
  var __BUILD__: "latest" | "es5";
  var __VERSION__: string;
  var __STATIC_PATH__: string;

  interface Window {
    // Custom panel entry point url
    customPanelJS: string;
    ShadyCSS: {
      nativeCss: boolean;
      nativeShadow: boolean;
      prepareTemplate(templateElement, elementName, elementExtension);
      styleElement(element);
      styleSubtree(element, overrideProperties);
      styleDocument(overrideProperties);
      getComputedStyleValue(element, propertyName);
    };
  }
  // for fire event
  interface OPPDomEvents {
    "value-changed": {
      value: unknown;
    };
    change: undefined;
  }
}

export interface WebhookError {
  code: number;
  message: string;
}

export interface Credential {
  auth_provider_type: string;
  auth_provider_id: string;
}

export interface MFAModule {
  id: string;
  name: string;
  enabled: boolean;
}

export interface CurrentUser {
  id: string;
  is_owner: boolean;
  is_admin: boolean;
  name: string;
  credentials: Credential[];
  mfa_modules: MFAModule[];
}

export interface Theme {
  // Incomplete
  "primary-color": string;
  "text-primary-color": string;
  "accent-color": string;
}

export interface Themes {
  default_theme: string;
  themes: { [key: string]: Theme };
}

export interface PanelInfo<T = {} | null> {
  component_name: string;
  config: T;
  icon: string | null;
  title: string | null;
  url_path: string;
}

export interface Panels {
  [name: string]: PanelInfo;
}

export interface Translation {
  nativeName: string;
  isRTL: boolean;
  fingerprints: { [fragment: string]: string };
}

export interface TranslationMetadata {
  fragments: string[];
  translations: {
    [lang: string]: Translation;
  };
}

export interface Notification {
  notification_id: string;
  message: string;
  title: string;
  status: "read" | "unread";
  created_at: string;
}

export interface OpenPeerPower {
  auth: Auth & { external?: ExternalMessaging };
  connection: Connection;
  connected: boolean;
  states: OppEntities;
  config: OppConfig;
  moreInfoEntityId: string | null;
  user?: CurrentUser;
  sendWS: (msg: MessageBase) => void;
  callWS: <T>(msg: MessageBase) => Promise<T>;
}

export type ClimateEntity = OppEntityBase & {
  attributes: OppEntityAttributeBase & {
    current_temperature: number;
    min_temp: number;
    max_temp: number;
    temperature: number;
    target_temp_step?: number;
    target_temp_high?: number;
    target_temp_low?: number;
    target_humidity?: number;
    target_humidity_low?: number;
    target_humidity_high?: number;
    fan_mode?: string;
    fan_list?: string[];
    operation_mode?: string;
    operation_list?: string[];
    hold_mode?: string;
    swing_mode?: string;
    swing_list?: string[];
    away_mode?: "on" | "off";
    aux_heat?: "on" | "off";
  };
};

export type LightEntity = OppEntityBase & {
  attributes: OppEntityAttributeBase & {
    min_mireds: number;
    max_mireds: number;
    friendly_name: string;
    brightness: number;
    hs_color: number[];
  };
};

export type GroupEntity = OppEntityBase & {
  attributes: OppEntityAttributeBase & {
    entity_id: string[];
    order: number;
    auto?: boolean;
    view?: boolean;
    control?: "hidden";
  };
};

export type CameraEntity = OppEntityBase & {
  attributes: OppEntityAttributeBase & {
    model_name: string;
    access_token: string;
    brand: string;
    motion_detection: boolean;
  };
};

export type InputSelectEntity = OppEntityBase & {
  attributes: OppEntityAttributeBase & {
    options: string[];
  };
};

export interface Route {
  prefix: string;
  path: string;
}

export interface PanelElement extends HTMLElement {
  opp?: OpenPeerPower;
  narrow?: boolean;
  route?: Route | null;
  panel?: PanelInfo;
}

export interface LocalizeMixin {
  opp?: OpenPeerPower;
  localize: LocalizeFunc;
}
