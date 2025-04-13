"use client"

import { useEffect, useState } from "react"
import { Search, Share } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Email } from "@/types/email"
import { fetchEmails } from "@/lib/api"
import { CategoryMenu } from "./category-menu"

interface EmailListProps {
  folder: string
  category?: string
  onSelectEmail: (email: Email) => void
  selectedEmailId?: string
}

export function EmailList({ folder, category, onSelectEmail, selectedEmailId }: EmailListProps) {
  const [emails, setEmails] = useState<Email[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadEmails = async () => {
      setIsLoading(true)
      const fetchedEmails = await fetchEmails(folder, category)
      setEmails(fetchedEmails)
      setIsLoading(false)
    }

    loadEmails()
  }, [folder, category])

  const filteredEmails = emails.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRename = () => {
    // TODO: Implement rename functionality
  }

  const handleDelete = () => {
    // TODO: Implement delete functionality
  }

  return (
    <div className="w-80 border-r">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {category ? category.charAt(0).toUpperCase() + category.slice(1) : folder.charAt(0).toUpperCase() + folder.slice(1)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {emails.length} email{emails.length !== 1 ? 's' : ''}
            </p>
          </div>
          {category && (
            <CategoryMenu
              category={category}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search emails..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="p-4">
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className="p-4">
          <div className="text-center text-muted-foreground">
            No emails found
          </div>
        </div>
      ) : (
        <div className="divide-y">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`p-4 cursor-pointer hover:bg-muted/50 ${
                selectedEmailId === email.id ? "bg-muted" : ""
              }`}
              onClick={() => onSelectEmail(email)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium truncate">{email.subject}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(email.date).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {email.sender.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)

  // If it's today, show the time
  if (isToday(date)) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // If it's this year, show the month and day
  if (isThisYear(date)) {
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  // Otherwise show the full date
  return date.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" })
}

function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function isThisYear(date: Date): boolean {
  return date.getFullYear() === new Date().getFullYear()
}
