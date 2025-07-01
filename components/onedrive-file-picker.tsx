"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, ImageIcon, File, Folder } from "lucide-react"

interface OneDriveFile {
  id: string
  name: string
  size?: number
  file?: any
  folder?: any
  webUrl: string
}

interface OneDriveFilePickerProps {
  isOpen: boolean
  onClose: () => void
  onFileSelect: (file: OneDriveFile) => void
  accessToken: string
}

export function OneDriveFilePicker({ isOpen, onClose, onFileSelect, accessToken }: OneDriveFilePickerProps) {
  const [files, setFiles] = useState<OneDriveFile[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPath, setCurrentPath] = useState("root")

  useEffect(() => {
    if (isOpen && accessToken) {
      fetchFiles()
    }
  }, [isOpen, accessToken, currentPath])

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/onedrive/files?path=${currentPath}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFiles(data.value || [])
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (file: OneDriveFile) => {
    if (file.folder) return <Folder className="w-4 h-4 text-blue-500" />
    if (file.file?.mimeType?.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-green-500" />
    if (file.file?.mimeType?.includes("text") || file.name.endsWith(".txt"))
      return <FileText className="w-4 h-4 text-gray-500" />
    return <File className="w-4 h-4 text-gray-500" />
  }

  const handleFileClick = (file: OneDriveFile) => {
    if (file.folder) {
      setCurrentPath(file.id)
    } else {
      onFileSelect(file)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select a file from OneDrive</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {currentPath !== "root" && (
            <Button variant="outline" onClick={() => setCurrentPath("root")} className="mb-2">
              ← Back to Root
            </Button>
          )}

          <ScrollArea className="h-96">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-sm text-gray-500">Loading files...</div>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleFileClick(file)}
                  >
                    {getFileIcon(file)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{file.name}</div>
                      {file.size && <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
