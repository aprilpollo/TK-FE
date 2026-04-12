import { lazy } from "react"
import type { RouteItemType } from "@/types"
import authRoles from "@/auth/roles"
const MyWork = lazy(() => import("./my-work"))

const MyWorkRoute: RouteItemType = {
  path: "mywork",
  element: <MyWork />,
  auth: authRoles.user,
  settings: {
    page: {
      title: "My Work",
      description: "Your assigned tasks and projects"
    }
  }
}

export default MyWorkRoute
