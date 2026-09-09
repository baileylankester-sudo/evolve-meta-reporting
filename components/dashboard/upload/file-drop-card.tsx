"use client"

import { useId, useRef, useState, type DragEvent } from "react"
import { Check, Upload } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type FileSlotStatus = "empty" | "dragover" | "uploaded" | "error"

export function FileDropCard({
  label,
  acceptDisplay,
  acceptAttr,
  status,
  fileName,
  errorMessage,
  onFileSelected,
  onRemove,
}: {
  label: string
  acceptDisplay: string
  acceptAttr: string
  status: FileSlotStatus
  fileName?: string
  errorMessage?: string
  onFileSelected: (file: File) => void
  onRemove: () => void
}) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileSelected(file)
  }

  const displayStatus: FileSlotStatus = isDragOver ? "dragover" : status

  const stateClasses = {
    empty: "border-2 border-dashed border-border hover:border-accent",
    dragover: "border-2 border-solid border-accent bg-[rgba(207,245,238,0.3)]",
    uploaded: "border-2 border-solid",
    error: "border-2 border-solid border-destructive",
  }[displayStatus]

  return (
    <Card
      className={cn(
        "h-[148px] cursor-pointer justify-center rounded-xl p-0 shadow-none ring-0 transition-colors duration-200 ease-out",
        stateClasses
      )}
      style={
        displayStatus === "uploaded"
          ? { borderColor: "var(--status-success)", backgroundColor: "rgba(87,219,123,0.08)" }
          : undefined
      }
      onClick={() => {
        if (status !== "uploaded") inputRef.current?.click()
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (status !== "uploaded") setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={status === "uploaded" ? undefined : handleDrop}
      role="button"
      tabIndex={0}
      aria-label={`Upload ${label}`}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={acceptAttr}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelected(file)
          e.target.value = ""
        }}
      />

      {status === "uploaded" ? (
        <div className="flex flex-col items-center gap-1.5 px-4 text-center">
          <Check className="size-5" style={{ color: "var(--status-success)" }} />
          <span className="max-w-full truncate text-xs font-medium text-foreground">
            {fileName}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 px-4 text-center">
          <Upload className="size-6 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">Drop file here or click to browse</span>
          <span className="text-xs text-muted-foreground/60">{acceptDisplay}</span>
          {status === "error" && errorMessage ? (
            <span className="text-xs text-destructive">{errorMessage}</span>
          ) : null}
        </div>
      )}
    </Card>
  )
}
