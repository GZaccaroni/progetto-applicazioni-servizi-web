export type BackendErrorCode =
  | "notLoggedIn"
  | "itemNotFound"
  | "invalidArgument"
  | "notAuthorized"
  | "nameAlreadyInUse"
  | "serverError"
  | "persistenceError"
  | "nonDeletable";