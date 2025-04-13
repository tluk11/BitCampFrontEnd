"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { EmailList } from "@/components/email-list"
import { EmailDetail } from "@/components/email-detail"
import { ProfileSidebar } from "@/components/profile-sidebar"
import type { Email } from "@/types/email"
import { UnrepliedNotification } from "./unreplied-notification"
import { Sidebar } from "@/components/sidebar"

export function EmailLayout() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [emails, setEmails] = useState<Email[]>([])

  // Extract folder and category from pathname
  const isCategoryView = pathname?.startsWith("/c/")
  const folder = isCategoryView ? "inbox" : pathname?.split("/f/")[1] || "inbox"
  const category = isCategoryView ? pathname?.split("/c/")[1] : undefined

  const handleCategoryChange = (emailId: string, newCategory: string) => {
    // In a real app, this would update the email in the database
    // For now, we'll just navigate to the category view
    router.push(`/c/${newCategory}`)
    
    // Close the email detail view
    setSelectedEmail(null)
  }

  return (
    <div className="flex h-screen">
      {/* Main sidebar with fixed width */}
      <div className="w-[280px] border-r flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex">
        <EmailList
          folder={folder}
          category={category}
          onSelectEmail={setSelectedEmail}
          selectedEmailId={selectedEmail?.id}
        />
        {selectedEmail ? (
          <div className="flex-1 flex">
            <EmailDetail
              email={selectedEmail}
              onClose={() => setSelectedEmail(null)}
              showProfile={() => {}}
              onCategoryChange={handleCategoryChange}
              onSelectEmail={setSelectedEmail}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center pl-96 pr-6 py-6 bg-background">
            <div className="text-center">
              <h3 className="text-2xl font-medium">Select an email to view</h3>
              <p className="text-base text-muted-foreground mt-2">Choose an email from the list to view its contents</p>
            </div>
          </div>
        )}
      </div>
      <UnrepliedNotification onSelectEmail={setSelectedEmail} />
    </div>
  )
}
