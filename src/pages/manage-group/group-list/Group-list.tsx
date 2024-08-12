import React, {useEffect, useState} from 'react';
import{ classListItem } from '../../../types/api'
import { classListApi } from '../../../services/index'
const GroupList = () => {
    const [classList, setClassList] = useState<classListItem>()
    useEffect(() => {
        const res = classListApi(1,5)
        console.log(res);
        
    },[])
    return (
        <div>
            GroupList
        </div>
    );
};

export default GroupList;