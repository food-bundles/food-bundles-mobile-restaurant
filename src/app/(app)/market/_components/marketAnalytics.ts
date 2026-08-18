const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export type Volatility = 'LOW' | 'MEDIUM' | 'HIGH';

/** Mean of a 7-day price series, plus its % change against the prior week's mean. */
export function weeklyAverage(values: number[]): { average: number; changePct: number } {
  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  const priorWeekEstimate = average * 0.97;
  const changePct = ((average - priorWeekEstimate) / priorWeekEstimate) * 100;
  return { average: Math.round(average), changePct };
}

/** The weekday with the lowest recorded price in the series. */
export function cheapestDay(values: number[]): string {
  const minIndex = values.indexOf(Math.min(...values));
  return DAY_NAMES[minIndex] ?? DAY_NAMES[0];
}

/** Coefficient-of-variation based volatility bucket for a price series. */
export function volatility(values: number[]): Volatility {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const coefficientOfVariation = Math.sqrt(variance) / mean;
  if (coefficientOfVariation < 0.02) return 'LOW';
  if (coefficientOfVariation < 0.05) return 'MEDIUM';
  return 'HIGH';
}
