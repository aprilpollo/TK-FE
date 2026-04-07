import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  UserPlus,
  Mail,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Role = "Admin" | "Member" | "Viewer"

interface Member {
  id: number
  name: string
  email: string
  role: Role
  online: boolean
  joined: string
  initials: string
  bg: string
}

interface PendingInvite {
  id: number
  email: string
  sent: string
  role: Role
}

const roleConfig: Record<Role, string> = {
  Admin: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Member: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Viewer: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

const members: Member[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@acmeinc.com",
    role: "Admin",
    online: true,
    joined: "Jan 12, 2025",
    initials: "JD",
    bg: "bg-purple-500",
  },
  {
    id: 2,
    name: "Sara Ahmed",
    email: "sara.ahmed@acmeinc.com",
    role: "Member",
    online: true,
    joined: "Feb 3, 2025",
    initials: "SA",
    bg: "bg-blue-500",
  },
  {
    id: 3,
    name: "Mike Kim",
    email: "mike.kim@acmeinc.com",
    role: "Member",
    online: false,
    joined: "Feb 18, 2025",
    initials: "MK",
    bg: "bg-pink-500",
  },
  {
    id: 4,
    name: "Tina Ray",
    email: "tina.ray@acmeinc.com",
    role: "Member",
    online: true,
    joined: "Mar 1, 2025",
    initials: "TR",
    bg: "bg-green-500",
  },
  {
    id: 5,
    name: "Paul Lee",
    email: "paul.lee@acmeinc.com",
    role: "Member",
    online: false,
    joined: "Mar 14, 2025",
    initials: "PL",
    bg: "bg-orange-500",
  },
  {
    id: 6,
    name: "Nadia Osei",
    email: "nadia.osei@acmeinc.com",
    role: "Viewer",
    online: true,
    joined: "Apr 2, 2025",
    initials: "NO",
    bg: "bg-teal-500",
  },
  {
    id: 7,
    name: "Chris Park",
    email: "chris.park@acmeinc.com",
    role: "Admin",
    online: false,
    joined: "Dec 9, 2024",
    initials: "CP",
    bg: "bg-indigo-500",
  },
  {
    id: 8,
    name: "Linda Wu",
    email: "linda.wu@acmeinc.com",
    role: "Viewer",
    online: true,
    joined: "Mar 28, 2025",
    initials: "LW",
    bg: "bg-rose-500",
  },
]

const pendingInvites: PendingInvite[] = [
  {
    id: 1,
    email: "alex.morgan@gmail.com",
    sent: "Apr 3, 2026",
    role: "Member",
  },
  {
    id: 2,
    email: "dev@company.io",
    sent: "Apr 4, 2026",
    role: "Viewer",
  },
]

function Members() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <span className="rounded-full bg-muted px-2.5 py-1 text-sm font-medium text-muted-foreground">
            {members.length}
          </span>
        </div>
        <Button className="gap-2">
          <UserPlus className="size-4" />
          Invite Member
        </Button>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-9 w-64" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              All Roles
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All Roles</DropdownMenuItem>
            <DropdownMenuItem>Admin</DropdownMenuItem>
            <DropdownMenuItem>Member</DropdownMenuItem>
            <DropdownMenuItem>Viewer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Members table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">Member</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground w-32">Role</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground w-24">Status</th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground w-36">Joined</th>
                <th className="w-12 px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {members.map((member, i) => (
                <tr
                  key={member.id}
                  className={cn(
                    "border-b last:border-b-0 hover:bg-muted/40 transition-colors",
                    i % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback
                          className={cn("text-xs font-semibold text-white", member.bg)}
                        >
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        roleConfig[member.role]
                      )}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          member.online ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                        )}
                      />
                      <span className="text-xs text-muted-foreground">
                        {member.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {member.joined}
                  </td>
                  <td className="px-5 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit role</DropdownMenuItem>
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Invites */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-base font-semibold">Pending Invites</h2>
          <span className="rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 px-2 py-0.5 text-xs font-medium">
            {pendingInvites.length}
          </span>
          <Separator className="flex-1" />
        </div>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground w-32">
                  Role
                </th>
                <th className="px-5 py-3 text-left font-medium text-muted-foreground w-40">
                  Sent
                </th>
                <th className="w-28 px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {pendingInvites.map((invite) => (
                <tr key={invite.id} className="border-b last:border-b-0 hover:bg-muted/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="size-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm">{invite.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        roleConfig[invite.role]
                      )}
                    >
                      {invite.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{invite.sent}</td>
                  <td className="px-5 py-3.5">
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Resend
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Members
