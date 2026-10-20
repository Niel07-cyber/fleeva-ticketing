import { boundsOf, computeSeats, seatId } from './seat-geometry';
import { VenueBlock } from './venue-layout.model';

const bowl = { cx: 600, cy: 450, rx: 280, ry: 210 };

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
    { row: '1', seats: 5 },
    { row: '2', seats: 8 },
  ],
};

describe('computeSeats', () => {
  it('creates one seat per seat count with row-scoped numbering', () => {
    const seats = computeSeats(bowl, block);

    expect(seats).toHaveLength(13);
    expect(seats[0].id).toBe(seatId('N1', '1', 1));
    expect(seats[5].id).toBe(seatId('N1', '2', 1));
  });

  it('places the back row further from the centre than the front row', () => {
    const seats = computeSeats(bowl, block);
    const distance = (i: number) => Math.hypot(seats[i].x - bowl.cx, seats[i].y - bowl.cy);

    expect(distance(5)).toBeGreaterThan(distance(0));
  });

  it('computes bounds that contain every seat', () => {
    const seats = computeSeats(bowl, block);
    const [x, y, w, h] = boundsOf(seats, 4);

    for (const s of seats) {
      expect(s.x).toBeGreaterThanOrEqual(x);
      expect(s.x).toBeLessThanOrEqual(x + w);
      expect(s.y).toBeGreaterThanOrEqual(y);
      expect(s.y).toBeLessThanOrEqual(y + h);
    }
  });
});
