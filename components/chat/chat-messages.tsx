import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { deleteMessage } from "@/db/messages"
import { Tables } from "@/supabase/types"
import { FC, useContext, useState } from "react"
import { toast } from "sonner"
import { Message } from "../messages/message"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../ui/alert-dialog"

interface ChatMessagesProps {}

export const ChatMessages: FC<ChatMessagesProps> = ({}) => {
  const { chatMessages, chatFileItems, setChatMessages } =
    useContext(ChatbotUIContext)

  const { handleSendEdit } = useChatHandler()

  const [editingMessage, setEditingMessage] = useState<Tables<"messages">>()
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null
  )
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  /**
   * Handles the deletion of a chat message
   * @param messageId - The ID of the message to delete
   */
  const handleDeleteMessage = (messageId: string) => {
    setDeletingMessageId(messageId)
    setShowDeleteDialog(true)
  }

  /**
   * Confirms and executes the message deletion
   */
  const confirmDeleteMessage = async () => {
    if (!deletingMessageId) return

    try {
      // Delete the message from the database
      await deleteMessage(deletingMessageId)

      // Update the local state by filtering out the deleted message
      setChatMessages(prevMessages =>
        prevMessages.filter(msg => msg.message.id !== deletingMessageId)
      )

      toast.success("Message deleted successfully")
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Failed to delete message. Please try again.")
    } finally {
      setShowDeleteDialog(false)
      setDeletingMessageId(null)
    }
  }

  /**
   * Cancels the message deletion
   */
  const cancelDeleteMessage = () => {
    setShowDeleteDialog(false)
    setDeletingMessageId(null)
  }

  return (
    <>
      {chatMessages
        .sort((a, b) => a.message.sequence_number - b.message.sequence_number)
        .map((chatMessage, index, array) => {
          const messageFileItems = chatFileItems.filter(
            (chatFileItem, _, self) =>
              chatMessage.fileItems.includes(chatFileItem.id) &&
              self.findIndex(item => item.id === chatFileItem.id) === _
          )

          return (
            <Message
              key={chatMessage.message.sequence_number}
              message={chatMessage.message}
              fileItems={messageFileItems}
              isEditing={editingMessage?.id === chatMessage.message.id}
              isLast={index === array.length - 1}
              onStartEdit={setEditingMessage}
              onCancelEdit={() => setEditingMessage(undefined)}
              onSubmitEdit={handleSendEdit}
              onDelete={handleDeleteMessage}
            />
          )
        })}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteMessage}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMessage}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
