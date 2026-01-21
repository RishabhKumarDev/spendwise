import AppLayout from "@/layouts/app-layout";
import BaseLayout from "@/layouts/base-layout";
import NotFound from "@/pages/notfound";
import AuthRoute from "@/routes/authRoute";
import {
  authenticationRoutePaths,
  protectedRoutePaths,
} from "@/routes/common/routes";
import ProtectedRoute from "@/routes/protectedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    Component: AuthRoute,
    children: [{ Component: BaseLayout, children: authenticationRoutePaths }],
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: protectedRoutePaths,
      },
    ],
  },
  { path: "*", Component: NotFound },
]);

function AppRoutes() {
  //TODO: use-authExpiration
  return <RouterProvider router={router} />;
}

export default AppRoutes;
