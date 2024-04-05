import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "components/Auth";

import { ProtectedRoute } from "./ProtectedRoutes";
import { ErrorPage } from "pages/Errorpage";
import { Home } from "pages/Home";
import { Login } from "pages/Login";
import { Logout } from "pages/Logout";

export const Routes = () => {
  const { token } = useAuth();

  const routesForPublic = [
    {
      path: "/errorPage",
      element: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login />,
    },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
