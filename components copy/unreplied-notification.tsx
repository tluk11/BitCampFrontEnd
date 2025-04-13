import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { fetchEmails } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Mail, ChevronDown, ChevronUp } from "lucide-react"
import type { Email } from "@/types/email"

interface UnrepliedEmail {
  id: string
  subject: string
  date: string
  folder: string
  category?: string
}

interface UnrepliedNotificationProps {
  onSelectEmail: (email: Email) => void
}

export function UnrepliedNotification({ onSelectEmail }: UnrepliedNotificationProps) {
  const [unrepliedEmails, setUnrepliedEmails] = useState<UnrepliedEmail[]>([])
  const [isMinimized, setIsMinimized] = useState(false)
  const router = useRouter()

  const fetchUnrepliedEmails = async () => {
    try {
      const emails = await fetchEmails("inbox")
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const unreplied = emails
        .filter((email) => {
          const emailDate = new Date(email.date)
          return !email.replied && emailDate < oneDayAgo
        })
        .map((email) => ({
          id: email.id,
          subject: email.subject,
          date: email.date,
          folder: email.folder,
          category: email.category,
        }))

      setUnrepliedEmails(unreplied)
    } catch (error) {
      console.error("Error fetching unreplied emails:", error)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchUnrepliedEmails()

    // Set up interval to check every hour
    const interval = setInterval(fetchUnrepliedEmails, 60 * 60 * 1000)

    // Listen for reply events
    const handleReplyEvent = () => {
      fetchUnrepliedEmails()
    }
    window.addEventListener('reply-sent', handleReplyEvent)

    return () => {
      clearInterval(interval)
      window.removeEventListener('reply-sent', handleReplyEvent)
    }
  }, [])

  const handleViewEmail = (email: UnrepliedEmail) => {
    // Find the full email object from the inbox
    fetchEmails("inbox").then(emails => {
      const fullEmail = emails.find(e => e.id === email.id)
      if (fullEmail) {
        onSelectEmail(fullEmail)
      }
    })
  }

  // Update the unreplied emails list when an email is updated
  useEffect(() => {
    const handleEmailUpdate = (event: CustomEvent<Email>) => {
      const updatedEmail = event.detail
      setUnrepliedEmails(prev => 
        prev.filter(email => email.id !== updatedEmail.id)
      )
    }

    window.addEventListener('email-updated', handleEmailUpdate as EventListener)
    return () => {
      window.removeEventListener('email-updated', handleEmailUpdate as EventListener)
    }
  }, [])

  if (unrepliedEmails.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <h3 className="font-semibold">Unreplied Emails</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      {!isMinimized && (
        <>
          <p className="text-sm text-muted-foreground mb-3">
            You have {unrepliedEmails.length} email{unrepliedEmails.length > 1 ? 's' : ''} that haven't been replied to in over a day.
          </p>
          <div className="space-y-2">
            {unrepliedEmails.map(email => (
              <div key={email.id} className="flex items-center justify-between">
                <span className="text-sm truncate">{email.subject}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewEmail(email)}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 