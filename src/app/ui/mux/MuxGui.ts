import { BehaviorSubject } from 'rxjs';
import { MuxOs } from './MuxOs';
// import { MuxOs } from './MuxOs';

export interface MuxProgramState {
  id: string;
  isRunning: boolean;
  window: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class MuxGui {

  private static instance = new MuxGui();

  static get() {
    if (!MuxGui.instance) {
      MuxGui.instance = new MuxGui();
    }
    return MuxGui.instance;
  }

  programStates$ = new BehaviorSubject<Map<string, MuxProgramState>>(new Map<string, MuxProgramState>());

  private constructor() {
    // MuxOs.get().programs$.subscribe((programs) => {
    //   console.log('programs', programs); // TODO
    // });
  }

  startProgram(programId: string) {
    MuxOs.get().logInfo(`Starting program with id ${programId}`);
    const programStates = new Map(this.programStates$.getValue());
    programStates.set(programId, { id: programId, isRunning: true, window: { x: 0, y: 0, width: 400, height: 300 } });
    this.programStates$.next(programStates);
  }

  quitProgram(programId: string) {
    MuxOs.get().logInfo(`Quitting program with id ${programId}`);
    const programStates = new Map(this.programStates$.getValue());
    programStates.set(programId, { id: programId, isRunning: true, window: { x: 0, y: 0, width: 400, height: 300 } });
    this.programStates$.next(programStates);
  }

  changeProgramWindow(programId: string, window: MuxProgramState['window']) {
    const programStates = new Map(this.programStates$.getValue());
    const programState = programStates.get(programId);
    if (programState) {
      programStates.set(programId, { ...programState, window });
      this.programStates$.next(programStates);
    } else {
      MuxOs.get().logWarn(`Could not change window for Program with id ${programId}, it has not been started`);
    }
  }
}