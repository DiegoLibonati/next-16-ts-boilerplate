export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { warnIfDbUnreachable } = await import("@/server/startup/db_check.startup");
  await warnIfDbUnreachable();
}
