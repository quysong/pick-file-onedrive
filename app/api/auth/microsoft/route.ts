import { type NextRequest, NextResponse } from "next/server"

// This would handle the Microsoft OAuth callback
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No authorization code provided" }, { status: 400 })
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/microsoft`,
        scope: "https://graph.microsoft.com/Files.Read https://graph.microsoft.com/User.Read",
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || "Failed to exchange code for tokens")
    }

    // Store tokens securely (in a real app, use encrypted cookies or database)
    // For demo purposes, we'll redirect with success
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/?auth=success`)
  } catch (error) {
    console.error("Microsoft auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
