export async function register() {
  if (process.env.DEVELOPMENT_ENV === "prod") {
    const script = await import("./utils/server-preload")

    await script.init()
  }
}
