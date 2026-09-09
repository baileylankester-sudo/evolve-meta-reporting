"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PREVIOUS_UPLOADS } from "@/lib/upload-data"

export function PreviousUploadsCard() {
  const [restoredId, setRestoredId] = useState<string | null>(null)

  return (
    <Card className="mx-auto w-full max-w-[720px] p-0">
      <CardContent className="flex flex-col gap-3 px-4 pt-4 pb-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Previous uploads
        </span>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Files uploaded</TableHead>
              <TableHead>Candidates</TableHead>
              <TableHead>Campaigns</TableHead>
              <TableHead>Uploaded by</TableHead>
              <TableHead className="text-right">Restore</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PREVIOUS_UPLOADS.map((upload) => (
              <TableRow key={upload.id}>
                <TableCell className="text-muted-foreground">{upload.date}</TableCell>
                <TableCell>{upload.filesUploaded}</TableCell>
                <TableCell>{upload.candidates}</TableCell>
                <TableCell>{upload.campaigns}</TableCell>
                <TableCell className="text-muted-foreground">{upload.uploadedBy}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRestoredId(upload.id)
                      window.setTimeout(() => setRestoredId(null), 2000)
                    }}
                  >
                    {restoredId === upload.id ? "Restored" : "Restore"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
