import { Outlet } from "react-router-dom";

export default function Settings() {
  return (
    <div>
      Settings
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
