import { BehaviorSubject } from 'rxjs';
import { MuxProgram } from './MuxProgram';

export enum LogType {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface Log {
  type: LogType;
  message: string;
}

export interface MuxOsState {
  bootProcess: number;
  stdout: Log[];
  programs: Map<string, MuxProgram>;
}

export class MuxOs {

  private static instance = new MuxOs();

  static get() {
    if (!MuxOs.instance) {
      MuxOs.instance = new MuxOs();
    }
    return MuxOs.instance;
  }


  bootId$ = new BehaviorSubject<string>([...Array(10)].map(() => Math.random().toString(36)[2]).join(''));
  bootProcess$ = new BehaviorSubject<number>(0);
  stdout$ = new BehaviorSubject<Log[]>([]);
  programs$ = new BehaviorSubject<Map<string, MuxProgram>>(new Map<string, MuxProgram>());
  dateTime$ = new BehaviorSubject<Date>(new Date());

  private constructor() {
    this.bootProcess$.subscribe((bootProcess) => {
      this.logInfo(`Boot process: ${bootProcess * 100}%`);
    });

    setInterval(() => {
      this.dateTime$.next(new Date());
    }, 1000);
  }

  shutdown = () => { };

  async boot(programs: MuxProgram[], bootTime: number, onShutdown: () => void) {
    this.reset();
    this.logInfo('Booting Mux OS');
    this.shutdown = onShutdown;
    this.logInfo('Functions loaded');
    this.bootProcess$.next(0.2);
    await new Promise(resolve => setTimeout(resolve, bootTime * 0.1));
    this.install(...programs);
    this.bootProcess$.next(0.9);
    await new Promise(resolve => setTimeout(resolve, bootTime * 0.8));
    this.logInfo('Mux OS booted up');
    await new Promise(resolve => setTimeout(resolve, bootTime * 0.1));
    this.bootProcess$.next(1);
  }

  getProgramsBySlot(slot: string) {
    return [...this.programs$.getValue().values()]
      .filter(p => p.slots && p.slots.some(s => s === slot));
  }

  reset() {
    this.bootProcess$.next(0);
    this.stdout$.next([]);
    this.programs$.next(new Map());
  }

  logInfo(message: string) {
    this.log(LogType.INFO, message);
  }

  logWarn(message: string) {
    this.log(LogType.WARN, message);
  }

  logError(message: string) {
    this.log(LogType.ERROR, message);
  }

  log(type: LogType, message: string) {
    this.stdout$.next([...this.stdout$.getValue(), { type, message }]);
  }

  install(...programs: MuxProgram[]) {
    const state = new Map(this.programs$.getValue());
    programs.forEach((program) => {
      if (state.has(program.id)) {
        this.logWarn(`Program already installed: ${program.id} will be overwritten`);
      }
      state.set(program.id, program);
      this.logInfo(`Program installed: "${program.name}" (${program.id})`);
    });
    this.programs$.next(state);
  }
}
