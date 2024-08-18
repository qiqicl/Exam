import React from 'react';
import style from './home.module.scss'
import home from '../../assets/home.png'
const Home:React.FC = () => {
    return (
        <div className={style.home}>
            <img src={home} alt=""/>
        </div>
    );
};

export default Home;