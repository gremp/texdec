import {LoggerLike} from '../interfaces'

export class DummyLogger implements LoggerLike{
  debug(...messages: any[]): void {}
  error(...messages: any[]): void {}
  info(...messages: any[]): void {}
  warn(...messages: any[]): void {}
}
