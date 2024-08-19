import { Outlet } from "react-router-dom";
import style from './Manage-group.module.scss'
const ManageGroup = () => {
  return (
    <div className={style.out}>
      <Outlet />
    </div>
  );
};

export default ManageGroup;