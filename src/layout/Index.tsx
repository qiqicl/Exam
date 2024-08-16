import React, {useLayoutEffect} from "react";
import Header from "./components/header/Header"
import Aside from "./components/aside/Aside"
import style from './index.module.scss'
import {getUserInfoStore} from "../store/models/user.ts";
import {useAppDispatch} from "../hooks/store.ts";
interface Props {
  children: JSX.Element;
}

const Index: React.FC<Props> = (props) => {
    const dispatch = useAppDispatch()
    useLayoutEffect(() => {
        dispatch(getUserInfoStore())
    }, []);
  return (
    <div className={style.layout}>
      <Header />
      <div className={style.main}>
        <Aside>{props.children}</Aside>
      </div>
    </div>
  );
};

export default Index;
