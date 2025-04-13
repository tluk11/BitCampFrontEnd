import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { emailId, category } = await request.json()

    // In a real implementation, this would call your backend API
    // For now, we'll return a mock success response
    console.log(`Updated category to "${category}" for email ${emailId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error editing category:", error)
    return NextResponse.json({ error: "Failed to edit category" }, { status: 500 })
  }
}
