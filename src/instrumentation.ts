export async function register() {
  if (process.env.NODE_ENV === "production") {
    const script = await import("./utils/server-preload")

    await script.init()
  }
}
