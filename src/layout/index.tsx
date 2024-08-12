import React from "react";
import Header from "./components/header/Header"
import Aside from "./components/aside/Aside"
import style from './index.module.scss'
interface Props {
  children: JSX.Element;
}

const index: React.FC<Props> = (props) => {
  return (
    <div className={style.layout}>
      <Header />
      <div className={style.main}>
        <Aside>{props.children}</Aside>
      </div>
    </div>
  );
};

export default index;
