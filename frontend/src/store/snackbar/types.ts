export interface SnackbarState {
  message?: SnackbarMessage;
}
export interface SnackbarMessage {
  text: string;
  color: string;
  timeout: number;
}
