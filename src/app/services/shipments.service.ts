import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Shipment {
  id: number;
  pickupDate: string;
  pickupLocation: string;
  delivery_date: string;
  deliveryLocation: string;
  distance: number;
  price: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShipmentsService {

  private apiUrl = 'https://pt.gda.one/api/tests/v1/shipments';

  constructor(
    private http: HttpClient
  ) { }

  getShipments(isAuthenticated: boolean): Observable<Shipment[]> {
    const url =
      isAuthenticated ? `${this.apiUrl}/list` : `${this.apiUrl}/share/list`;
      return this.http.get<{ items: Shipment[] }>(url).pipe(
        map(response => response.items),
        catchError(this.handleError)
      );
  }

  updateShipmentStatus(shipmentId: number, status: string): Observable<any> {
    const url =
      `${this.apiUrl}/status`;
    const payload = {
      id: shipmentId,
      status
    };

    return this.http.post(url, payload).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.log('ShipmentsService error', error);
    return throwError(error);
  }
}
