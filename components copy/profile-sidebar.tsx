"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Person } from "@/types/email"

interface ProfileSidebarProps {
  sender: Person
  onClose: () => void
}

export function ProfileSidebar({ sender, onClose }: ProfileSidebarProps) {
  // This would normally come from an API call to get more details about the sender
  const profile = {
    ...sender,
    location: "San Francisco, CA",
    title: "Software Engineer",
    company: "Acme Inc.",
    tags: ["Important", "Work", "Priority"],
    connections: [
      { platform: "LinkedIn", url: "#", username: sender.name.toLowerCase().replace(" ", "") },
      { platform: "Twitter", url: "#", username: `@${sender.name.toLowerCase().replace(" ", "")}` },
      { platform: "GitHub", url: "#", username: sender.name.toLowerCase().replace(" ", "") },
    ],
  }

  return (
    <div className="w-80 border-l bg-background overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Contact</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="text-2xl">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold">{profile.name}</h3>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <p className="text-sm text-muted-foreground mt-1">{profile.location}</p>
          <div className="mt-2">
            <p className="text-sm font-medium">{profile.title}</p>
            <p className="text-sm text-muted-foreground">{profile.company}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag, i) => (
                <Badge key={i} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-2">Connections</h4>
            <div className="space-y-2">
              {profile.connections.map((connection, i) => (
                <a
                  key={i}
                  href={connection.url}
                  className="flex items-center gap-2 text-sm hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="font-medium">{connection.platform}:</span>
                  <span className="text-muted-foreground">{connection.username}</span>
                </a>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold mb-2">Recent conversations</h4>
            <p className="text-sm text-muted-foreground">You have 5 recent email threads with this contact.</p>
          </div>

          <div className="pt-2">
            <Button className="w-full">Send Message</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}
