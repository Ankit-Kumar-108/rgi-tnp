import { getCloudflareContext } from "@opennextjs/cloudflare";

export function runInBackground(task: Promise<unknown>, label: string) {
  const wrappedTask = task.catch((error) => {
    console.error(`${label} failed:`, error);
  });

  try {
    const { ctx } = getCloudflareContext();

    if (ctx) {
      ctx.waitUntil(wrappedTask);
      return;
    }
  } catch {
    // Ignore missing request context and fall back to a detached promise.
  }

  void wrappedTask;
}
