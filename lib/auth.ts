"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export const useAuth = () => {
  const supabase = createClient()
  const router = useRouter()

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return {
    signOut,
  }
}
