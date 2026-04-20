import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

export function runInBackground(task: Promise<unknown>, label: string) {
  const wrappedTask = task.catch((error) => {
    console.error(`${label} failed:`, error);
  });

  try {
    const requestContext = getOptionalRequestContext();

    if (requestContext?.ctx) {
      requestContext.ctx.waitUntil(wrappedTask);
      return;
    }
  } catch {
    // Ignore missing request context and fall back to a detached promise.
  }

  void wrappedTask;
}
