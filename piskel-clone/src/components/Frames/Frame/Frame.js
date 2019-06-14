import React from 'react';
import style from './Frame.module.css';
import Canvas from '../../Canvas/Canvas';

const frame = (props) => {
  return (
    <div
      key={ props.id }
      className={ props.isActive ? style.ActiveFrame : style.Frame }
      onClick={ (e) => {
        props.onFrameHandler({ target: e.target, id: props.id })
       }}>
      <Canvas
        pixels={ props.pixels }
        scale={ props.scale }
        style={{ height: '100px', width: '100px' }}
        width={ '100' }
        height={ '100' }/>
      <div className={ style.Number }>{ props.id + 1 }</div>
      <button
        className={ style.Delete }
        data-action='del'>
        del
      </button>
      <button
        className={ style.Duplicate }
        data-action='copy'>
        copy
      </button>
    </div>
  )
};

export default frame;
