import { useTypedSelector } from "@/app/hook";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { user, accessToken } = useTypedSelector((state) => state.auth);
  if (!user && !accessToken) {
    return <Navigate to={AUTH_ROUTES.SIGN_IN} replace />;
  }
  
  return <Outlet />;
}

export default ProtectedRoute;
