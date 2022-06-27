export interface Cancellable {
  /** Removes the listener when invoked. */
  (): void;
}