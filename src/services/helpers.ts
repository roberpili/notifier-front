function readErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    for (const key of ["message", "error"]) {
      const value = record[key];
      if (typeof value === "string" && value) return value;
    }
  }

  return fallback;
}

export async function parseError(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();

    return readErrorMessage(
      data,
      JSON.stringify(data) || `HTTP Error: ${response.status}`,
    );
  } catch {
    return (await response.text()) || `HTTP Error: ${response.status}`;
  }
}
