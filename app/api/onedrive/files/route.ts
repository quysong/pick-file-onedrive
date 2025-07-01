import { type NextRequest, NextResponse } from "next/server"

// This would fetch files from OneDrive
export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("Authorization")?.replace("Bearer ", "")

  if (!accessToken) {
    return NextResponse.json({ error: "No access token provided" }, { status: 401 })
  }

  try {
    // Fetch files from OneDrive using Microsoft Graph API
    const response = await fetch("https://graph.microsoft.com/v1.0/me/drive/root/children", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch OneDrive files")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("OneDrive API error:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}
