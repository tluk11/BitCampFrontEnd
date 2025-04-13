import type { Email } from "@/types/email"
import { EMAIL_CATEGORIES, addCategory } from "@/lib/constants"

// Mock data for development
const mockEmails: Email[] = [
  {
    id: "1",
    subject: "Turbopack Testing",
    body: 'Hi Lee, Here are the steps to test out Turbopack: 1. npx create-next-app@canary 2. Select Turbopack when prompted 3. Run "npm run dev" to start the development server.',
    date: "2025-04-12T10:30:00Z",
    folder: "inbox",
    category: "work",
    suggestedCategory: "work",
    sender: {
      name: "Tim Neutkens",
      email: "tim@vercel.com",
    },
    read: false,
    replied: false,
  },
  {
    id: "2",
    subject: "New Next.js RFC",
    body: "Thank you!",
    date: "2025-04-11T14:23:00Z",
    folder: "inbox",
    category: "uncategorized", // This email has no category yet
    suggestedCategory: "important",
    sender: {
      name: "Delba de Oliveira",
      email: "delba@vercel.com",
    },
    read: true,
    replied: true,
  },
  {
    id: "3",
    subject: "Vercel Customer Feedback",
    body: "Amazing. Let me know when it shipped and I'll follow up.",
    date: "2025-04-10T09:15:00Z",
    folder: "inbox",
    category: "work",
    suggestedCategory: "personal",
    sender: {
      name: "Guillermo Rauch",
      email: "guillermo@vercel.com",
    },
    read: true,
    replied: false,
  },
  {
    id: "4",
    subject: "Weekly Team Meeting",
    body: "Hi team, Just a reminder about our weekly sync tomorrow at 10 AM. Please prepare your updates.",
    date: "2025-04-09T16:45:00Z",
    folder: "inbox",
    category: "work",
    suggestedCategory: "work",
    sender: {
      name: "Sarah Johnson",
      email: "sarah@company.com",
    },
    read: false,
    replied: false,
  },
  {
    id: "5",
    subject: "Your Subscription Renewal",
    body: "Your premium subscription is due for renewal in 7 days. Click here to renew.",
    date: "2025-04-08T11:20:00Z",
    folder: "inbox",
    category: "newsletter",
    suggestedCategory: "newsletter",
    sender: {
      name: "Newsletter Team",
      email: "newsletter@service.com",
    },
    read: true,
    replied: false,
  },
  {
    id: "6",
    subject: "Family Reunion Planning",
    body: "Hey everyone, I've started planning the family reunion for this summer. Let me know your availability.",
    date: "2025-04-07T09:30:00Z",
    folder: "inbox",
    category: "personal",
    suggestedCategory: "personal",
    sender: {
      name: "Mom",
      email: "mom@family.com",
    },
    read: false,
    replied: false,
  },
  {
    id: "email-1",
    subject: "Weekly Team Meeting",
    sender: {
      name: "John Smith",
      email: "john.smith@example.com",
    },
    date: "2024-03-10T09:00:00Z",
    body: "Hi team, just a reminder about our weekly meeting tomorrow at 10 AM. Please prepare your updates.",
    read: false,
    replied: false,
    folder: "inbox",
    category: "work",
  },
  {
    id: "email-2",
    subject: "Your Amazon Order #12345",
    sender: {
      name: "Amazon",
      email: "no-reply@amazon.com",
    },
    date: "2024-03-09T14:30:00Z",
    body: "Your order has been shipped and will arrive tomorrow. Track your package here.",
    read: false,
    replied: false,
    folder: "inbox",
    category: "personal",
  },
  {
    id: "email-3",
    subject: "Newsletter: Tech Updates",
    sender: {
      name: "Tech News",
      email: "newsletter@technews.com",
    },
    date: "2024-03-08T08:00:00Z",
    body: "Stay updated with the latest in technology. This week's highlights...",
    read: false,
    replied: false,
    folder: "inbox",
    category: "newsletter",
  },
  {
    id: "email-4",
    subject: "Important: System Maintenance",
    sender: {
      name: "IT Department",
      email: "it@company.com",
    },
    date: "2024-03-07T16:00:00Z",
    body: "System maintenance scheduled for this weekend. Please save your work.",
    read: false,
    replied: false,
    folder: "inbox",
    category: "important",
  },
  {
    id: "email-5",
    subject: "You've Won $1,000,000!",
    sender: {
      name: "Lucky Draw",
      email: "prize@lucky.com",
    },
    date: "2024-03-06T12:00:00Z",
    body: "Congratulations! You've won our grand prize. Click here to claim!",
    read: false,
    replied: false,
    folder: "inbox",
    category: "spam",
  },
  {
    id: "email-6",
    subject: "Project Proposal: New Marketing Campaign",
    sender: {
      name: "Marketing Team",
      email: "marketing@company.com",
    },
    date: "2024-03-15T10:30:00Z",
    body: "We've prepared a new marketing campaign proposal for Q2. Please review the attached documents and provide your feedback by next week.",
    read: false,
    replied: false,
    folder: "inbox",
    category: "uncategorized",
    suggestedCategory: "work",
  },
  {
    id: "email-7",
    subject: "Invitation: Team Building Event",
    sender: {
      name: "HR Department",
      email: "hr@company.com",
    },
    date: "2024-03-16T14:00:00Z",
    body: "Join us for our quarterly team building event next Friday! We'll have fun activities, games, and a BBQ lunch. Please RSVP by Wednesday.",
    read: false,
    replied: false,
    folder: "inbox",
    category: "uncategorized",
    suggestedCategory: "important",
  }
]

