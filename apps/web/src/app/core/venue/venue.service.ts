import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { VenueLayout } from './venue-layout.model';

@Injectable({ providedIn: 'root' })
export class VenueService {
  private readonly http = inject(HttpClient);

  /** Layout is versioned and immutable, so the path can be cached for a year. */
  load(venueId = 'fleeva-arena', version = 1): Observable<VenueLayout> {
    return this.http.get<VenueLayout>(`/venues/${venueId}/v${version}/layout.json`);
  }
}
