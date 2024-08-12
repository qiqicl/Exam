import React from 'react';
import style from './userOptions.module.scss'
const UserOptions: React.FC = () => {
    return (
        <div className={style.UserOptions}>
            <h3>用户管理</h3>
            <div className={style.main}>
                <div className={style.add}>

                </div>
            </div>
        </div>
    );
};

export default UserOptions;