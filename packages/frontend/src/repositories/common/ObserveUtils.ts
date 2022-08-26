import { NetworkIdentifiable } from "@common/model/network/NetworkIdentifiable";
import { PaginatedResult } from "@common/model/common/PaginatedResult";
import socketIoClient, {
  ServerEventData,
  ServerToClientEvents,
} from "@/repositories/common/SocketIoClient";
import { Cancellable } from "@/repositories/common/Cancellable";
import { PaginateParams } from "@common/model/network/PaginateParams";

export type ObservePaginatedResultFunction<
  Input extends PaginateParams,
  Item extends NetworkIdentifiable
> = (
  input: Input,
  onNext: (result: PaginatedResult<Item>) => void,
  onError: (error: { code: string; message: string }) => void
) => Cancellable;

export function observePaginatedResult<Input, Item extends NetworkIdentifiable>(
  input: Input,
  findItemsFn: (input: Input) => Promise<PaginatedResult<Item>>,
  eventName: keyof ServerToClientEvents & (string | symbol),
  onNext: (result: PaginatedResult<Item>) => void,
  onError: (error: { code: string; message: string }) => void
): Cancellable {
  let currentResult: PaginatedResult<Item> | undefined = undefined;
  let isLoading = false;
  const listener = (data?: ServerEventData) => {
    if (isLoading) return;
    if (
      data == undefined ||
      currentResult == undefined ||
      data.action == "create" ||
      currentResult.results.some((el) => el.id == data.id)
    ) {
      isLoading = true;
      findItemsFn(input).then((result) => {
        isLoading = false;
        currentResult = result;
        onNext(result);
      }, onError);
    }
  };
  socketIoClient.on(eventName, listener);
  listener();
  return () => {
    socketIoClient.removeListener(eventName, listener);
  };
}
