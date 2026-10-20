import { Component, computed, input, output } from '@angular/core';
import { BlockSummary } from '../../core/availability/availability.port';
import { heatColour } from '../../core/venue/heat-colour';
import { VenueBlock, VenueLayout } from '../../core/venue/venue-layout.model';

interface BlockView {
  block: VenueBlock;
  fill: string;
  label: string;
}

/** Level 1: the whole stadium, blocks coloured by availability. */
@Component({
  selector: 'app-stadium-map',
  templateUrl: './stadium-map.html',
  styleUrl: './stadium-map.scss',
})
export class StadiumMap {
  readonly layout = input.required<VenueLayout>();
  readonly summaries = input.required<Record<string, BlockSummary>>();
  readonly blockSelected = output<string>();

  protected readonly viewBox = computed(() => this.layout().viewBox.join(' '));

  protected readonly blocks = computed<BlockView[]>(() =>
    this.layout().blocks.map((block) => {
      const s = this.summaries()[block.blockId];
      const category = this.layout().categories[block.category];
      const available = s?.available ?? 0;
      return {
        block,
        fill: heatColour(available, s?.total ?? 0),
        label: `Block ${block.blockId}, ${category.label}, ${available} seats available`,
      };
    }),
  );
}
