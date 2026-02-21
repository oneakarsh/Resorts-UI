/**
 * Format number as Indian Rupees (e.g. 35000 → "₹35,000").
 */
export function formatRupee(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}
