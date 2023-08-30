"use client"

import { MultiProvider } from "@/utils/multi-provider"
import { NextAuthProvider } from "@/utils/next-auth-provider"
import { TRPCProvider } from "@/utils/trpc-provider"

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <MultiProvider providers={[NextAuthProvider, TRPCProvider]}>{children}</MultiProvider>
}
