import React from "react";
import Header from "./components/header/Header"
import Aside from "./components/aside/Aside"
// import { Layout } from "antd"

import "./index.module.scss"

// const { Content } = Layout

interface Props {
  children: JSX.Element;
}

const index: React.FC<Props> = (props) => {
  return (
    <div className="layout">
      <Header />
      <div className="main" style={{height:"100%"}}>
        <Aside>{props.children}</Aside>
      </div>
    </div>
  );
};

export default index;
