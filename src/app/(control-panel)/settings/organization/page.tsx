import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Building2,
  Crown,
  LogOut,
  Pencil,
  X,
  Check,
  BadgeCheck,
  Ellipsis,
} from "lucide-react"

import { cn } from "@/lib/utils"
import useUser from "@/auth/hooks/useUser"
import type { Organization as TypeOrganization } from "@/auth/user"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"

const editOrgSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  description: z
    .string()
    .max(200, "Description must be 200 characters or less")
    .optional(),
})

type EditOrgFormValues = z.infer<typeof editOrgSchema>

function OrgCard({ org }: { org: TypeOrganization }) {
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<EditOrgFormValues>({
    resolver: zodResolver(editOrgSchema),
    defaultValues: {
      name: org.name,
      description: org.description ?? "",
    },
  })

  async function onSubmit(values: EditOrgFormValues) {
    try {
      // TODO: wire up organization update API
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success("Organization updated successfully")
      form.reset(values)
      setIsEditing(false)
    } catch {
      toast.error("Failed to update organization. Please try again.")
    }
  }

  function handleCancel() {
    form.reset()
    setIsEditing(false)
  }

  async function handleLeave() {
    try {
      // TODO: wire up leave organization API
      await new Promise((resolve) => setTimeout(resolve, 800))
      toast.success(`Left ${org.name}`)
    } catch {
      toast.error("Failed to leave organization. Please try again.")
    }
  }

  return (
    <div className="rounded-lg border bg-card">
      
      <div className="flex items-start justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={org.logo_url} alt={org.name} />
            <AvatarFallback >
              <Building2 className="size-5" />
            </AvatarFallback>
          </Avatar>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{org.name}</span>
              {org.is_owner && (
                <Badge
                  // variant="secondary"
                  className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                >
                  <BadgeCheck data-icon="inline-start" />
                  Owner
                </Badge>
              )}
              <Badge
                // variant="outline"
                className={cn(
                  org.is_active
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {org.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <p className="text-xs text-muted-foreground">
                {org.joined_at && (
                  <>
                    Joined{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(org.joined_at))}
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground">|</p>
              <p className="text-xs text-muted-foreground">{org.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {org.is_owner && !isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="cursor-pointer"
            >
              <Ellipsis className="size-4" />
            </Button>
          )}
          {!org.is_owner && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLeave}
            >
              <LogOut className="size-4" />
              Leave
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function Organization() {
  const { data: user } = useUser()
  const organizations = user?.organization ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Organization</h2>
        <p className="text-sm text-muted-foreground">
          Manage the organizations you belong to.
        </p>
      </div>

      <Separator />

      {organizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Building2 className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No organizations yet</p>
            <p className="text-xs text-muted-foreground">
              You are not a member of any organization.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {organizations.map((org) => (
            <OrgCard key={org.id} org={org} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Organization
