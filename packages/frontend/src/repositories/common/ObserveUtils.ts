import { DbIdentifiable } from "@/model/db/DbIdentifiable";
import { PaginatedResult } from "@/repositories/common/PaginatedResult";
import socketIoClient, {
  ServerToClientEvents,
} from "@/repositories/common/SocketIoClient";
import { Unsubscribe } from "@/repositories/common/Unsubscribe";

export function observePaginatedResult<Input, Item extends DbIdentifiable>(
  input: Input,
  findItemsFn: (input: Input) => Promise<PaginatedResult<Item>>,
  eventName: keyof ServerToClientEvents & (string | symbol),
  onNext: (result: PaginatedResult<Item>) => void,
  onError: (error: { code: string; message: string }) => void
): Unsubscribe {
  let currentResult: PaginatedResult<Item> | undefined = undefined;
  let isLoading = false;
  const listener = (id: string) => {
    if (isLoading) return;
    isLoading = true;
    if (
      currentResult == undefined ||
      currentResult.results.some((el) => el.id == id)
    ) {
      findItemsFn(input).then((result) => {
        isLoading = false;
        currentResult = result;
        onNext(result);
      }, onError);
    }
  };
  socketIoClient.on("customerChanged", listener);
  socketIoClient.removeListener();
  return () => {
    socketIoClient.removeListener("customerChanged", listener);
  };
}
