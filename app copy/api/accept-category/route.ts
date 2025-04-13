import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { emailId, category } = await request.json()

    // In a real implementation, this would call your backend API
    // For now, we'll return a mock success response
    console.log(`Accepted category "${category}" for email ${emailId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error accepting category:", error)
    return NextResponse.json({ error: "Failed to accept category" }, { status: 500 })
  }
}
