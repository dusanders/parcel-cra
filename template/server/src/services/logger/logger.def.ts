export interface ILogger {
  i(tag: string, message: string): void;
  d(tag: string, message: string): void;
  w(tag: string, message: string): void;
  e(tag: string, message: string): void;
}