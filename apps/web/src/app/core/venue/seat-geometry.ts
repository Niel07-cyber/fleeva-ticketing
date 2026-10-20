import { Bowl, VenueBlock } from './venue-layout.model';

export interface SeatPosition {
  id: string;
  blockId: string;
  row: string;
  number: number;
  x: number;
  y: number;
}

export type Bounds = [x: number, y: number, w: number, h: number];

export function polarPoint(bowl: Bowl, angleDeg: number, scale: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [bowl.cx + bowl.rx * scale * Math.cos(a), bowl.cy + bowl.ry * scale * Math.sin(a)];
}

export function seatId(blockId: string, row: string, number: number): string {
  return `${blockId}-${row}-${number}`;
}

/** Seat coordinates are derived from block geometry rather than stored per seat. */
export function computeSeats(bowl: Bowl, block: VenueBlock): SeatPosition[] {
  const { a0, a1, s0, s1 } = block.geometry;
  const seats: SeatPosition[] = [];

  block.rows.forEach((row, rowIndex) => {
    const scale = s0 + ((rowIndex + 0.5) / block.rowCount) * (s1 - s0);
    for (let n = 0; n < row.seats; n++) {
      const angle = a0 + ((n + 0.5) / row.seats) * (a1 - a0);
      const [x, y] = polarPoint(bowl, angle, scale);
      seats.push({
        id: seatId(block.blockId, row.row, n + 1),
        blockId: block.blockId,
        row: row.row,
        number: n + 1,
        x,
        y,
      });
    }
  });

  return seats;
}

export function boundsOf(seats: SeatPosition[], padding: number): Bounds {
  const xs = seats.map((s) => s.x);
  const ys = seats.map((s) => s.y);
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  return [minX, minY, Math.max(...xs) + padding - minX, Math.max(...ys) + padding - minY];
}
