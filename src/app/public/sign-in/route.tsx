import { type RouteItemType } from "@/types";
import { Navigate, Outlet } from "react-router";
import authRoles from "@/auth/roles";
import SignInPage from "./SignInPage";
import Callback from "./callback/Callback";

const SignInPageRoute: RouteItemType = {
  path: "auth",
  element: <Outlet />,
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  children: [
    {
      index: true,
      element: <Navigate to="/auth/sign-in" replace />,
    },
    {
      path: "sign-in",
      element: <SignInPage />,
    },
    {
      path: "callback/google",
      element: <Callback />,
    },
  ],
};

export default SignInPageRoute;
