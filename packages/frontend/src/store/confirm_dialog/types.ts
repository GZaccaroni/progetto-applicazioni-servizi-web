export interface ConfirmDialogState {
  data?: ConfirmDialogInfo;
  dialogResolve?: (_: boolean) => void;
}
export interface ConfirmDialogInfo {
  title: string;
  message: string;
  options?: ConfirmDialogOptions;
}
export type ConfirmDialogOptions = {
  color: string;
  width: number;
  zIndex: number;
  hideCancel: boolean;
};
