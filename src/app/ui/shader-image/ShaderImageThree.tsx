import React, { useRef, useMemo, useEffect, useLayoutEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { IUniform, Mesh, ShaderMaterial, Texture, TextureLoader } from 'three';
import { DEFAULT_FRAGMENT_SHADER, DEFAULT_IMAGE, getScale, ShaderImageProps } from './ShaderImageUtils';

interface Props extends ShaderImageProps {
	uniforms?: { [uniform: string]: IUniform }
	shaderDisabled?: boolean;
}

const DEFAULT_VERTEX_SHADER = `
	varying vec2 vUv; 

	void main() {
		vUv = uv; 
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

export const ShaderImageThreePlane = ({
	imageUrls,
	vertexShader = DEFAULT_VERTEX_SHADER,
	fragmentShader = DEFAULT_FRAGMENT_SHADER,
	objectFit = 'cover',
	uniforms = {},
}: Props) => {

	const ref = useRef<Mesh>(null);
	const [textures, setTextures] = useState<Record<string, { loaded: boolean, url: string, data?: Texture }>>({});
	const { size, invalidate, frameloop } = useThree();

	useEffect(() => {
		Object.entries(imageUrls).forEach(([id, url]) => {
			setTextures(textures => {
				if (textures[id]?.url === url) {
					return textures;
				} else {
					new TextureLoader().load(url, (textureData) => {
						setTextures(textures => {
							const texture = { ...textures[id], data: textureData, loaded: true };
							return { ...textures, [id]: texture };
						});
					});
					return { ...textures, [id]: { loaded: false, url } };
				}
			});
		});
	}, [imageUrls]);

	const materialUniforms = useMemo<Record<string, IUniform>>(() => {
		const imageUniforms = Object.keys(imageUrls).reduce<Record<string, IUniform>>((agg, id) => {
			const texture = textures[id];
			// Register samplers before loading so the compiled uniform list already
			// includes them when their textures arrive.
			return { ...agg, [id]: { value: texture?.loaded ? texture.data : null } };
		}, {});
		return { ...uniforms, ...imageUniforms };
	}, [uniforms, imageUrls, textures]);

	const uniformLayout = Object.keys(materialUniforms).sort().join('\0');
	const shaderMaterial = useMemo(() => {
		return new ShaderMaterial({
			vertexShader,
			fragmentShader,
		});
	}, [vertexShader, fragmentShader, uniformLayout]);

	useLayoutEffect(() => {
		// Three caches the uniforms object. Update its entries rather than
		// replacing the object. A changed set of keys creates a new material so
		// Three also rebuilds its cached uniform list.
		for (const [name, uniform] of Object.entries(materialUniforms)) {
			shaderMaterial.uniforms[name] = uniform;
		}
		shaderMaterial.uniformsNeedUpdate = true;
		if (frameloop !== 'never') invalidate();
	}, [shaderMaterial, materialUniforms, invalidate, frameloop]);

	// Fiber does not dispose objects supplied through <primitive>.
	useEffect(() => () => shaderMaterial.dispose(), [shaderMaterial]);

  useEffect(() => {
    const mainTexture = textures[DEFAULT_IMAGE]
    if (ref.current && mainTexture?.loaded) {
      const texture = mainTexture.data?.image;
      const scale = getScale(texture, size, objectFit);
      ref.current.scale.set(texture.width * scale.x, texture.height * scale.y, 1);
      if (frameloop !== 'never') invalidate();
    }
  }, [size, textures, ref.current, objectFit, invalidate, frameloop]);

	return (
		<mesh ref={ref}>
			<planeGeometry args={[1, 1]} />
			<primitive object={shaderMaterial} attach="material" />
		</mesh>
	);
};

export const ShaderImageThree = (props: Props) => {
	return (
		<Canvas orthographic frameloop={props.shaderDisabled ? 'never' : 'demand'} style={{ width: '100%', height: '100%' }}>
			<OrthographicCamera
				makeDefault
				near={0}
				far={2}
				position={[0, 0, 1]}
			/>
			<ShaderImageThreePlane {...props} />
		</Canvas>
	);
};
