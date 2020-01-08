import { OpenPeerPower } from "../../../types";
import {
  LovelaceConfig,
  fetchConfig,
  saveConfig,
} from "../../../data/lovelace";
import { showSelectViewDialog } from "./select-view/show-select-view-dialog";
import { showSuggestCardDialog } from "./card-editor/show-suggest-card-dialog";

export const addEntitiesToLovelaceView = async (
  element: HTMLElement,
  opp: OpenPeerPower,
  entities: string[],
  lovelaceConfig?: LovelaceConfig,
  saveConfigFunc?: (newConfig: LovelaceConfig) => void
) => {
  if ((opp!.panels.lovelace?.config as any)?.mode === "yaml") {
    showSuggestCardDialog(element, {
      entities,
    });
    return;
  }
  if (!lovelaceConfig) {
    try {
      lovelaceConfig = await fetchConfig(opp.connection, false);
    } catch {
      alert(
        opp.localize(
          "ui.panel.lovelace.editor.add_entities.generated_unsupported"
        )
      );
      return;
    }
  }
  showSelectViewDialog(element, {
    lovelaceConfig,
    viewSelectedCallback: (view) => {
      if (!saveConfigFunc) {
        saveConfigFunc = async (newConfig: LovelaceConfig): Promise<void> => {
          try {
            await saveConfig(opp!, newConfig);
          } catch {
            alert(
              opp.localize(
                "ui.panel.config.devices.add_entities.saving_failed"
              )
            );
          }
        };
      }

      showSuggestCardDialog(element, {
        lovelaceConfig: lovelaceConfig!,
        saveConfig: saveConfigFunc,
        path: [view],
        entities,
      });
    },
  });
};
