export default function toErrorMessage(err: unknown, fallback = "An unexpected error occurred."): string {
  return err instanceof Error ? err.message : fallback;
}