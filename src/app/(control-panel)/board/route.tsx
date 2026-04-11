import { lazy } from "react"
import type { RouteItemType } from "@/types"

const Board = lazy(() => import("./board"))

const BoardRoute: RouteItemType = {
  path: "board",
  element: <Board />,
  auth: null,
  //auth: authRoles.user,
}

export default BoardRoute
