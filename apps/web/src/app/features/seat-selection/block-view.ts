import { Component, computed, input, output } from '@angular/core';
import { SeatState } from '../../core/availability/availability.port';
import { SeatPosition, boundsOf, computeSeats } from '../../core/venue/seat-geometry';
import { VenueBlock, VenueLayout } from '../../core/venue/venue-layout.model';

const ROW_LABEL_EVERY = 5;

/** Level 2: the seats of a single block. */
@Component({
  selector: 'app-block-view',
  templateUrl: './block-view.html',
  styleUrl: './block-view.scss',
})
export class BlockView {
  readonly layout = input.required<VenueLayout>();
  readonly block = input.required<VenueBlock>();
  readonly states = input.required<Map<string, SeatState>>();
  readonly selectedIds = input.required<ReadonlySet<string>>();
  readonly seatToggled = output<SeatPosition>();
  readonly back = output<void>();

  protected readonly seats = computed(() => computeSeats(this.layout().bowl, this.block()));
  protected readonly viewBox = computed(() => boundsOf(this.seats(), 8).join(' '));

  protected readonly rowLabels = computed(() =>
    this.seats()
      .filter((s) => s.number === 1 && (Number(s.row) === 1 || Number(s.row) % ROW_LABEL_EVERY === 0))
      .map((s) => ({ row: s.row, x: s.x, y: s.y })),
  );

  protected readonly category = computed(() => this.layout().categories[this.block().category]);

  protected stateOf(seat: SeatPosition): SeatState {
    return this.states().get(seat.id) ?? 'SOLD';
  }

  protected isSelected(seat: SeatPosition): boolean {
    return this.selectedIds().has(seat.id);
  }

  protected toggle(seat: SeatPosition): void {
    if (this.stateOf(seat) === 'FREE' || this.isSelected(seat)) {
      this.seatToggled.emit(seat);
    }
  }

  protected label(seat: SeatPosition): string {
    return `Row ${seat.row}, seat ${seat.number} (${this.stateOf(seat).toLowerCase()})`;
  }
}
