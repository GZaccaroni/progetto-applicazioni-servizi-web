import store from "@/store";
import { SnackbarStateMessage } from "@/store/snackbar/types";

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
  const fullPayload: SnackbarStateMessage = {
    text: payload.text,
    color: messageColor[payload.type].color,
    timeout: payload.timeout ?? 1000,
  };
  console.log("Committing error message", fullPayload);
  store.commit("snackbar/SHOW_MESSAGE", fullPayload);
};

export { SnackbarStatusMessage, showMessage };
