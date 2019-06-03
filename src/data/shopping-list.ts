import { OpenPeerPower } from "../types";

export interface ShoppingListItem {
  id: number;
  name: string;
  complete: boolean;
}

export const fetchItems = (hass: OpenPeerPower): Promise<ShoppingListItem[]> =>
  hass.callWS({
    type: "shopping_list/items",
  });

export const updateItem = (
  hass: OpenPeerPower,
  itemId: number,
  item: {
    name?: string;
    complete?: boolean;
  }
): Promise<ShoppingListItem> =>
  hass.callWS({
    type: "shopping_list/items/update",
    item_id: itemId,
    ...item,
  });

export const clearItems = (hass: OpenPeerPower): Promise<void> =>
  hass.callWS({
    type: "shopping_list/items/clear",
  });

export const addItem = (
  hass: OpenPeerPower,
  name: string
): Promise<ShoppingListItem> =>
  hass.callWS({
    type: "shopping_list/items/add",
    name,
  });
