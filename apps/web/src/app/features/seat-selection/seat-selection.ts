import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AVAILABILITY } from '../../core/availability/availability.port';
import { SeatPosition } from '../../core/venue/seat-geometry';
import { VenueService } from '../../core/venue/venue.service';
import { Basket, BasketLine } from './basket';
import { BlockView } from './block-view';
import { StadiumMap } from './stadium-map';

export const MAX_SEATS = 6;
const MOCK_FIXTURE_ID = 'fleeva-vs-demo';

@Component({
  selector: 'app-seat-selection',
  imports: [StadiumMap, BlockView, Basket],
  templateUrl: './seat-selection.html',
  styleUrl: './seat-selection.scss',
})
export class SeatSelection {
  private readonly availability = inject(AVAILABILITY);
  protected readonly maxSeats = MAX_SEATS;

  protected readonly layout = toSignal(inject(VenueService).load());
  private readonly router = inject(Router);

  /** Bound from the `?block=` query param, so the browser back button leaves a block. */
  readonly block = input<string>();
  protected readonly selectedBlockId = computed(() => this.block() ?? null);
  protected readonly selection = signal<SeatPosition[]>([]);
  protected readonly notice = signal<string | null>(null);

  protected readonly summaries = resource({
    loader: () => this.availability.getBlockSummaries(MOCK_FIXTURE_ID),
  });

  protected readonly seatStates = resource({
    params: () => this.selectedBlockId() ?? undefined,
    loader: ({ params }) => this.availability.getSeatStates(MOCK_FIXTURE_ID, params),
  });

  protected readonly selectedBlock = computed(() =>
    this.layout()?.blocks.find((b) => b.blockId === this.selectedBlockId()),
  );

  protected readonly selectedIds = computed(() => new Set(this.selection().map((s) => s.id)));

  protected readonly basketLines = computed<BasketLine[]>(() => {
    const layout = this.layout();
    if (!layout) return [];
    return this.selection().map((seat) => {
      const block = layout.blocks.find((b) => b.blockId === seat.blockId)!;
      return { seat, priceCents: layout.categories[block.category].priceCents };
    });
  });

  protected selectBlock(blockId: string | null): void {
    void this.router.navigate([], {
      queryParams: { block: blockId },
      queryParamsHandling: 'merge',
    });
  }

  protected toggleSeat(seat: SeatPosition): void {
    this.notice.set(null);
    if (this.selectedIds().has(seat.id)) {
      this.removeSeat(seat);
    } else if (this.selection().length >= MAX_SEATS) {
      this.notice.set(`You can select up to ${MAX_SEATS} seats.`);
    } else {
      this.selection.update((s) => [...s, seat]);
    }
  }

  protected removeSeat(seat: SeatPosition): void {
    this.selection.update((s) => s.filter((x) => x.id !== seat.id));
  }
}
