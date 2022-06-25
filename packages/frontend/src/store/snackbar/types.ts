export interface SnackbarState {
  message?: SnackbarStateMessage;
}
export interface SnackbarStateMessage {
  text: string;
  color: string;
  timeout: number;
}
