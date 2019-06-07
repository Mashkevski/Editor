import React from 'react';
import Logo from '../Logo/Logo';
import Hoc from '../../hoc/Hoc';
import style from './Layout.module.css';

const layout = (props) => (
  <Hoc>
    <header className={style.Header}>
      <Logo>Piskel clone</Logo>
      navigation
    </header>
    <main className={style.Content}>
    </main>
  </Hoc>
);

export default layout;
