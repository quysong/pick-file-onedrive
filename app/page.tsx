"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Upload, HardDrive, Cloud, FileText, ImageIcon, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function OneDriveUploadPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [textInput, setTextInput] = useState("")

  const handleOneDriveAuth = async () => {
    // Construct the Microsoft OAuth URL
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || "your_client_id_here"
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/microsoft`)
    const scope = encodeURIComponent("https://graph.microsoft.com/Files.Read https://graph.microsoft.com/User.Read")

    const authUrl =
      `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `response_mode=query`

    // Redirect to Microsoft OAuth
    window.location.href = authUrl
  }

  const handleOneDriveFilePicker = async () => {
    if (!isAuthenticated) {
      handleOneDriveAuth()
      return
    }

    // For now, we'll simulate the file picker
    // In a real implementation, you'd open a modal with OneDrive files
    try {
      const response = await fetch("/api/onedrive/files", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("onedrive_token")}`,
        },
      })

      if (response.ok) {
        const files = await response.json()
        // Here you would show a file picker modal with the files
        console.log("OneDrive files:", files)
        setSelectedFile("example-document.docx")
      }
    } catch (error) {
      console.error("Error fetching OneDrive files:", error)
      // Re-authenticate if token is invalid
      handleOneDriveAuth()
    }
  }

  const handleLocalUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".txt,.doc,.docx,.pdf,.png,.jpg,.jpeg"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setSelectedFile(file.name)
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Text to Editable Templates</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate on-brand, professional templates from your ideas — free for everyone, no signup required.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Template Generator
            </CardTitle>
            <CardDescription>Enter your text or upload a file to generate an editable template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text to generate an editable template"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[120px] resize-none"
            />

            <div className="flex items-center gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={handleLocalUpload}>
                    <HardDrive className="w-4 h-4 mr-2" />
                    Upload from computer
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Cloud className="w-4 h-4 mr-2" />
                    Google Drive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleOneDriveFilePicker}>
                    <Cloud className="w-4 h-4 mr-2 text-blue-600" />
                    Microsoft OneDrive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm">
                <ImageIcon className="w-4 h-4 mr-2" />
                Photo
              </Button>

              <Button className="ml-auto">Generate Template</Button>
            </div>

            {selectedFile && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Selected file: <strong>{selectedFile}</strong>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Microsoft OneDrive Integration Requirements</CardTitle>
            <CardDescription>What you need to implement OneDrive file access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">1. Azure App Registration</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Register app in Azure Portal</li>
                  <li>• Get Client ID</li>
                  <li>• Generate Client Secret</li>
                  <li>• Configure redirect URIs</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">2. Microsoft Graph Permissions</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Files.Read (read user files)</li>
                  <li>• Files.ReadWrite (read/write files)</li>
                  <li>• User.Read (basic profile)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">3. Environment Variables</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• MICROSOFT_CLIENT_ID</li>
                  <li>• MICROSOFT_CLIENT_SECRET</li>
                  <li>• MICROSOFT_TENANT_ID</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">4. Implementation Steps</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• OAuth 2.0 authentication</li>
                  <li>• Microsoft Graph API calls</li>
                  <li>• File picker integration</li>
                  <li>• File download/upload</li>
                </ul>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Note:</strong> This demo shows the UI structure. To fully implement OneDrive integration, you'll
                need to set up Microsoft Graph API authentication and file access. The actual implementation requires
                server-side routes to handle OAuth flows and API calls securely.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
