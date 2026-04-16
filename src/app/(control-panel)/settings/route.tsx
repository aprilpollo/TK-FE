import type { RouteItemType } from "@/types"
import { Navigate } from "react-router"
import authRoles from "@/auth/roles"
import Settings from "@/app/(control-panel)/settings/page"
import Profile from "@/app/(control-panel)/settings/profile/page"
import Account from "@/app/(control-panel)/settings/account/page"
import Notification from "@/app/(control-panel)/settings/notification/page"
import Appearance from "@/app/(control-panel)/settings/appearance/page"
import Organization from "@/app/(control-panel)/settings/organization/page"

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
      path: "organization",
      element: <Organization />,
      settings: {
        page: {
          title: "Organization",
          description: "Manage the organizations you belong to",
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
