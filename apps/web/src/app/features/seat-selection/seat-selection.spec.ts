import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AVAILABILITY } from '../../core/availability/availability.port';
import { VenueLayout } from '../../core/venue/venue-layout.model';
import { SeatSelection, MAX_SEATS } from './seat-selection';

const layout: VenueLayout = {
  venueId: 'v',
  version: 1,
  capacity: 10,
  viewBox: [0, 0, 100, 100],
  bowl: { cx: 50, cy: 50, rx: 20, ry: 20 },
  pitch: { x: 0, y: 0, w: 1, h: 1 },
  stands: [],
  blocks: [],
  categories: {},
};

function seat(n: number) {
  return { id: `A-1-${n}`, blockId: 'A', row: '1', number: n, x: 0, y: 0 };
}

describe('SeatSelection', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AVAILABILITY,
          useValue: { getBlockSummaries: async () => ({}), getSeatStates: async () => new Map() },
        },
      ],
    });
  });

  function create() {
    const fixture = TestBed.createComponent(SeatSelection);
    TestBed.inject(HttpTestingController).expectOne('/venues/fleeva-arena/v1/layout.json').flush(layout);
    return fixture.componentInstance as unknown as {
      selection: () => unknown[];
      notice: () => string | null;
      toggleSeat: (s: ReturnType<typeof seat>) => void;
    };
  }

  it('adds and removes a seat on toggle', () => {
    const page = create();

    page.toggleSeat(seat(1));
    expect(page.selection()).toHaveLength(1);

    page.toggleSeat(seat(1));
    expect(page.selection()).toHaveLength(0);
  });

  it(`refuses a ${MAX_SEATS + 1}th seat and tells the user`, () => {
    const page = create();

    for (let n = 1; n <= MAX_SEATS + 1; n++) page.toggleSeat(seat(n));

    expect(page.selection()).toHaveLength(MAX_SEATS);
    expect(page.notice()).toContain(String(MAX_SEATS));
  });
});
