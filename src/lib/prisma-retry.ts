type AsyncFunction<T> = () => Promise<T>;

// Neon free-tier databases auto-suspend after inactivity and can take roughly 1-5 seconds to wake
// on the next request. The current retry policy (2 retries with 300ms/700ms delays) is intentionally
// conservative: it gives a cold-started database enough time to come back without adding a noticeable
// delay to normal warm connections. If production becomes sensitive to this, a paid Neon plan or a
// scheduled keep-alive ping is the proper infrastructure fix rather than a code-level workaround.
export async function prismaRetry<T>(
  fn: AsyncFunction<T>,
  maxRetries = 2,
  delays = [300, 700]
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Only retry P1001 errors (can't reach database server)
      const isP1001 = 
        error instanceof Error && 
        (error.message.includes("P1001") || 
         error.message.includes("Can't reach database server"));
      
      if (!isP1001) {
        throw error;
      }
      
      // If we've exhausted retries, throw
      if (attempt >= maxRetries) {
        console.error("[Prisma Retry] Database temporarily unavailable after", maxRetries + 1, "attempts");
        throw error;
      }
      
      const delay = delays[attempt];
      console.warn(`[Prisma Retry] Retry ${attempt + 1}/${maxRetries} in ${delay}ms...`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.warn(`[Prisma Retry] Retry ${attempt + 1}/${maxRetries} executing...`);
    }
  }
  
  // This line should never be reached due to the loop
  throw lastError;
}
