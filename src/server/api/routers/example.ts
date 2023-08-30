import { z } from "zod"

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const exampleRouter = createTRPCRouter({
  hello: protectedProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    return {
      greeting: `Hello ${input.text}`,
    }
  }),
})
