import { BehaviorSubject } from 'rxjs';
import { MuxProgram, MuxProgramState } from './MuxProgram';

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

export interface MuxSettings {
  clockProgramId: string;
}

const DEFAULT_SETTINGS: MuxSettings = {
  clockProgramId: 'standard-clock',
};

export const useMuxOs = () => {
  	return MuxOs.get();
}

export class MuxOs {

  private static instance = new MuxOs();

  static get() {
    if (!MuxOs.instance) {
      MuxOs.instance = new MuxOs();
    }
    return MuxOs.instance;
  }

  bootId$ = new BehaviorSubject<string | null>(null);
  bootProcess$ = new BehaviorSubject<number>(0);
  stdout$ = new BehaviorSubject<Log[]>([]);
  programs$ = new BehaviorSubject<Map<string, MuxProgram>>(new Map<string, MuxProgram>());
  programStates$ = new BehaviorSubject<Map<string, MuxProgramState>>(new Map<string, MuxProgramState>());
  dateTime$ = new BehaviorSubject<Date>(new Date());
  settings$ = new BehaviorSubject<MuxSettings>(this.loadSettings());

  private constructor() {
    this.bootProcess$.subscribe((bootProcess) => {
      this.logInfo(`Boot process: ${bootProcess * 100}%`);
    });

    setInterval(() => {
      this.dateTime$.next(new Date());
    }, 1000);
  }

  private off = () => { };

  async boot(programs: MuxProgram[], bootTime: number, off: () => void) {
    if (this.bootId$.getValue() === null) {
      this.bootId$.next([...Array(10)].map(() => Math.random().toString(36)[2]).join(''));
      this.logInfo('Booting Mux OS');
      this.off = off;
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
  }

  getProgramsBySlot(slot: string) {
    return [...this.programs$.getValue().values()]
      .filter(p => p.slots && p.slots.some(s => s === slot));
  }

  clearState() {
    this.programs$.next(new Map());
    this.programStates$.next(new Map());
  }

  pause() {
    this.off();
  }

  sleep() {
    this.stdout$.next([]);
    this.bootId$.next(null);
    this.off();
  }

  shutdown() {
    this.clearState();
    this.sleep();
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  startProgram(programId: string) {
    const program = this.programs$.getValue().get(programId);
    if (program) {
      this.logInfo(`Starting program with id ${programId}`);
      const programStates = new Map(this.programStates$.getValue());
      programStates.set(programId, { program, isRunning: true });
      this.programStates$.next(programStates);
    } else {
      this.logError(`Tried to start program with id ${programId}, but it does not exist`);
    }
  }

  quitProgram(programId: string) {
    this.logInfo(`Quitting program with id ${programId}`);
    const programStates = new Map(this.programStates$.getValue());
    programStates.delete(programId);
    this.programStates$.next(programStates);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  private loadSettings(): MuxSettings {
    const stored = localStorage.getItem('mux-settings');
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch (e) {
        this.logWarn('Failed to load settings from localStorage');
      }
    }
    return DEFAULT_SETTINGS;
  }

  private saveSettings(settings: MuxSettings) {
    try {
      localStorage.setItem('mux-settings', JSON.stringify(settings));
    } catch (e) {
      this.logError('Failed to save settings to localStorage');
    }
  }

  updateSettings(updates: Partial<MuxSettings>) {
    const currentSettings = this.settings$.getValue();
    const newSettings = { ...currentSettings, ...updates };
    this.settings$.next(newSettings);
    this.saveSettings(newSettings);
    this.logInfo(`Settings updated`);
  }

  getSettings(): MuxSettings {
    return this.settings$.getValue();
  }
}
