import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { IUniform, Mesh, ShaderMaterial, Texture, TextureLoader } from 'three';
import { DEFAULT_FRAGMENT_SHADER, DEFAULT_IMAGE, getScale, ObjectFit, ShaderImageProps } from './ShaderImageUtils';

interface Props extends ShaderImageProps {
	uniforms?: { [uniform: string]: IUniform }
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
	objectFit = ObjectFit.COVER,
	uniforms = {},
}: Props) => {

	const ref = useRef<Mesh>(null);
	const materialRef = useRef<ShaderMaterial>(null);
	const [textures, setTextures] = useState<Record<string, { loaded: boolean, url: string, data?: Texture }>>({});
	const { size } = useThree();

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

	const getUniforms = () => {
		const imageUniforms = Object.keys(imageUrls).reduce((agg, id) => {
			const texture = textures[id];
			if (texture?.loaded) {
				return { ...agg, [id]: { value: texture.data } };
			} else {
				return agg;
			}
		}, {});
		return { ...uniforms, ...imageUniforms, };
	}

	const shaderMaterial = useMemo(() => {
		return new ShaderMaterial({
			uniforms: getUniforms(),
			vertexShader,
			fragmentShader,
		});
	}, [vertexShader, fragmentShader, uniforms, textures]);

	useEffect(() => {
		const mainTexture = textures[DEFAULT_IMAGE]
		if (ref.current && mainTexture?.loaded) {
			const scale = getScale(mainTexture.data?.image.width / mainTexture.data?.image.height, objectFit);
			ref.current.scale.set(size.height * scale.x, size.height * scale.y, 1);
		}
	}, [size, textures, ref.current]);

	useFrame(() => {
		if (materialRef.current) {
			materialRef.current.uniforms = getUniforms();
		}
	});

	return (
		<mesh ref={ref}>
			<planeGeometry args={[1, 1]} />
			<primitive ref={materialRef} object={shaderMaterial} attach="material" />
		</mesh>
	);
};

export const ShaderImageThree = (props: Props) => {
	return (
		<Canvas orthographic style={{ width: '100%', height: '100%' }}>
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