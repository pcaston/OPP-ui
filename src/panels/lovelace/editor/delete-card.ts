import { Lovelace } from "../types";
import { deleteCard } from "./config-util";
import { showConfirmationDialog } from "../../../dialogs/confirmation/show-dialog-confirmation";
import { OpenPeerPower } from "../../../types";

export async function confDeleteCard(
  element: HTMLElement,
  opp: OpenPeerPower,
  lovelace: Lovelace,
  path: [number, number]
): Promise<void> {
  showConfirmationDialog(element, {
    text: opp.localize("ui.panel.lovelace.cards.confirm_delete"),
    confirm: async () => {
      try {
        await lovelace.saveConfig(deleteCard(lovelace.config, path));
      } catch (err) {
        alert(`Deleting failed: ${err.message}`);
      }
    },
  });
}
