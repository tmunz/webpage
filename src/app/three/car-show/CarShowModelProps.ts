import { Object3D } from "three";

export interface CarShowModelProps {
  onLoadComplete: (model: Object3D) => void;
}