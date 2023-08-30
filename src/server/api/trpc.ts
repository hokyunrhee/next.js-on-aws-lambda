import { TRPCError, initTRPC } from "@trpc/server"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { Session } from "next-auth/core/types"
import { getServerSession } from "next-auth/next"
import superjson from "superjson"
import { ZodError } from "zod"

import { authOptions } from "@/server/auth"

interface CreateContextOptions {
  session: Session | null
}

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
  }
}

export const createTRPCContext = async (opts?: FetchCreateContextFnOptions) => {
  const session = opts?.req ? await getServerSession(authOptions) : null

  return createInnerTRPCContext({ session })
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

const enforceUserIsAuthed = t.middleware(async (opts) => {
  const session = opts.ctx.session || (await getServerSession(authOptions))

  if (!session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return opts.next({
    ctx: {
      session,
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
