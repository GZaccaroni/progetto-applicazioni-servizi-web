import { showMessage } from "./snackbar";
import { AxiosError } from "axios";

export function repositoryErrorHandler(reason: unknown) {
  let errorMessage: string;
  console.error("Repository error", reason);
  if (reason instanceof AxiosError) {
    switch (reason.response?.status) {
      case 400:
        errorMessage = "Nome utente/ Password non validi.";
        break;
      case 404:
        errorMessage = "Elemento non trovato.";
        break;
      case 401:
        errorMessage = "Utente non autenticato.";
        break;
      case 403:
        errorMessage =
          "Non hai i permessi sufficienti per eseguire questa azione.";
        break;
      default:
        errorMessage = reason.message;
    }
  } else if (typeof reason == "string") {
    errorMessage = reason;
  } else {
    errorMessage = "Unknown error";
  }
  showMessage({
    text: errorMessage,
    type: "error",
  });
}
