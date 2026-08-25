export const CHART_HEIGHT = 160;
export const CHART_PADDING = 16;

const FALLBACK_SERIES = [0, 0];

/** Guards a chart's numeric series against empty/undefined data with a flat 2-point fallback. */
export function guardSeries(values: number[] | undefined): number[] {
  if (!values || values.length === 0) return FALLBACK_SERIES;
  if (values.length === 1) return [values[0], values[0]];
  return values;
}

/** Simple trailing moving average — each point is the mean of itself and the `window - 1` points before it. */
export function movingAverage(values: number[], window: number): number[] {
  return values.map((_, index) => {
    const start = Math.max(0, index - window + 1);
    const slice = values.slice(start, index + 1);
    return slice.reduce((sum, value) => sum + value, 0) / slice.length;
  });
}
