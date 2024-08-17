import './MoveBoard.styl';

import React, { useState, useRef, useCallback, useEffect } from 'react';


interface BoardProps {
	children: React.ReactNode;
}

interface BoardItemProps {
	id: number;
	position: { x: number; y: number };
	rotation?: number;
	onMouseDown: (id: number, e: React.MouseEvent) => void;
}

const MoveBoardItem = ({ id, position, rotation = 0, onMouseDown, children }) => {
	return (
		<div
			className="move-board-item"
			style={{
				transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
			}}
			onMouseDown={(e) => onMouseDown(id, e)}
		>
			{children}
		</div>
	);
};

export const MoveBoard: React.FC<BoardProps> = ({ children }) => {
	const [selectedItem, setSelectedItem] = useState<number | null>(null);
	const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({});
	const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
	const boardRef = useRef<HTMLDivElement>(null);

	const handleMouseDown = (id: number, e: React.MouseEvent) => {
		setSelectedItem(id);
		const rect = e.currentTarget.getBoundingClientRect();
		setOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
		document.body.style.cursor = 'grabbing';
	};

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (selectedItem === null) return;

			setPositions((prev) => ({
				...prev,
				[selectedItem]: {
					x: e.clientX - offset.x - boardRef.current!.offsetLeft,
					y: e.clientY - offset.y - boardRef.current!.offsetTop,
				},
			}));
		},
		[selectedItem, offset]
	);

	const handleMouseUp = useCallback(() => {
		setSelectedItem(null);
		document.body.style.cursor = 'default';
	}, []);

	useEffect(() => {
	    if (selectedItem !== null) {
	        document.addEventListener('mousemove', handleMouseMove);
	        document.addEventListener('mouseup', handleMouseUp);
	    } else {
	        document.removeEventListener('mousemove', handleMouseMove);
	        document.removeEventListener('mouseup', handleMouseUp);
	    }

	    return () => {
	        document.removeEventListener('mousemove', handleMouseMove);
	        document.removeEventListener('mouseup', handleMouseUp);
	    };
	}, [selectedItem, handleMouseMove, handleMouseUp]);

	const itemsWithProps = React.Children.map(children, (child, index) =>
		<MoveBoardItem position={positions[index] || { x: 0, y: 0 }} id={index} onMouseDown={handleMouseDown}>
			{child}
		</MoveBoardItem>
	);

	return (
		<div className="move-board" ref={boardRef}>
			{itemsWithProps}
		</div>
	);
};
