"use client"

import {
  AlertCircleIcon,
  DownloadIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Trash2Icon,
  UploadCloudIcon,
  UploadIcon,
  VideoIcon,
} from "lucide-react"

import { formatBytes, useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Attachment } from "@/components/task/types"

const getFileIcon = (mimeType = "", fileName = "") => {
  if (
    mimeType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    mimeType.includes("word") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  ) {
    return <FileTextIcon className="size-4 opacity-60" />
  }
  if (
    mimeType.includes("zip") ||
    mimeType.includes("archive") ||
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar")
  ) {
    return <FileArchiveIcon className="size-4 opacity-60" />
  }
  if (
    mimeType.includes("excel") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60" />
  }
  if (mimeType.includes("video/")) return <VideoIcon className="size-4 opacity-60" />
  if (mimeType.includes("audio/")) return <HeadphonesIcon className="size-4 opacity-60" />
  if (mimeType.startsWith("image/")) return <ImageIcon className="size-4 opacity-60" />
  return <FileIcon className="size-4 opacity-60" />
}

interface UploadFilesProps {
  attachments?: Attachment[]
  onFilesAdded?: (files: File[]) => void
  onDelete?: (attachmentId: string | number) => void
  onDownload?: (attachmentId: string | number) => void
}

export default function UploadFiles({
  attachments = [],
  onFilesAdded,
  onDelete,
  onDownload,
}: UploadFilesProps) {
  const maxSize = 10 * 1024 * 1024
  const maxFiles = 10

  const [
    { isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    multiple: true,
    onFilesAdded: onFilesAdded
      ? (added: FileWithPreview[]) => {
          const rawFiles = added.map((f) => f.file).filter((f): f is File => f instanceof File)
          if (rawFiles.length > 0) onFilesAdded(rawFiles)
        }
      : undefined,
  })

  return (
    <div className="flex flex-col gap-2">
      {/* Drop zone */}
      <div
        className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50"
        data-dragging={isDragging || undefined}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} aria-label="Upload files" className="sr-only" />
        <div className="flex flex-col items-center justify-center text-center">
          <div
            aria-hidden="true"
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
          >
            {attachments.length > 0 ? (
              <UploadCloudIcon className="size-4 opacity-60" />
            ) : (
              <FileIcon className="size-4 opacity-60" />
            )}
          </div>
          <p className="mb-1.5 text-sm font-medium">
            {attachments.length > 0 ? "Add more files" : "Upload files"}
          </p>
          <p className="text-xs text-muted-foreground">
            Max {maxFiles} files ∙ Up to {formatBytes(maxSize)}
          </p>
          <Button className="mt-4" onClick={openFileDialog} variant="outline">
            <UploadIcon aria-hidden="true" className="-ms-1 opacity-60" />
            Select files
          </Button>
        </div>
      </div>

      {/* Saved attachments */}
      {attachments.length > 0 && (
        <div className="overflow-hidden rounded-md border bg-background">
          <Table>
            <TableHeader className="text-xs">
              <TableRow className="bg-muted/50">
                <TableHead className="h-9 py-2">Name</TableHead>
                <TableHead className="h-9 py-2">Type</TableHead>
                <TableHead className="h-9 py-2">Size</TableHead>
                <TableHead className="h-9 w-0 py-2 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[13px]">
              {attachments.map((attachment) => (
                <TableRow key={attachment.id}>
                  <TableCell className="max-w-48 py-2 font-medium">
                    <span className="flex items-center gap-2">
                      <span className="shrink-0">
                        {getFileIcon(attachment.mime_type, attachment.file_name)}
                      </span>
                      <span className="truncate">{attachment.file_name}</span>
                    </span>
                  </TableCell>
                  <TableCell className="py-2 text-muted-foreground">
                    {attachment.mime_type.split("/")[1]?.toUpperCase() || "UNKNOWN"}
                  </TableCell>
                  <TableCell className="py-2 text-muted-foreground">
                    {formatBytes(attachment.file_size)}
                  </TableCell>
                  <TableCell className="py-2 text-right whitespace-nowrap">
                    <Button
                      aria-label={`Download ${attachment.file_name}`}
                      className="size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                      onClick={() => onDownload?.(attachment.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <DownloadIcon className="size-4" />
                    </Button>
                    <Button
                      aria-label={`Delete ${attachment.file_name}`}
                      className="size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                      onClick={() => onDelete?.(attachment.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {errors.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-destructive" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  )
}
