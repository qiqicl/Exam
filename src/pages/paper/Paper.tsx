import React from 'react';
import {Outlet} from "react-router-dom";

const Paper = () => {
    return (
        <div>
            <Outlet/>
        </div>
    );
};

export default Paper;