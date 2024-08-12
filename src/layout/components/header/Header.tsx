import React from "react";
import "./Header.moudle.scss";
import { Layout } from "antd";

const { Header } = Layout;

const Index = () => {
  return (
    <div className="header">
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
      </Header>
    </div>
  );
};

export default Index;
