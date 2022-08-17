import { ConfirmDialogInfo } from "@/store/confirm_dialog/types";
import { useConfirmDialogStore } from "@/store/confirm_dialog";

export function showConfirmDialog(data: ConfirmDialogInfo): Promise<boolean> {
  const store = useConfirmDialogStore();
  return store.show(data);
}
