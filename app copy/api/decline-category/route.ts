import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { emailId } = await request.json()

    // In a real implementation, this would call your backend API
    // For now, we'll return a mock success response
    console.log(`Declined category for email ${emailId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error declining category:", error)
    return NextResponse.json({ error: "Failed to decline category" }, { status: 500 })
  }
}
