import { useProgress } from "@react-three/drei";
import { useRef, useState } from "react";

export type Loadable = (onLoadComplete: () => void) => React.ReactElement<{ onLoadComplete: () => void }>

export function useLoadable(loadables: Loadable[]): [React.ReactElement[], boolean] {

  const { active, progress } = useProgress();
  const [loaded, setLoaded] = useState(false);
  const completedRef = useRef(Array.from({ length: loadables.length }, () => false));
  const loadablesRef = useRef(loadables.map((l, i) => l(() => onLoadedCompleted(i))));

  const onLoadedCompleted = (i: number) => {
    completedRef.current[i] = true;
    if (completedRef.current.every((c) => c)) {
      setLoaded(true);
    }
  }

  return [loadablesRef.current, loaded && !active && progress === 100];
}
