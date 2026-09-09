"use client"

import { useMemo, useState } from "react"
import { Loader2 } from "lucide-react"

import { PageContainer } from "@/components/shell/page-container"
import { PageHeader } from "@/components/shell/page-header"
import { AdminGate } from "@/components/shell/admin-gate"
import { Button } from "@/components/ui/button"
import {
  FileDropCard,
  type FileSlotStatus,
} from "@/components/dashboard/upload/file-drop-card"
import { LeadListDropZone } from "@/components/dashboard/upload/lead-list-drop-zone"
import { ProcessingOverlay } from "@/components/dashboard/upload/processing-overlay"
import { PreviousUploadsCard } from "@/components/dashboard/upload/previous-uploads-card"
import { REQUIRED_FILE_SLOTS, getProcessingSteps } from "@/lib/upload-data"

type SlotState = {
  status: FileSlotStatus
  fileName?: string
  errorMessage?: string
}

type DynamicFile = { id: string; fileName: string }

export default function UploadPage() {
  const [slotStates, setSlotStates] = useState<Record<string, SlotState>>({})
  const [dynamicFiles, setDynamicFiles] = useState<DynamicFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<string[]>([])

  const allRequiredUploaded = REQUIRED_FILE_SLOTS.every(
    (slot) => slotStates[slot.id]?.status === "uploaded"
  )

  const uploadedSlotIds = useMemo(
    () =>
      REQUIRED_FILE_SLOTS.filter((slot) => slotStates[slot.id]?.status === "uploaded").map(
        (slot) => slot.id
      ),
    [slotStates]
  )

  function handleFileSelected(slotId: string, extensions: string[], acceptDisplay: string, file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
    if (!extensions.includes(extension)) {
      setSlotStates((prev) => ({
        ...prev,
        [slotId]: {
          status: "error",
          errorMessage: `Accepted formats: ${acceptDisplay}`,
        },
      }))
      return
    }
    setSlotStates((prev) => ({
      ...prev,
      [slotId]: { status: "uploaded", fileName: file.name },
    }))
  }

  function handleRemove(slotId: string) {
    setSlotStates((prev) => {
      const next = { ...prev }
      delete next[slotId]
      return next
    })
  }

  function handleProcess() {
    const steps = getProcessingSteps(uploadedSlotIds, dynamicFiles)
    setProcessingSteps(steps)
    setProcessing(true)
  }

  return (
    <AdminGate>
      <PageContainer>
        <div className="flex flex-col gap-8">
          <PageHeader
            title="Upload data"
            description="Upload your Meta exports, Seek report, and Bullhorn data to refresh all reports"
          />

          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {REQUIRED_FILE_SLOTS.map((slot) => {
                const state = slotStates[slot.id]
                return (
                  <FileDropCard
                    key={slot.id}
                    label={slot.label}
                    acceptDisplay={slot.acceptDisplay}
                    acceptAttr={slot.acceptAttr}
                    status={state?.status ?? "empty"}
                    fileName={state?.fileName}
                    errorMessage={state?.errorMessage}
                    onFileSelected={(file) =>
                      handleFileSelected(slot.id, slot.extensions, slot.acceptDisplay, file)
                    }
                    onRemove={() => handleRemove(slot.id)}
                  />
                )
              })}

              <LeadListDropZone
                onFileAccepted={(file) =>
                  setDynamicFiles((prev) => [
                    ...prev,
                    { id: `${file.name}-${prev.length}`, fileName: file.name },
                  ])
                }
                onFileRejected={() => {}}
              />

              {dynamicFiles.map((file) => (
                <FileDropCard
                  key={file.id}
                  label={file.fileName}
                  acceptDisplay=".csv"
                  acceptAttr=".csv"
                  status="uploaded"
                  fileName={file.fileName}
                  onFileSelected={() => {}}
                  onRemove={() =>
                    setDynamicFiles((prev) => prev.filter((f) => f.id !== file.id))
                  }
                />
              ))}
            </div>

            <Button
              size="lg"
              disabled={!allRequiredUploaded || processing}
              variant={allRequiredUploaded ? "default" : "secondary"}
              className={
                allRequiredUploaded
                  ? "h-11 w-full bg-[#123F36] font-semibold text-[#E3FFFA] hover:bg-[#123F36]/90"
                  : "h-11 w-full font-semibold"
              }
              onClick={handleProcess}
            >
              {processing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process and refresh dashboard"
              )}
            </Button>

            <PreviousUploadsCard />
          </div>
        </div>
      </PageContainer>

      {processing ? <ProcessingOverlay steps={processingSteps} /> : null}
    </AdminGate>
  )
}
