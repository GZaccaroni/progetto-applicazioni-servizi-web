import { showMessage } from "./snackbar";
import { AxiosError } from "axios";
import router from "@/router";
import i18n from "@/i18n";
import { useUserStore } from "@/store/user";
import { BackendErrorCode } from "@common/model/common/BackendErrorCode";

export async function repositoryErrorHandler(reason: unknown) {
  let errorMessage: string;
  if (reason instanceof AxiosError) {
    const errorCode: BackendErrorCode | undefined =
      reason.response?.data?.error?.code;
    if (errorCode != undefined) {
      errorMessage = i18n.t("error." + errorCode).toString();
      switch (errorCode) {
        case "notLoggedIn":
          try {
            await useUserStore().logout();
            await router.push("/");
          } catch {
            // Ignore errors
          }
          break;
      }
    } else {
      errorMessage = i18n.t("error.unknown").toString();
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