// Base URL for your backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Function to fetch emails from a specific folder
export async function fetchEmails(folder: string, category?: string): Promise<Email[]> {
  // For development, return mock data
  if (process.env.NODE_ENV === "development") {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredEmails = [...mockEmails]
        
        // First filter by folder
        if (folder !== "all") {
          filteredEmails = filteredEmails.filter((email) => email.folder === folder)
        }
        
        // Then filter by category if specified
        if (category) {
          filteredEmails = filteredEmails.filter((email) => email.category === category)
        }
        
        console.log('Filtered emails:', filteredEmails) // Debug log
        resolve(filteredEmails)
      }, 500)
    })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/emails?folder=${folder}${category ? `&category=${category}` : ''}`)
    if (!response.ok) {
      throw new Error("Failed to fetch emails")
    }
    const emails: Email[] = await response.json()
    
    // Filter by category if provided
    if (category) {
      return emails.filter(email => email.category === category)
    }
    
    return emails
  } catch (error) {
    console.error("Error fetching emails:", error)
    return []
  }
}

// Function to generate a reply using your AI backend
export async function generateReply(email: Email): Promise<string> {
  // For development, return a mock reply
  if (process.env.NODE_ENV === "development") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `Hi ${email.sender.name},\n\nThank you for your email. I've received your message about "${email.subject}" and will get back to you shortly.\n\nBest regards,\nYour Name`,
        )
      }, 1000) // Simulate network delay
    })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/generate-reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: email.subject,
        body: email.body,
        sender: email.sender.email,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate reply")
    }

    const data = await response.json()
    return data.reply
  } catch (error) {
    console.error("Error generating reply:", error)
    throw error
  }
}

// Function to send an email reply
export async function sendReply(emailId: string, content: string, replyAll: boolean = false): Promise<boolean> {
  // For development, update the replied status in mock data
  if (process.env.NODE_ENV === "development") {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the email in mock data and update its replied status
        const emailIndex = mockEmails.findIndex((email) => email.id === emailId)
        if (emailIndex !== -1) {
          // Create a new array with the updated email
          const updatedEmails = [...mockEmails]
          updatedEmails[emailIndex] = {
            ...updatedEmails[emailIndex],
            replied: true
          }
          // Update the mock data
          mockEmails.splice(0, mockEmails.length, ...updatedEmails)
          console.log(`Email ${replyAll ? 'reply all' : 'reply'} sent:`, emailId) // Debug log
        }
        resolve(true)
      }, 0)
    })
  }

  // In a real app, this would make an API call to send the reply
  return true
}

// Function to accept a suggested category
export async function acceptCategory(emailId: string, category: string): Promise<boolean> {
  // For development, simulate a successful operation
  if (process.env.NODE_ENV === "development") {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the original email
        const emailIndex = mockEmails.findIndex((email) => email.id === emailId)
        if (emailIndex !== -1) {
          // Update the existing email
          mockEmails[emailIndex] = {
            ...mockEmails[emailIndex],
            category: category,
            suggestedCategory: undefined // Remove the suggestion
          }
          console.log('Updated email category:', mockEmails[emailIndex]) // Debug log
        }
        resolve(true)
      }, 500)
    })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/accept-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailId,
        category,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to accept category")
    }

    return true
  } catch (error) {
    console.error("Error accepting category:", error)
    return false
  }
}

// Function to decline a suggested category
export async function declineCategory(emailId: string): Promise<boolean> {
  // For development, simulate a successful operation
  if (process.env.NODE_ENV === "development") {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/decline-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailId,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to decline category")
    }

    return true
  } catch (error) {
    console.error("Error declining category:", error)
    return false
  }
}

// Function to edit a category
export async function editCategory(emailId: string, newCategory: string): Promise<boolean> {
  // For development, simulate a successful category edit
  if (process.env.NODE_ENV === "development") {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update the category in mock data
        const emailIndex = mockEmails.findIndex((email) => email.id === emailId)
        if (emailIndex !== -1) {
          mockEmails[emailIndex] = {
            ...mockEmails[emailIndex],
            category: newCategory
          }
        }
        // Add the new category to EMAIL_CATEGORIES if it doesn't exist
        addCategory(newCategory)
        resolve(true)
      }, 800) // Simulate network delay
    })
  }

  try {
    const response = await fetch(`${API_BASE_URL}/edit-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailId,
        category: newCategory,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to edit category")
    }

    return true
  } catch (error) {
    console.error("Error editing category:", error)
    return false
  }
}

export async function markAsRead(emailId: string): Promise<boolean> {
  // For development, update the read status in mock data
  if (process.env.NODE_ENV === "development") {
    // Find the email in mock data and update its read status
    const emailIndex = mockEmails.findIndex((email) => email.id === emailId)
    if (emailIndex !== -1) {
      // Create a new array with the updated email
      const updatedEmails = [...mockEmails]
      updatedEmails[emailIndex] = {
        ...updatedEmails[emailIndex],
        read: true
      }
      // Update the mock data
      mockEmails.splice(0, mockEmails.length, ...updatedEmails)
      console.log('Email marked as read:', emailId, updatedEmails[emailIndex]) // Debug log
      return true
    }
    return false
  }

  // In a real app, this would make an API call to update the email's read status
  return true
}
