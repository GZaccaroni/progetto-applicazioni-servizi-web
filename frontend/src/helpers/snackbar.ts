import store from "@/store";
import { SnackbarMessage } from "@/store/snackbar/types";

interface SnackbarStatusMessage {
  type: "error" | "success";
  text: string;
  timeout?: number;
}
const messageColor = {
  success: { color: "success" },
  error: { color: "danger" },
};
const showMessage = (payload: SnackbarStatusMessage) => {
  const fullPayload: SnackbarMessage = {
    text: payload.text,
    color: messageColor[payload.type].color,
    timeout: payload.timeout ?? 1000,
  };
  store.commit("snackbar/SHOW_MESSAGE", fullPayload);
};

export { SnackbarStatusMessage, showMessage };
