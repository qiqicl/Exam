//班级列表
export type classListResponse = {
    code: number;
    data: {
        list: [];
        total?: number;
        totalPage?: number;
    };
    msg: string;
}
export type classListItem = {
    list: {
        classify: string;
        createTime: number;
        creator: string;
        name: string;
        students: string;
        teacher: string;
        __v: number;
    };
    total: number;
    totalPage: number;
}
export type classParams = {
    page: number;
    pagesize: number;
}
export type classAllList = {
    classify: string;
    createTime: number;
    creator: string;
    name: string;
    students: string;
    teacher: string;
    __v: number;
    _id: string;
}


export type studentAllList = {
    age: number;
    avator: string;
    classId: string;
    className: string;
    createTime: number;
    creator: string;
    email: string;
    exams: [];
    lastOnlineTime: number;
    password: string;
    role: string;
    sex: string;
    status: number;
    username: string;
    __v: number;
    _id: string;
}

//获取用户的列表类型
export type userClassType = {
    creator: string;
    lastOnlineTime: number;
    password: string;
    role: [];
    status: number;
    username: string;
    __v: number;
    _id: string;
}
//获取班级名称的列表类型
export type classifyType = {
    createTime: number;
    creator: string;
    name: string;
    value: string;
    __v: string;
    _id: string;
}

//创建班级列表类型
export type createClassType = {
    name: string;
    classify: string;
    teachet: string;
    students?: [];
}

//创建学生列表类型
export type createStudentType = {
    age: number;
    avator?: string;
    className: string;
    email: string;
    idCard: string;
    password?: number;
    sex: 0|1;
    status?: number;
    username: string; 
}

export type saveStudentType = {
    age: number;
    className: string;
    id: string;
    sex: 0 | 1;
    username: string;
}