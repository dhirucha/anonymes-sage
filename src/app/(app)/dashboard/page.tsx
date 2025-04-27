"use client"

import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Message = {
  _id: string
  text: string
}

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading]= useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard
