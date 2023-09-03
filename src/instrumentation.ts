export async function register() {
  if (process.env.DEVELOPMENT_ENV === "PROD") {
    const script = await import("./utils/server-preload")

    await script.init()
  }
}
