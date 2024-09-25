import React from "react"

export const RgbaFilter = ({ children, r = 1, g = 1, b = 1, a = 0 }: { children: React.ReactElement, r?: number, g?: number, b?: number, a?: number }) => {
  const filterId = `rgba-filter-${r}-${g}-${b}-${a}`;
  return <>
    <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }} className='rgb-filter'>
      <filter id={filterId}>
        <feColorMatrix
          type="matrix"
          values={`
              ${r} 0 0 0 0
              0 ${g} 0 0 0 
              0 0 ${b} 0 0
              0 0 0 ${1 - a} 0
          `}>
        </feColorMatrix>
      </filter>
    </svg>
    {React.cloneElement(children, {
      ...children.props,
      style: {
        ...children.props.style,
        filter: `url(#${filterId})`,
      }
    })}
  </>
}