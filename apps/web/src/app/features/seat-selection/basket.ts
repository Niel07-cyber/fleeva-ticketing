import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { SeatPosition } from '../../core/venue/seat-geometry';

export interface BasketLine {
  seat: SeatPosition;
  priceCents: number;
}

@Component({
  selector: 'app-basket',
  imports: [CurrencyPipe],
  templateUrl: './basket.html',
  styleUrl: './basket.scss',
})
export class Basket {
  readonly lines = input.required<BasketLine[]>();
  readonly maxSeats = input.required<number>();
  readonly removed = output<SeatPosition>();

  protected readonly totalCents = computed(() =>
    this.lines().reduce((sum, l) => sum + l.priceCents, 0),
  );
}
