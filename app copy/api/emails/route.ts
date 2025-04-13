import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const folder = searchParams.get("folder") || "inbox"

  // This would normally connect to your backend
  // For now, we'll return mock data
  const mockEmails = [
    {
      id: "1",
      subject: "Turbopack Testing",
      body: 'Hi Lee, Here are the steps to test out Turbopack: 1. npx create-next-app@canary 2. Select Turbopack when prompted 3. Run "npm run dev" to start the development server.',
      date: "2025-04-12T10:30:00Z",
      folder: "inbox",
      category: "work",
      sender: {
        name: "Tim Neutkens",
        email: "tim@vercel.com",
      },
      read: false,
    },
    {
      id: "2",
      subject: "New Next.js RFC",
      body: "Thank you!",
      date: "2025-04-11T14:23:00Z",
      folder: "inbox",
      category: "work",
      sender: {
        name: "Delba de Oliveira",
        email: "delba@vercel.com",
      },
      read: true,
    },
    {
      id: "3",
      subject: "Vercel Customer Feedback",
      body: "Amazing. Let me know when it shipped and I'll follow up.",
      date: "2025-04-10T09:15:00Z",
      folder: "inbox",
      category: "work",
      sender: {
        name: "Guillermo Rauch",
        email: "guillermo@vercel.com",
      },
      read: true,
    },
  ]

  return NextResponse.json(mockEmails.filter((email) => email.folder === folder))
}
