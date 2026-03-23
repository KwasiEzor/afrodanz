export function isPrismaMissingTableError(error: unknown, tableName?: string) {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    error.code !== "P2021"
  ) {
    return false;
  }

  if (!tableName) {
    return true;
  }

  const meta = "meta" in error ? error.meta : undefined;
  const resolvedTable =
    typeof meta === "object" &&
    meta !== null &&
    "table" in meta &&
    typeof meta.table === "string"
      ? meta.table
      : "";

  return resolvedTable.endsWith(tableName);
}
