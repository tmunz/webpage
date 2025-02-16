import React, { Suspense } from "react";
import { ShaderImageNative } from "./ShaderImageNative";
import { ShaderImageThree } from "./ShaderImageThree";
import { DEFAULT_IMAGE, ShaderImageProps } from "./ShaderImageUtils";

export type ShaderImageType = 'native' | 'three';

export const ShaderImage = (props: ShaderImageProps & { type?: ShaderImageType, color?: string, shaderDisabled?: boolean }) => {

  const getShaderImage = () => {
    switch (props.type) {
      case 'native':
        return <ShaderImageNative {...props} />;
      case 'three':
      default:
        return <ShaderImageThree {...props} />;
    }
  }

  return <div className='shader-image' style={{ backgroundColor: props.color ?? 'none', position: 'relative' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, opacity: props.shaderDisabled ? 0 : 1 }}>
      <Suspense fallback={null}>
        {getShaderImage()}
      </Suspense>
    </div>
    <img src={props.imageUrls[DEFAULT_IMAGE]} style={{ width: '100%', height: '100%', objectFit: props.objectFit ?? 'cover' }} />
  </div>;
}