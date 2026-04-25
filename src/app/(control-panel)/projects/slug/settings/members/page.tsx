import { useState } from "react"
import { toast } from "sonner"
import { MoreHorizontal, Search, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SettingsPageHeader from "@/components/project-settings/settings-page-header"
import SettingsSection from "@/components/project-settings/settings-section"

type Role = "owner" | "admin" | "member" | "viewer"

type Member = {
  id: string
  name: string
  email: string
  avatar?: string
  role: Role
  joinedAt: string
}

const ROLE_META: Record<Role, { label: string; description: string }> = {
  owner: {
    label: "Owner",
    description: "Full access. Can delete or transfer the project.",
  },
  admin: {
    label: "Admin",
    description: "Manage members, settings, and content.",
  },
  member: {
    label: "Member",
    description: "Create and edit tasks, files, and comments.",
  },
  viewer: {
    label: "Viewer",
    description: "Read-only access to the project.",
  },
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: "1",
    name: "April Pollo",
    email: "april@example.com",
    role: "owner",
    joinedAt: "2025-01-10",
  },
  {
    id: "2",
    name: "Ethan Kim",
    email: "ethan@example.com",
    role: "admin",
    joinedAt: "2025-02-14",
  },
  {
    id: "3",
    name: "Mira Patel",
    email: "mira@example.com",
    role: "member",
    joinedAt: "2025-03-02",
  },
]

function MembersSettings() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [query, setQuery] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Role>("member")

  const filtered = members.filter((m) => {
    const q = query.toLowerCase()
    return (
      m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    )
  })

  function handleInvite() {
    if (!inviteEmail.trim()) {
      toast.error("Enter an email to invite")
      return
    }
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteEmail("")
  }

  function handleRoleChange(id: string, role: Role) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)))
    toast.success("Role updated")
  }

  function handleRemove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    toast.success("Member removed")
  }

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Members"
        description="Manage who has access to this project and what they can do."
      />

      {/* Invite */}
      <SettingsSection
        title="Invite a new member"
        description="Invitees will receive an email to join this project."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder="name@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
          />
          <Select
            value={inviteRole}
            onValueChange={(v) => setInviteRole(v as Role)}
          >
            <SelectTrigger className="sm:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["admin", "member", "viewer"] as Role[]).map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_META[r].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleInvite}>
            <UserPlus />
            Send invite
          </Button>
        </div>
      </SettingsSection>

      {/* Members list */}
      <SettingsSection
        title={`Members · ${members.length}`}
        description="People with access to this project."
      >
        <div className="mb-4 relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Find a member..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <ul className="divide-y rounded-lg border">
          {filtered.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground italic">
              No matching members
            </li>
          )}
          {filtered.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 px-4 py-3"
            >
              <Avatar className="size-9">
                <AvatarImage src={m.avatar} alt={m.name} />
                <AvatarFallback className="capitalize">
                  {m.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {m.name}
                  </p>
                  {m.role === "owner" && (
                    <Badge variant="outline" className="h-5 rounded-sm text-xs">
                      Owner
                    </Badge>
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {m.email}
                </p>
              </div>

              {m.role === "owner" ? (
                <span className="text-xs text-muted-foreground">
                  {ROLE_META.owner.label}
                </span>
              ) : (
                <Select
                  value={m.role}
                  onValueChange={(v) => handleRoleChange(m.id, v as Role)}
                >
                  <SelectTrigger size="sm" className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["admin", "member", "viewer"] as Role[]).map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_META[r].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="More">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled={m.role === "owner"}>
                    Transfer ownership
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={m.role === "owner"}
                    onClick={() => handleRemove(m.id)}
                  >
                    Remove from project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
      </SettingsSection>
    </div>
  )
}

export default MembersSettings
