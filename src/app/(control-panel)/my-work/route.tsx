import { lazy } from "react"
import authRoles from "@/auth/roles"
import type { RouteItemType } from "@/types"

const MyWork = lazy(() => import("./my-work"))

const MyWorkRoute: RouteItemType = {
  path: "my-work",
  element: <MyWork />,
  //auth: authRoles.user,
  auth: null,
}

export default MyWorkRoute
