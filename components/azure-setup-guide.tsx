"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"

export function AzureSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const currentUrl = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Azure App Registration Setup Guide
        </CardTitle>
        <CardDescription>
          Follow these steps to create and configure your Microsoft Azure app registration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertDescription>
            <strong>Important:</strong> You need to create an Azure app registration to use Microsoft OneDrive
            integration. This is required for OAuth authentication.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Step 1: Create Azure App Registration</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Go to{" "}
                <a
                  href="https://portal.azure.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Azure Portal
                </a>
              </li>
              <li>Navigate to "Azure Active Directory" → "App registrations"</li>
              <li>Click "New registration"</li>
              <li>Enter a name like "OneDrive File Upload App"</li>
              <li>Select "Accounts in any organizational directory and personal Microsoft accounts"</li>
              <li>Click "Register"</li>
            </ol>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Step 2: Configure Redirect URI</h3>
            <div className="space-y-2">
              <p className="text-sm">Add this redirect URI to your app registration:</p>
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded font-mono text-sm">
                <span className="flex-1">{currentUrl}/api/auth/microsoft</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`${currentUrl}/api/auth/microsoft`, 1)}
                >
                  {copiedStep === 1 ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
                <li>In your app registration, go to "Authentication"</li>
                <li>Click "Add a platform" → "Web"</li>
                <li>Add the redirect URI above</li>
                <li>Check "Access tokens" and "ID tokens"</li>
                <li>Click "Configure"</li>
              </ol>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Step 3: Get Client ID and Secret</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>In your app registration overview, copy the "Application (client) ID"</li>
              <li>Go to "Certificates & secrets"</li>
              <li>Click "New client secret"</li>
              <li>Add a description and set expiration</li>
              <li>Copy the secret value (you won't see it again!)</li>
            </ol>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Step 4: Configure API Permissions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to "API permissions"</li>
              <li>Click "Add a permission" → "Microsoft Graph" → "Delegated permissions"</li>
              <li>
                Add these permissions:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Files.Read</li>
                  <li>Files.ReadWrite</li>
                  <li>User.Read</li>
                </ul>
              </li>
              <li>Click "Add permissions"</li>
            </ol>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Step 5: Set Environment Variables</h3>
            <p className="text-sm mb-2">Add these to your environment variables:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded font-mono text-sm">
                <span className="flex-1">NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_client_id_here</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_client_id_here", 2)}
                >
                  {copiedStep === 2 ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded font-mono text-sm">
                <span className="flex-1">MICROSOFT_CLIENT_SECRET=your_client_secret_here</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("MICROSOFT_CLIENT_SECRET=your_client_secret_here", 3)}
                >
                  {copiedStep === 3 ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Note:</strong> After setting up your Azure app registration and environment variables, restart your
            development server for the changes to take effect.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
