export function formatDzd(value: number, language?: string) {
  const formatted = Number(value || 0).toLocaleString("fr-DZ");
  return language?.startsWith("ar") ? `${formatted} د.ج` : `${formatted} DA`;
}
