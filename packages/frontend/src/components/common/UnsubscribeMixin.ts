import { Cancellable } from "@/repositories/common/Cancellable";
import { onDeactivated } from "vue";

export function useCancellablesListener() {
  let cancellables: Cancellable[] = [];

  const addToCancellables = (cancellable: Cancellable) => {
    cancellables.push(cancellable);
  };
  const cancelAll = () => {
    cancellables.forEach((cancel) => {
      cancel();
    });
    cancellables = [];
  };
  onDeactivated(() => {
    cancelAll();
  });
  return {
    addToCancellables,
    cancelAll,
  };
}
