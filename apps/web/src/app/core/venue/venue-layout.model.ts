export interface Bowl {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface BlockGeometry {
  /** Angular span in degrees (0 = east, clockwise). */
  a0: number;
  a1: number;
  /** Radial band as scale factors on the bowl ellipse. */
  s0: number;
  s1: number;
}

export interface VenueRow {
  row: string;
  seats: number;
}

export interface VenueBlock {
  blockId: string;
  standId: string;
  tier: 'lower' | 'upper';
  category: string;
  polygon: string;
  labelAnchor: [number, number];
  geometry: BlockGeometry;
  rowCount: number;
  rows: VenueRow[];
}

export interface VenueCategory {
  label: string;
  colour: string;
  priceCents: number;
}

export interface VenueLayout {
  venueId: string;
  version: number;
  capacity: number;
  viewBox: [number, number, number, number];
  bowl: Bowl;
  pitch: { x: number; y: number; w: number; h: number };
  stands: { standId: string; name: string; blocks: string[] }[];
  blocks: VenueBlock[];
  categories: Record<string, VenueCategory>;
}
