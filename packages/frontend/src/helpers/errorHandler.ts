import { showMessage } from "./snackbar";
import { AxiosError } from "axios";
import store from "@/store";
import router from "@/router";

export function repositoryErrorHandler(reason: unknown, isLogin = false) {
  let errorMessage: string;
  console.error("Repository error", reason);
  if (reason instanceof AxiosError) {
    switch (reason.response?.status) {
      case 400:
        if (isLogin) {
          errorMessage = "Nome utente/ Password non validi.";
        } else {
          errorMessage = "La richiesta è fallita.";
        }
        break;
      case 404:
        errorMessage = "Elemento non trovato.";
        break;
      case 401:
        store.dispatch("user/logout");
        router.push("/");
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
