import { useProgress } from "@react-three/drei";
import { useRef, useState } from "react";

export type Loadable = (onLoadComplete: () => void) => any;

export function useLoadable(loadables: Loadable[]): [any, boolean] {

  const { active, progress } = useProgress();
  const [loaded, setLoaded] = useState(loadables.length === 0 ? true : false);
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
