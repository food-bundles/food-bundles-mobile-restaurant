export const CHART_HEIGHT = 160;
export const CHART_PADDING = 16;

/** Simple trailing moving average — each point is the mean of itself and the `window - 1` points before it. */
export function movingAverage(values: number[], window: number): number[] {
  return values.map((_, index) => {
    const start = Math.max(0, index - window + 1);
    const slice = values.slice(start, index + 1);
    return slice.reduce((sum, value) => sum + value, 0) / slice.length;
  });
}
