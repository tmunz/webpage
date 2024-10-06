import React, { useEffect, useRef, useState } from 'react';
import { useDimension } from '../../utils/useDimension';
import { ObjectFit, DEFAULT_FRAGMENT_SHADER, DEFAULT_IMAGE, getScale, ShaderImageProps } from './ShaderImageUtils';

type Uniforms = Record<string, { value: any, type: '1f' | '1i' | '2f' | '2i' | '3f' | '3i' | '4f' | '4i' | 'matrix4fv' | 'sampler2D' }>;

interface Props extends ShaderImageProps {
	uniforms?: Uniforms;
}

export const DEFAULT_VERTEX_SHADER = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
      
  void main() {		
    vUv = uv;  
    gl_Position = vec4(position, 0, 1);
  }`;

export const ShaderImageNative = ({
	imageUrls,
	vertexShader = DEFAULT_VERTEX_SHADER,
	fragmentShader = DEFAULT_FRAGMENT_SHADER,
	objectFit = ObjectFit.COVER,
	uniforms = {},
}: Props) => {
	const elementRef = useRef<HTMLDivElement>(null);
	const glProgramRef = useRef<WebGLProgram | null>(null);
	const [images, setImages] = useState<Map<string, { url: string, data: HTMLImageElement, id: string, textureId: number, loaded: boolean }>>(new Map());
	const [gl, setGl] = useState<WebGLRenderingContext | null>(null);
	const dimensions = useDimension(elementRef) ?? { width: 1, height: 1 };

	useEffect(() => {
		// apply shaders
		if (!gl) return;
		const vertexShaderObj = createWebGLShader(gl, gl.VERTEX_SHADER, vertexShader);
		const fragmentShaderObj = createWebGLShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
		glProgramRef.current = createWebGLProgram(gl, vertexShaderObj, fragmentShaderObj);
		gl.useProgram(glProgramRef.current);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	}, [gl, vertexShader, fragmentShader]);

	useEffect(() => {
		// vertices based on dimensions
		const program = glProgramRef.current;
		const image = images.get(DEFAULT_IMAGE);
		if (!gl || !program || !image?.loaded) return;
		gl.viewport(0, 0, dimensions.width, dimensions.height);
		updateVertices(gl, program, { width: image.data.width, height: image.data.height }, objectFit);
		draw(gl, program, uniforms);
	}, [gl, dimensions, objectFit, images, glProgramRef.current]);

	useEffect(() => {
		// apply uniforms
		const program = glProgramRef.current;
		if (!gl || !program) return;
		applyUniforms(gl, program, uniforms);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}, [gl, uniforms, glProgramRef.current]);

	useEffect(() => {
		// Load images
		if (!gl) return;
		Object.entries(imageUrls).forEach(([id, url], i) => {
			if (!images.has(id)) {
				loadImage(id, i, url);
			}
		});
	}, [gl, imageUrls, images]);

	useEffect(() => {
		// create and bind textures
		const program = glProgramRef.current;
		if (!gl || !program) return;
		images.forEach((image) => {
			if (image.loaded) {
				const cuniformLocation = gl.getUniformLocation(program, image.id);
				if (cuniformLocation) {
					createAndBindTexture(gl, cuniformLocation, image.data, image.textureId, image.id);
				}
			}
		});
		draw(gl, program, uniforms);
	}, [gl, glProgramRef.current, images]);


	const loadImage = async (id: string, textureId: number, url: string) => {
		if (!gl) return;
		const image = new Image();
		image.src = url;
		setImages(images => {
			const nextImages = new Map(images);
			nextImages.set(id, { id, url: url.toString(), data: image, textureId, loaded: false });
			return nextImages;
		});
		image.onload = () => {
			setImages(images => {
				const nextImages = new Map(images);
				const image = nextImages.get(id);
				if (!image) return images;
				nextImages.set(id, { ...image, loaded: true });
				return nextImages;
			});
		};
	};

	const setWebGlContext = (canvas: HTMLCanvasElement | null) => {
		if (!canvas) {
			setGl(null);
		} else {
			const context = canvas.getContext('webgl', { antialias: true });
			if (context) {
				setGl(context);
			} else {
				console.error('WebGL not supported');
			}
		}
	};

	return <div ref={elementRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
		<img
			src={images.get(DEFAULT_IMAGE)?.data.src}
			style={{ width: '100%', height: '100%', objectFit, display: 'none' }} // TODO: Remove display none
		/>
		<canvas
			ref={(ref) => setWebGlContext(ref)}
			width={dimensions.width}
			height={dimensions.height}
			style={{ position: 'absolute', top: 0, left: 0 }}
		/>
	</div>;
};

// Helper Functions

function draw(gl: WebGLRenderingContext, program: WebGLProgram, uniforms: Uniforms) {
	if (!gl || !program) return;
	const texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	const uv = [
		0, 0, 1, 0, 0, 1,
		1, 0, 1, 1, 0, 1,
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
	const uvLocation = gl.getAttribLocation(program, 'uv');
	gl.enableVertexAttribArray(uvLocation);
	gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);
	applyUniforms(gl, program, uniforms);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
}

const updateVertices = (gl: WebGLRenderingContext, program: WebGLProgram, contentDimensions: { width: number, height: number }, objectFit: ObjectFit) => {
	if (!gl || !program) return;

	const imageAspectRatio = contentDimensions.width / contentDimensions.height;
	const canvasAspectRatio = gl.canvas.width / gl.canvas.height;
	const scale = getScale(imageAspectRatio / canvasAspectRatio, objectFit);

	// 2 triangles for the full scene
	const x = scale.x;
	const y = scale.y;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		// TODO inverted y input
		// -x, -y, x, -y, -x, y,
		// x, -y, x, y, -x, y,
		-x, y, x, y, -x, -y,
		x, y, x, -y, -x, -y,
	]), gl.STATIC_DRAW);

	const positionLocation = gl.getAttribLocation(program, 'position');
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
};

function createAndBindTexture(gl: WebGLRenderingContext, uniformLocation: WebGLUniformLocation, image: HTMLImageElement, textureId: number, id: string) {
	gl.activeTexture(gl.TEXTURE0 + textureId);
	gl.uniform1i(uniformLocation, textureId);
	gl.bindTexture(gl.TEXTURE_2D, createTexture(gl, image));
}

function createTexture(gl: WebGLRenderingContext, image: HTMLImageElement) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	return texture;
}

function createWebGLShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('Shader compile failed: ', gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function createWebGLProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader | null, fragmentShader: WebGLShader | null) {
	const program = gl.createProgram();
	if (!program) return null;
	if (vertexShader) gl.attachShader(program, vertexShader);
	if (fragmentShader) gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('Program link failed: ', gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return null;
	}
	return program;
}

function applyUniforms(gl: WebGLRenderingContext, program: WebGLProgram, uniforms: Uniforms) {
	Object.keys(uniforms).forEach((uniformName) => {
		const uniform = uniforms[uniformName];
		const location = gl.getUniformLocation(program, uniformName);
		if (!location) return;

		switch (uniform.type) {
			case '1f':
				gl.uniform1f(location, uniform.value);
				break;
			case '1i':
				gl.uniform1i(location, uniform.value);
				break;
			case '2f':
				gl.uniform2f(location, uniform.value[0], uniform.value[1]);
				break;
			case '2i':
				gl.uniform2i(location, uniform.value[0], uniform.value[1]);
				break;
			case '3f':
				gl.uniform3f(location, uniform.value[0], uniform.value[1], uniform.value[2]);
				break;
			case '3i':
				gl.uniform3i(location, uniform.value[0], uniform.value[1], uniform.value[2]);
				break;
			case '4f':
				gl.uniform4f(location, uniform.value[0], uniform.value[1], uniform.value[2], uniform.value[3]);
				break;
			case '4i':
				gl.uniform4i(location, uniform.value[0], uniform.value[1], uniform.value[2], uniform.value[3]);
				break;
			case 'matrix4fv':
				gl.uniformMatrix4fv(location, false, uniform.value);
				break;
			default:
				console.error('Unsupported uniform type: ', uniform.type);
		}
	});
}
