import {
  ChevronRight,
  Combine,
  Folder,
  Forward,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarInput,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "@/shared/Link"
import { Label } from "@/components/ui/label"
import type { Project } from "@/types"

export function NavTasks({
  tasks,
  searchInput,
  setSearchInput,
}: {
  tasks: Project[]
  searchInput: string
  setSearchInput: (value: string) => void
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible space-y-1">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip="Tasks"
                className="cursor-pointer pr-2!"
              >
                <span className="flex h-full w-full items-center gap-2">
                  <Combine />
                  <span>Tasks</span>
                  <ChevronRight className="ml-auto size-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="relative mb-1 ml-3.5 w-[203px] group-data-[collapsible=icon]:hidden">
                <Label htmlFor="search" className="sr-only">
                  Search
                </Label>
                <SidebarInput
                  className="h-7 rounded-sm pl-8"
                  placeholder="Search tasks"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
              </div>
              <SidebarMenuSub>
                {tasks.map((item) => (
                  <SidebarMenuSubItem key={item.name}>
                    <SidebarMenuSubButton asChild>
                      <Link to={`/projects/${item.key}/tasks`}>
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuSubButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction
                          showOnHover
                          className="top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                          <MoreHorizontal />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-48 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                      >
                        <Link to={`/projects/${item.key}`}>
                          <DropdownMenuItem>
                            <Folder className="text-muted-foreground" />
                            <span>View Project</span>
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuItem>
                          <Forward className="text-muted-foreground" />
                          <span>Share Project</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Trash2 className="text-muted-foreground" />
                          <span>Delete Project</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
