import { fireEvent } from "./dom/fire_event";

declare global {
  // for fire event
  interface OPPDomEvents {
    "location-changed": {
      replace: boolean;
    };
  }
}

export const navigate = (
  _node: any,
  path: string,
  replace: boolean = false
) => {
  fireEvent(window, "location-changed", {
    replace,
  });
};
