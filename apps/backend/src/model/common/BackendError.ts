import { BackendErrorCode } from "@common/model/common/BackendErrorCode";

export class BackendError {
  errorCode: BackendErrorCode;
  errorMessage?: string;

  constructor(errorCode: BackendErrorCode, errorMessage?: string) {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
  }

  httpStatusCode(): number {
    switch (this.errorCode) {
      case "notLoggedIn":
        return 401;
      case "itemNotFound":
        return 404;
      case "invalidArgument":
      case "nameAlreadyInUse":
      case "nonDeletable":
        return 400;
      case "notAuthorized":
        return 403;
      case "serverError":
      case "persistenceError":
        return 500;
    }
  }
}
