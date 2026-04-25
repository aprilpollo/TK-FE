import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SettingsPageHeader from "@/components/project-settings/settings-page-header"
import DangerAction from "@/components/project-settings/danger-action"
import useProject from "@/hooks/useProject"

function DangerSettings() {
  const { project } = useProject()
  const navigate = useNavigate()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [archiving, setArchiving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleArchive() {
    setArchiving(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      toast.success("Project archived")
    } catch {
      toast.error("Failed to archive project")
    } finally {
      setArchiving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await new Promise((r) => setTimeout(r, 700))
      toast.success("Project deleted")
      setDeleteOpen(false)
      navigate("/projects")
    } catch {
      toast.error("Failed to delete project")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        title="Danger Zone"
        description="Irreversible and destructive actions. Proceed with care."
      />

      <section className="overflow-hidden rounded-lg border border-destructive/40">
        <header className="flex items-center gap-2 border-b border-destructive/40 bg-destructive/5 px-5 py-3">
          <AlertTriangle className="size-4 text-destructive" />
          <h3 className="text-sm font-semibold text-destructive">
            Destructive actions
          </h3>
        </header>

        <div className="divide-destructive/20 px-5">
          <DangerAction
            title="Archive this project"
            description="The project becomes read-only and is hidden from default views. You can restore it later."
            action={
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={handleArchive}
                disabled={archiving}
              >
                {archiving ? "Archiving..." : "Archive project"}
              </Button>
            }
          />

          <DangerAction
            title="Transfer ownership"
            description="Transfer this project to another workspace member. You will lose owner permissions."
            action={
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                Transfer
              </Button>
            }
          />

          <DangerAction
            title="Delete this project"
            description="All tasks, files, comments, and history will be permanently removed. This cannot be undone."
            isLast
            action={
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
              >
                Delete project
              </Button>
            }
          />
        </div>
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this project?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold text-foreground">
                {project?.name}
              </span>{" "}
              along with all tasks, files, and history. This action{" "}
              <span className="font-semibold text-destructive">
                cannot be undone
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              To confirm, type{" "}
              <span className="font-mono font-medium text-foreground">
                {project?.name}
              </span>{" "}
              below.
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={project?.name}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={confirmText !== project?.name || deleting}
            >
              {deleting ? "Deleting..." : "I understand, delete it"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DangerSettings
