export interface Command {
  executeCommand(): Promise<void>;
}
