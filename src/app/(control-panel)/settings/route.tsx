import { lazy } from "react"
import authRoles from "@/auth/roles"
import type { RouteItemType } from "@/types"

const Settings = lazy(() => import("./settings"))

const SettingsRoute: RouteItemType = {
  path: "settings",
  element: <Settings />,
  auth: authRoles.user,
  // settings: {
  //   layout: {
  //      config:{leftSidePanel: {display: false}}
  //   },
  // },
}

export default SettingsRoute
