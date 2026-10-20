import { InjectionToken } from '@angular/core';

export type SeatState = 'FREE' | 'HELD' | 'SOLD';

export interface BlockSummary {
  total: number;
  sold: number;
  held: number;
  available: number;
}

/**
 * Port for seat availability. The mock implements it today; the HTTP
 * implementation arrives with the backend. Level 1 summaries are advisory
 * (cacheable); seat states are the live inventory view.
 */
export interface AvailabilityPort {
  getBlockSummaries(fixtureId: string): Promise<Record<string, BlockSummary>>;
  getSeatStates(fixtureId: string, blockId: string): Promise<Map<string, SeatState>>;
}

export const AVAILABILITY = new InjectionToken<AvailabilityPort>('AVAILABILITY');
