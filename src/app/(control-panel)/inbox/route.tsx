import type { RouteItemType } from "@/types"
import Inbox from "@/app/(control-panel)/inbox/page"
import authRoles from "@/auth/roles"

const InboxRoute: RouteItemType = {
  path: "inbox",
  element: <Inbox />,
  auth: authRoles.user,
  settings:{
    page: {
      title: "Inbox",
      description: "Your inbox messages"
    },
  }
}

export default InboxRoute
