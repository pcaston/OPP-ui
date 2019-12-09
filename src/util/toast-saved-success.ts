import { showToast } from "./toast";

export const showSaveSuccessToast = (el: HTMLElement ) =>
  showToast(el, {
    message: "successfully saved",
  });