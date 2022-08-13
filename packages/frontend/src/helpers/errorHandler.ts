import { showMessage } from "./snackbar";
import { AxiosError } from "axios";
import store from "@/store";
import router from "@/router";
import i18n from "@/i18n";

export function repositoryErrorHandler(reason: unknown, isLogin = false) {
  let errorMessage: string;
  console.error("Repository error", reason);
  if (reason instanceof AxiosError) {
    switch (reason.response?.status) {
      case 400:
        if (isLogin) {
          errorMessage = i18n.t("error.invalidUsernameOrPassword").toString();
        } else {
          errorMessage = i18n.t("error.requestFailed").toString();
        }
        break;
      case 404:
        errorMessage = i18n.t("error.itemNotFound").toString();
        break;
      case 401:
        store.dispatch("user/logout");
        router.push("/");
        errorMessage = i18n.t("error.userNotLoggedIn").toString();
        break;
      case 403:
        errorMessage = i18n.t("error.unauthorized").toString();
        break;
      default:
        errorMessage = reason.message;
    }
  } else if (typeof reason == "string") {
    errorMessage = reason;
  } else {
    errorMessage = i18n.t("error.unknown").toString();
  }
  showMessage({
    text: errorMessage,
    type: "error",
  });
}
