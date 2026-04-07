import { lazy } from "react"
import authRoles from "@/auth/roles"
import type { RouteItemType } from "@/types"

const List = lazy(() => import("./list"))

const ListRoute: RouteItemType = {
  path: "list",
  element: <List />,
  //auth: authRoles.user,
  auth: null,
}

export default ListRoute
