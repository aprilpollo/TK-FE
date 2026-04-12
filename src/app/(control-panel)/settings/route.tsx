import { lazy } from "react"
import { Navigate } from "react-router"
import authRoles from "@/auth/roles"
import type { RouteItemType } from "@/types"

const Settings = lazy(() => import("./settings"))
const Profile = lazy(() => import("./profile/profile"))
const Account = lazy(() => import("./account/account"))
const Notification = lazy(() => import("./notification/notification"))
const Appearance = lazy(() => import("./appearance/appearance"))

const SettingsRoute: RouteItemType = {
  path: "settings",
  element: <Settings />,
  auth: authRoles.user,
  children: [
    {
      index: true,
      element: <Navigate to="/settings/profile" replace />,
    },
    {
      path: "profile",
      element: <Profile />,
      settings: {
        page: {
          title: "Profile",
          description: "Manage your profile information and preferences",
        },
      },
    },
    {
      path: "account",
      element: <Account />,
      settings: {
        page: {
          title: "Account",
          description: "Manage your account information and preferences",
        },
      },
    },
    {
      path: "notification",
      element: <Notification />,
      settings: {
        page: {
          title: "Notifications",
          description: "Manage your notification preferences",
        },
      },
    },
    {
      path: "appearance",
      element: <Appearance />,
      settings: {
        page: {
          title: "Appearance",
          description: "Customize the look and feel of your dashboard",
        },
      },
    },
  ],
  settings: {
    layout: {
      config: { leftSidePanel: { display: false } },
    }
  },
}

export default SettingsRoute
