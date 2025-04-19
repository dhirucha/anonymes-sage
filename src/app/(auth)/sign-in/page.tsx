'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/SignUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"


const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedUsername = useDebounceValue(username, 300)
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
         setUsernameMessage(response.data.message)
        
        } catch (error) {
          const AxiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(
            AxiosError.response?.data.message ?? "Error checking username"
          )
        }finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
      
  }

  return (
    <div>page</div>
  )
}

export default page