import React from 'react';
import {Outlet} from "react-router-dom";

const UserManage = () => {
    return (
        <div>
            <Outlet/>
        </div>
    );
};

export default UserManage;