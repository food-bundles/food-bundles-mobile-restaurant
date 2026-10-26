import { sleep } from './sleep';

const DELIVERED_DELAY_MS = 500;
const READ_DELAY_MS = 1400;
const TYPING_MIN_MS = 900;
const TYPING_MAX_MS = 2200;

export async function waitForDelivery(): Promise<void> {
  await sleep(DELIVERED_DELAY_MS);
}

export async function waitForRead(): Promise<void> {
  await sleep(READ_DELAY_MS);
}

export function typingDurationMs(): number {
  return TYPING_MIN_MS + Math.random() * (TYPING_MAX_MS - TYPING_MIN_MS);
}

export interface SimulatedReplyOptions {
  onTypingStart: () => void;
  onTypingEnd: () => void;
}

export async function simulateReply(replyBody: string, options: SimulatedReplyOptions): Promise<string> {
  options.onTypingStart();
  await sleep(typingDurationMs());
  options.onTypingEnd();
  return replyBody;
}
