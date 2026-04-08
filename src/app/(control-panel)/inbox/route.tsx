import { lazy } from "react"
import authRoles from "@/auth/roles"
import type { RouteItemType } from "@/types"

const Inbox = lazy(() => import("./inbox"))

const InboxRoute: RouteItemType = {
  path: "inbox",
  element: <Inbox />,
  auth: authRoles.user,
}

export default InboxRoute
