import { useTypedSelector } from "@/app/hook";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Navigate, Outlet } from "react-router-dom";

function AuthRoute() {
  const { accessToken, user } = useTypedSelector((state) => state.auth);
  if (!accessToken && !user) return <Outlet />;

  return <Navigate to={PROTECTED_ROUTES.OVERVIEW} replace />;
}

export default AuthRoute;
