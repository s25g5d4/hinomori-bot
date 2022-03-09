export class CommandError<T> extends Error {
  constructor(msg: string, public data: T, public readonly errorId: string) {
    super(msg);
  }
}
