"use client"

import { useState, useEffect } from "react"
import {
  Archive,
  ArrowLeft,
  Check,
  Clock,
  Edit2,
  Forward,
  MoreVertical,
  Plus,
  Reply,
  ReplyAll,
  Trash2,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Email } from "@/types/email"
import { generateReply, acceptCategory, declineCategory, editCategory, sendReply } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { EMAIL_CATEGORIES } from "@/lib/constants"

interface EmailDetailProps {
  email: Email
  onClose: () => void
  showProfile: () => void
  onCategoryChange?: (emailId: string, newCategory: string) => void
  onSelectEmail: (email: Email) => void
}

export function EmailDetail({ email, onClose, showProfile, onCategoryChange, onSelectEmail }: EmailDetailProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isGeneratingReply, setIsGeneratingReply] = useState(false)
  const [isEditingCategory, setIsEditingCategory] = useState(false)
  const [isCategoryProcessing, setIsCategoryProcessing] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [editedCategory, setEditedCategory] = useState(email.suggestedCategory || "")
  const [customCategoryInput, setCustomCategoryInput] = useState("")
  const [customCategories, setCustomCategories] = useState<Record<string, boolean>>({})
  const [showAIReplyDialog, setShowAIReplyDialog] = useState(false)
  const [generatedReply, setGeneratedReply] = useState("")
  const [showSendConfirmation, setShowSendConfirmation] = useState(false)
  const [replyMode, setReplyMode] = useState<'reply' | 'replyAll'>('reply')
  const { toast } = useToast()

  // Determine if we should show the category suggestion
  useEffect(() => {
    // Only show suggestion if email has a suggested category and doesn't have a designated category
    const hasDesignatedCategory = email.category && email.category !== "uncategorized"
    const shouldShowSuggestion = !!email.suggestedCategory && !hasDesignatedCategory

    setShowSuggestion(shouldShowSuggestion)
  }, [email])

  const handleGenerateReply = async () => {
    setIsGeneratingReply(true)
    try {
      const reply = await generateReply(email)
      setGeneratedReply(reply)
      setShowAIReplyDialog(true)
    } catch (error) {
      toast({
        title: "Failed to generate reply",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingReply(false)
    }
  }

  const handleSendReply = async () => {
    if (!replyContent.trim()) return

    try {
      const success = await sendReply(email.id, replyContent, replyMode === 'replyAll')
      if (success) {
        setReplyContent("")
        setIsReplying(false)
        // Update the email's replied status
        const updatedEmail = { ...email, replied: true }
        onSelectEmail(updatedEmail)
        // Dispatch events
        window.dispatchEvent(new Event('reply-sent'))
        window.dispatchEvent(new CustomEvent('email-updated', { detail: updatedEmail }))
        toast({
          title: "Reply sent",
          description: `Reply ${replyMode === 'replyAll' ? 'to all' : ''} sent successfully`,
        })
      }
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "Failed to send reply",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  const handleAcceptCategory = async () => {
    if (!email.suggestedCategory) return

    setIsCategoryProcessing(true)
    try {
      const success = await acceptCategory(email.id, email.suggestedCategory)
      if (success && onCategoryChange) {
        onCategoryChange(email.id, email.suggestedCategory)
      }
    } catch (error) {
      console.error("Error accepting category:", error)
    } finally {
      setIsCategoryProcessing(false)
    }
  }

  const handleDeclineCategory = async () => {
    setIsCategoryProcessing(true)
    try {
      const success = await declineCategory(email.id)
      if (success) {
        toast({
          title: "Category declined",
          description: "Suggested category has been declined",
        })
        // Update the email to remove the suggested category
        const updatedEmail = { ...email, suggestedCategory: undefined }
        onSelectEmail(updatedEmail)
      } else {
        throw new Error("Failed to decline category")
      }
    } catch (error) {
      toast({
        title: "Failed to decline category",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsCategoryProcessing(false)
    }
  }

  const handleEditCategory = async (newCategory: string) => {
    // Allow any non-empty category
    if (!newCategory.trim()) {
      toast({
        title: "Invalid category",
        description: "Category cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsCategoryProcessing(true)
    try {
      const success = await editCategory(email.id, newCategory)
      if (success && onCategoryChange) {
        // Add the custom category to our list of known categories
        setCustomCategories(prev => ({ ...prev, [newCategory]: true }))
        onCategoryChange(email.id, newCategory)
        toast({
          title: "Category updated",
          description: `Email moved to ${newCategory}`,
        })
      }
    } catch (error) {
      console.error("Error editing category:", error)
      toast({
        title: "Failed to update category",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsCategoryProcessing(false)
      setIsEditingCategory(false)
      setCustomCategoryInput("")
    }
  }

  const handleAcceptAIReply = () => {
    setShowAIReplyDialog(false)
    setReplyContent(generatedReply)
    setShowSendConfirmation(true)
  }

  const handleEditAIReply = () => {
    setShowAIReplyDialog(false)
    setReplyContent(generatedReply)
    setIsReplying(true)
  }

  const handleCategoryChange = async (newCategory: string) => {
    if (newCategory === email.category) return

    const success = await editCategory(email.id, newCategory)
    if (success && onCategoryChange) {
      onCategoryChange(email.id, newCategory)
      toast({
        title: "Category updated",
        description: `Email moved to ${newCategory}`,
      })
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" onClick={showProfile}>
            <User className="h-4 w-4" />
            <span className="sr-only">View profile</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Archive className="h-4 w-4" />
            <span className="sr-only">Archive</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Clock className="h-4 w-4" />
            <span className="sr-only">Snooze</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Mark as important</DropdownMenuItem>
              <DropdownMenuItem>Add to tasks</DropdownMenuItem>
              <DropdownMenuItem>Create filter</DropdownMenuItem>
              <DropdownMenuItem>Block sender</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{email.subject}</h1>
        <div className="flex items-start gap-4 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {email.sender.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="font-semibold">{email.sender.name}</h2>
                <p className="text-sm text-muted-foreground">{email.sender.email}</p>
              </div>
              <p className="text-sm text-muted-foreground whitespace-nowrap ml-2">
                {new Date(email.date).toLocaleString()}
              </p>
            </div>
            <div className="text-sm text-muted-foreground mt-1">To: me</div>
          </div>
        </div>

        {/* Category suggestion section - only show when there's no category */}
        {showSuggestion && email.suggestedCategory && (
          <div className="mb-6 p-4 border rounded-md bg-muted/30">
            <h3 className="text-sm font-medium mb-2">AI Suggested Category:</h3>
            <div className="flex flex-wrap items-center gap-3">
              {isEditingCategory ? (
                <div className="flex items-center gap-2">
                  <Select
                    value={editedCategory}
                    onValueChange={(value) => {
                      setEditedCategory(value)
                      if (value !== "custom") {
                        setCustomCategoryInput("")
                      }
                    }}
                    disabled={isCategoryProcessing}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...EMAIL_CATEGORIES, ...Object.keys(customCategories)].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Category...</SelectItem>
                    </SelectContent>
                  </Select>
                  {editedCategory === "custom" && (
                    <Input
                      className="w-[180px]"
                      placeholder="Enter custom category"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                    />
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2"
                    onClick={() => {
                      const categoryToSave = editedCategory === "custom" ? customCategoryInput : editedCategory
                      handleEditCategory(categoryToSave)
                    }}
                    disabled={isCategoryProcessing}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2"
                    onClick={() => {
                      setIsEditingCategory(false)
                      setCustomCategoryInput("")
                    }}
                    disabled={isCategoryProcessing}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <Badge variant="outline" className="bg-primary/10">
                    {email.suggestedCategory.charAt(0).toUpperCase() + email.suggestedCategory.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={handleAcceptCategory}
                      disabled={isCategoryProcessing}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={handleDeclineCategory}
                      disabled={isCategoryProcessing}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2"
                      onClick={() => setIsEditingCategory(true)}
                      disabled={isCategoryProcessing}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: formatEmailBody(email.body) }} />
        </div>

        {isReplying ? (
          <div className="mt-6 border rounded-md p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium">Reply {replyMode === 'replyAll' ? 'to all' : ''} to {email.sender.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>
                Cancel
              </Button>
            </div>
            <Textarea
              className="min-h-[150px] mb-3"
              placeholder={`Write your ${replyMode === 'replyAll' ? 'reply to all' : 'reply'}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReplying(false)}>
                Discard
              </Button>
              <Button onClick={() => setShowSendConfirmation(true)}>Send</Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-2">
            <Button variant="outline" onClick={() => {
              setReplyMode('reply')
              setIsReplying(true)
            }}>
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" onClick={() => {
              setReplyMode('replyAll')
              setIsReplying(true)
            }}>
              <ReplyAll className="h-4 w-4 mr-2" />
              Reply All
            </Button>
            <Button variant="outline">
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </Button>
            <Button variant="outline" className="ml-auto" onClick={handleGenerateReply} disabled={isGeneratingReply}>
              {isGeneratingReply ? "Generating..." : "AI Generate Reply"}
            </Button>
          </div>
        )}
      </div>

      {/* AI Reply Dialog */}
      <Dialog open={showAIReplyDialog} onOpenChange={setShowAIReplyDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI Generated Reply</DialogTitle>
            <DialogDescription>
              The AI has generated a reply based on the email content. You can send it as is, edit it, or skip.
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-md p-3 my-4 max-h-[300px] overflow-y-auto whitespace-pre-wrap">
            {generatedReply}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIReplyDialog(false)}>
              Skip
            </Button>
            <Button variant="outline" onClick={handleEditAIReply}>
              Edit
            </Button>
            <Button onClick={handleAcceptAIReply}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Confirmation Dialog */}
      <AlertDialog open={showSendConfirmation} onOpenChange={setShowSendConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send this reply?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send this reply to {email.sender.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendReply}>Send</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function formatEmailBody(body: string): string {
  // Convert plain text to HTML with paragraphs and line breaks
  return body
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/^(.+)$/, "<p>$1</p>")
}
