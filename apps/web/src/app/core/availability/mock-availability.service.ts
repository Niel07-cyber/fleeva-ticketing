import { Injectable, inject } from '@angular/core';
import { computeSeats } from '../venue/seat-geometry';
import { VenueBlock, VenueLayout } from '../venue/venue-layout.model';
import { VenueService } from '../venue/venue.service';
import { firstValueFrom } from 'rxjs';
import { AvailabilityPort, BlockSummary, SeatState } from './availability.port';

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/** Deterministic 0..1 value from a string, so the mock is stable across reloads. */
export function unitHash(text: string): number {
  return hash(text) / 0xffffffff;
}

export function mockSeatStates(
  fixtureId: string,
  layout: VenueLayout,
  block: VenueBlock,
): Map<string, SeatState> {
  // Each block has its own popularity: 15% to 95% sold.
  const popularity = 0.15 + unitHash(`${fixtureId}:${block.blockId}`) * 0.8;
  const states = new Map<string, SeatState>();

  for (const seat of computeSeats(layout.bowl, block)) {
    const r = unitHash(`${fixtureId}:${seat.id}`);
    states.set(seat.id, r < popularity ? 'SOLD' : r < popularity + 0.03 ? 'HELD' : 'FREE');
  }
  return states;
}

@Injectable({ providedIn: 'root' })
export class MockAvailabilityService implements AvailabilityPort {
  private readonly venue = inject(VenueService);

  async getBlockSummaries(fixtureId: string): Promise<Record<string, BlockSummary>> {
    const layout = await firstValueFrom(this.venue.load());
    const summaries: Record<string, BlockSummary> = {};

    for (const block of layout.blocks) {
      let sold = 0;
      let held = 0;
      const states = mockSeatStates(fixtureId, layout, block);
      for (const state of states.values()) {
        if (state === 'SOLD') sold++;
        else if (state === 'HELD') held++;
      }
      summaries[block.blockId] = {
        total: states.size,
        sold,
        held,
        available: states.size - sold - held,
      };
    }
    return summaries;
  }

  async getSeatStates(fixtureId: string, blockId: string): Promise<Map<string, SeatState>> {
    const layout = await firstValueFrom(this.venue.load());
    const block = layout.blocks.find((b) => b.blockId === blockId);
    if (!block) throw new Error(`Unknown block ${blockId}`);
    return mockSeatStates(fixtureId, layout, block);
  }
}
