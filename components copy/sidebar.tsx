"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Archive,
  ArchiveX,
  Briefcase,
  File,
  Inbox,
  Menu,
  MessageSquare,
  PenSquare,
  Send,
  Star,
  Trash2,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EMAIL_CATEGORIES } from "@/lib/constants"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  count?: number
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Inbox",
      href: "/f/inbox",
      icon: <Inbox className="h-4 w-4" />,
      count: 3,
    },
    {
      title: "Drafts",
      href: "/f/drafts",
      icon: <File className="h-4 w-4" />,
      count: 1,
    },
    {
      title: "Sent",
      href: "/f/sent",
      icon: <Send className="h-4 w-4" />,
    },
    {
      title: "Spam",
      href: "/f/spam",
      icon: <ArchiveX className="h-4 w-4" />,
      count: 12,
    },
    {
      title: "Trash",
      href: "/f/trash",
      icon: <Trash2 className="h-4 w-4" />,
    },
    {
      title: "Archive",
      href: "/f/archive",
      icon: <Archive className="h-4 w-4" />,
    },
  ]

  // Map our simplified categories to icons
  const categoryIcons: Record<string, React.ReactNode> = {
    personal: <User className="h-4 w-4" />,
    work: <Briefcase className="h-4 w-4" />,
    important: <Star className="h-4 w-4" />,
    spam: <ArchiveX className="h-4 w-4" />,
    newsletter: <MessageSquare className="h-4 w-4" />,
  }

  const categories = EMAIL_CATEGORIES.map((category) => ({
    title: category.charAt(0).toUpperCase() + category.slice(1),
    href: `/c/${category}`,
    icon: categoryIcons[category] || <MessageSquare className="h-4 w-4" />,
  }))

  return (
    <div
      className={cn("flex flex-col border-r bg-muted/40 transition-all duration-300", isCollapsed ? "w-16" : "w-64")}
    >
      <div className="flex h-14 items-center px-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        {!isCollapsed && <h1 className="text-lg font-semibold">AI Email</h1>}
      </div>
      <div className="flex-1 overflow-auto py-2">
        <div className="px-3 py-2">
          {!isCollapsed && <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Mailboxes</h2>}
          <nav className="grid gap-1 px-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                  isCollapsed && "justify-center px-0",
                )}
              >
                {item.icon}
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.count !== undefined && <span className="text-xs text-muted-foreground">{item.count}</span>}
                  </>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-3 py-2">
          {!isCollapsed && <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Categories</h2>}
          <nav className="grid gap-1 px-2">
            {categories.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                  isCollapsed && "justify-center px-0",
                )}
              >
                {item.icon}
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="sticky bottom-0 mt-auto p-4">
        <Button className={cn("w-full", isCollapsed && "px-0")}>
          <PenSquare className="h-4 w-4 mr-2" />
          {!isCollapsed && <span>Compose</span>}
        </Button>
      </div>
    </div>
  )
}
