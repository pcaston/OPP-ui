import {
  Connection,
  MessageBase,
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
export interface Resources {
  [language: string]: { [key: string]: string };
}

export type OppEntityBase = {
  entity_id: string;
  state: string;
  last_changed: string;
  last_updated: string;
  attributes: OppEntityAttributeBase;
  context: { id: string; user_id: string | null };
};

export type OppEntityAttributeBase = {
  friendly_name?: string;
  unit_of_measurement?: string;
  icon?: string;
  entity_picture?: string;
  supported_features?: number;
  hidden?: boolean;
  assumed_state?: boolean;
  device_class?: string;
};

export interface OppEntity extends OppEntityBase {
  attributes: { [key: string]: any };
};

export interface OppEntities { 
  [index: string]: OppEntity;
}

export type OppConfig = {
  latitude: number;
  longitude: number;
  elevation: number;
  unit_system: {
    length: string;
    mass: string;
    volume: string;
    temperature: string;
  };
  location_name: string;
  time_zone: string;
  components: string[];
  config_dir: string;
  whitelist_external_dirs: string[];
  version: string;
  config_source: string;
};

export interface OpenPeerPower {
  states?: OppEntities;
  services?: OppServices;
  config?: OppConfig;
  // i18n
  // current effective language, in that order:
  //   - backend saved user selected lanugage
  //   - language in local appstorage
  //   - browser language
  //   - english (en)
  language: string;
  // local stored language, keep that name for backward compability
  selectedLanguage: string | null;
  resources: Resources;
  localize: LocalizeFunc;
  translationMetadata: TranslationMetadata;
  moreInfoEntityId: string | null;
  user?: CurrentUser;
  callService: (
    domain: string,
    service: string,
    serviceData?: { [key: string]: any }
  ) => Promise<void>;
  callApi: <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    parameters?: { [key: string]: any }
  ) => Promise<T>;
  fetchWithAuth: (
    path: string,
    init?: { [key: string]: any }
  ) => Promise<Response>;
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

export type SunEntity = OppEntityBase & {
  attributes: OppEntityAttributeBase & {
    next_dawn: string;
    next_dusk: string;
    next_midnight: string;
    next_noon: string;
    next_rising: string;
    next_setting: string;
    elevation: number;
    azimuth: number;
    friendly_name: string;
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
