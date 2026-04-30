import type { RouteItemType } from "@/types"
import { Navigate, Outlet } from "react-router"
import authRoles from "@/auth/roles"
import Projects from "@/app/(control-panel)/projects/page"
import Slug from "@/app/(control-panel)/projects/slug/page"
import Overview from "@/app/(control-panel)/projects/slug/overview/page"
import Tasks from "@/app/(control-panel)/projects/slug/tasks/page"
import Calendar from "@/app/(control-panel)/projects/slug/calendar/page"
import Files from "@/app/(control-panel)/projects/slug/files/page"
import Settings from "@/app/(control-panel)/projects/slug/settings/page"
import GeneralSettings from "@/app/(control-panel)/projects/slug/settings/general/page"
import MembersSettings from "@/app/(control-panel)/projects/slug/settings/members/page"
import TagsSettings from "@/app/(control-panel)/projects/slug/settings/tags/page"
import NotificationsSettings from "@/app/(control-panel)/projects/slug/settings/notifications/page"
import IntegrationsSettings from "@/app/(control-panel)/projects/slug/settings/integrations/page"
import StatusSettings from "@/app/(control-panel)/projects/slug/settings/status/page"
import DangerSettings from "@/app/(control-panel)/projects/slug/settings/danger/page"


const ProjectsRoute: RouteItemType = {
  path: "projects",
  element: <Outlet />,
  auth: authRoles.user,
  children: [
    {
      index: true,
      element: <Projects />,
    },
    {
      path: ":id",
      element: <Slug />,
      children: [
        {
          index: true,
          element: <Overview />,
        },
        {
          path: "tasks",
          element: <Tasks />,
        },
        {
          path: "calendar",
          element: <Calendar />,
        },
        {
          path: "files",
          element: <Files />,
        },
        {
          path: "settings",
          element: <Settings />,
          children: [
            {
              index: true,
              element: <Navigate to="general" replace />,
            },
            {
              path: "general",
              element: <GeneralSettings />,
            },
            {
              path: "members",
              element: <MembersSettings />,
            },
            {
              path: "tags",
              element: <TagsSettings />,
            },
            {
              path: "status",
              element: <StatusSettings />,
            },
            {
              path: "notifications",
              element: <NotificationsSettings />,
            },
            {
              path: "integrations",
              element: <IntegrationsSettings />,
            },
            {
              path: "danger",
              element: <DangerSettings />,
            },
          ],
        },
      ],
    },
  ],
  settings: {
    page: {
      title: "Projects",
      description: "Manage your projects and tasks",
    },
  },
}

export default ProjectsRoute
