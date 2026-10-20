import { VenueBlock, VenueLayout } from '../venue/venue-layout.model';
import { mockSeatStates } from './mock-availability.service';

const block: VenueBlock = {
  blockId: 'N1',
  standId: 'N',
  tier: 'lower',
  category: 'CAT2',
  polygon: '',
  labelAnchor: [0, 0],
  geometry: { a0: 250, a1: 290, s0: 1, s1: 1.4 },
  rowCount: 2,
  rows: [
    { row: '1', seats: 20 },
    { row: '2', seats: 30 },
  ],
};
const layout = { bowl: { cx: 600, cy: 450, rx: 280, ry: 210 } } as VenueLayout;

describe('mockSeatStates', () => {
  it('is deterministic for the same fixture', () => {
    expect(mockSeatStates('f1', layout, block)).toEqual(mockSeatStates('f1', layout, block));
  });

  it('covers every seat of the block', () => {
    expect(mockSeatStates('f1', layout, block).size).toBe(50);
  });
});
