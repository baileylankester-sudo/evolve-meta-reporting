"use client"

import { useRef, useState, type DragEvent } from "react"
import { FileSpreadsheet, Upload } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function LeadListDropZone({
  onFileAccepted,
  onFileRejected,
}: {
  onFileAccepted: (file: File) => void
  onFileRejected: (message: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [rejectMessage, setRejectMessage] = useState<string | null>(null)

  async function inspectAndEmit(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
    if (extension !== "csv") {
      const message = "Only .csv column detection supported"
      setRejectMessage(message)
      onFileRejected(message)
      window.setTimeout(() => setRejectMessage(null), 2500)
      return
    }

    const text = await file.text()
    const firstLine = text.split(/\r?\n/)[0]?.toLowerCase() ?? ""
    const matches = ["job title", "phone", "email", "source", "actions"].filter((keyword) =>
      firstLine.includes(keyword)
    )

    if (matches.length >= 2) {
      onFileAccepted(file)
    } else {
      const message = "Unrecognized column headers"
      setRejectMessage(message)
      onFileRejected(message)
      window.setTimeout(() => setRejectMessage(null), 2500)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) inspectAndEmit(file)
  }

  return (
    <Card
      className={cn(
        "h-[148px] cursor-pointer justify-center rounded-xl border-2 border-dashed p-0 shadow-none ring-0 transition-colors duration-200 ease-out",
        rejectMessage
          ? "border-destructive"
          : isDragOver
            ? "border-solid border-accent bg-[rgba(207,245,238,0.3)]"
            : "border-border hover:border-accent"
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="Upload additional lead list"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) inspectAndEmit(file)
          e.target.value = ""
        }}
      />
      <div className="flex flex-col items-center gap-1.5 px-4 text-center">
        {rejectMessage ? (
          <>
            <FileSpreadsheet className="size-6 text-destructive" />
            <span className="text-sm font-medium text-foreground">Lead list files</span>
            <span className="text-xs text-destructive">{rejectMessage}</span>
          </>
        ) : (
          <>
            <Upload className="size-6 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Lead list files</span>
            <span className="text-xs text-muted-foreground">Drop file here or click to browse</span>
            <span className="text-xs text-muted-foreground/60">
              Detected by column headers · .csv
            </span>
          </>
        )}
      </div>
    </Card>
  )
}
