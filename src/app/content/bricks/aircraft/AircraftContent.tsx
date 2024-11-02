import './AircraftContent.styl';
import { Fullscreenable } from '../../../ui/Fullscreenable';
import React, { useState } from 'react';
import { FlightSimulator } from './flightsimulator/FlightSimulator';
import { Canvas } from '@react-three/fiber';
import { FullscreenPlane } from '../../../three/FullscreenPlane';
import { RenderTexture } from '@react-three/drei';


export const AircraftContent = () => {

  // const [gameId, setGameId] = useState<string | null>(null);

  return <>
    <div className='aircraft-content bricks-content'>
      <div className='aircraft-grid'>
        <h1>Ultimate Air- & Spacecraft Collection</h1>
        {[...Array(3)].map((_, i) => <img key={i} className='aircraft-image' src={require(`./aircraft_${i}.jpg`)} />)}
      </div>
      {/* <button onClick={() => setGameId(cur => cur ? null : '1')}>Play</button> */}
    </div >
    {/* {gameId && <Fullscreenable fullscreen>
      <div style={{ width: '100%', height: '100%', background: 'skyblue' }}>
        <Canvas camera={{ position: [0, 0, 9], fov: 14 }} frameloop='always'>
          <FullscreenPlane>
            <meshStandardMaterial>
              <RenderTexture attach='map'>
                <group scale={[0.1, 0.1, 0.1]}>
                  <FlightSimulator onLoadComplete={() => { }} />
                </group>
              </RenderTexture>
            </meshStandardMaterial>
          </FullscreenPlane >
        </Canvas>
      </div>
    </Fullscreenable>} */}
  </>;
}