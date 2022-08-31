import { SnackbarStateMessage } from "@/store/snackbar/types";
import { useSnackbarStore } from "@/store/snackbar";

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
  const store = useSnackbarStore();
  store.show(fullPayload);
};

export { SnackbarStatusMessage, showMessage };
