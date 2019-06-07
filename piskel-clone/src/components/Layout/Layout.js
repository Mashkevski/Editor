import React from 'react';
import Logo from '../Logo/Logo';
import Hoc from '../../hoc/Hoc';
import Tools from '../Tools/Tools';
import style from './Layout.module.css';
import ColorSelect from '../ColorSelect/ColorSelect';

const layout = (props) => (
  <Hoc>
    <header className={style.Header}>
      <Logo>Piskel clone</Logo>
      navigation
    </header>
    <main className={style.Content}>
      <div className={style.ToolColumn}>
        <ul className={style.PenSize}>
          <li><button type="button" data-size="1">1</button></li>
          <li><button type="button" data-size="2">2</button></li>
          <li><button type="button" data-size="3">3</button></li>
          <li><button type="button" data-size="4">4</button></li>
        </ul>
        <Tools
          activeIndex={props.activeIndex}
          toolsActions={props.toolsActions}
          onToolHandler={props.onToolHandler}/>
        <ColorSelect
          colors={props.colors}
          onRevert={props.onColorRevert}
          onSelect={props.onColorSelect} />
      </div>
    </main>
  </Hoc>
);

export default layout;
