import { appRouter } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"

export const tRPCCaller = appRouter.createCaller(await createTRPCContext())
