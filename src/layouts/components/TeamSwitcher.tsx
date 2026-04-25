import * as React from "react"
import { useNavigate } from "react-router"
import { ChevronsUpDown, Plus } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { type Organization } from "@/auth/user"
import useUser from "@/auth/hooks/useUser"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { data: user, refreshPermissions } = useUser()
  const teams = user?.organization || []
  const navigate = useNavigate()

  const [activeTeam, setActiveTeam] = React.useState(() => {
    return (
      teams.find((team) => team.id === user?.permissions.organization_id) ||
      teams[0]
    )
  })

  if (!activeTeam) {
    return null
  }

  const handleTeamChange = (team: Organization) => {
    setActiveTeam(team)
    refreshPermissions(team.id)
    navigate("/")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8">
                <AvatarImage src={activeTeam.logo_url} alt={activeTeam.name} />
                <AvatarFallback>{activeTeam.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">
                  {activeTeam.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                My Organization
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup value={activeTeam.id.toString()}>
                {teams.map((team, index) => (
                  <DropdownMenuRadioItem
                    key={index}
                    value={team.id.toString()}
                    onClick={() => handleTeamChange(team)}
                    className="cursor-pointer"
                  >
                    <Avatar className="size-6">
                      <AvatarImage src={team.logo_url} alt={team.name} />
                      <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {team.name}
                      </span>
                      <span className="truncate text-xs text-neutral-400">
                        {team.description}
                      </span>
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add Organization</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
