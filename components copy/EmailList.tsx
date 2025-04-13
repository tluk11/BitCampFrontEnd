import React, { useEffect, useState } from 'react'
import { fetchEmails, markAsRead } from '../lib/api'
import type { Email } from '@/types/email'
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import { Circle } from "lucide-react"

interface EmailListProps {
  folder?: string
  category?: string
  onSelectEmail?: (email: Email) => void
  selectedEmailId?: string
}

const EmailList = ({ folder = '', category = '', onSelectEmail, selectedEmailId }: EmailListProps) => {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEmails = async () => {
      try {
        setLoading(true)
        const emails = await fetchEmails(folder, category)
        setEmails(emails)
      } catch (error) {
        console.error("Error loading emails:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEmails()
  }, [folder, category])

  const handleEmailClick = async (email: Email) => {
    if (!email.read) {
      try {
        const success = await markAsRead(email.id)
        if (success) {
          // Refresh the emails to get the updated read status
          const updatedEmails = await fetchEmails(folder, category)
          setEmails(updatedEmails)
        }
      } catch (error) {
        console.error("Error marking email as read:", error)
      }
    }
    onSelectEmail?.(email)
  }

  if (loading) {
    return <div className="p-4">Loading emails...</div>
  }

  if (emails.length === 0) {
    return <div className="p-4">No emails found</div>
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="divide-y">
        {emails.map((email) => (
          <div
            key={email.id}
            className={`p-4 hover:bg-accent cursor-pointer h-[120px] relative flex flex-col ${
              selectedEmailId === email.id ? 'bg-accent' : ''
            } ${email.read ? 'opacity-70' : ''}`}
            onClick={() => handleEmailClick(email)}
          >
            {/* Subject line */}
            <div className="flex items-center justify-between h-6 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                {!email.read && <Circle className="h-2 w-2 text-primary shrink-0" fill="currentColor" />}
                <span className={`font-medium truncate ${email.read ? 'font-normal' : ''}`}>{email.subject}</span>
                {email.category && email.category !== "uncategorized" && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    {email.category.charAt(0).toUpperCase() + email.category.slice(1)}
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground shrink-0">
                {format(new Date(email.date), 'MMM d, yyyy')}
              </span>
            </div>

            {/* Sender info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground h-5 mb-2">
              <span className="truncate">{email.sender.name}</span>
              <span>•</span>
              <span className="truncate">{email.sender.email}</span>
            </div>

            {/* Email body */}
            <div className="h-10 overflow-hidden">
              <p className={`text-sm text-muted-foreground line-clamp-2 ${email.read ? 'opacity-70' : ''}`}>
                {email.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmailList 