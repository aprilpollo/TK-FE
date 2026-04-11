import { lazy } from "react"
import type { RouteItemType } from "@/types"

const Members = lazy(() => import("./members"))

const MembersRoute: RouteItemType = {
  path: "members",
  element: <Members />,
  //auth: authRoles.user,
  auth: null,
}

export default MembersRoute
