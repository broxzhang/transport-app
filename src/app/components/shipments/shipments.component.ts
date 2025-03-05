import { AuthService } from 'src/app/services/auth.service';
import { ShipmentsService } from './../../services/shipments.service';
import { Component, OnInit } from '@angular/core';
import { Shipment } from 'src/app/services/shipments.service';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.sass']
})
export class ShipmentsComponent implements OnInit {

  shipments: Shipment[] = [];

  isAuth: boolean = false;
  // dynamic columns display
  displayedColumns: string[] = [];

  constructor(
    private shipmentsService: ShipmentsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // subscribe to the auth service to get the authentication status
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuth = isAuthenticated;
      // set the displayed columns based on the authentication status
      this.displayedColumns = this.isAuth ?
      ['pickup_date', 'pickup_location', 'delivery_date', 'delivery_location', 'distance', 'price', 'status'] :
      ['pickup_date', 'pickup_location', 'delivery_date', 'delivery_location', 'distance', 'status'];

      // get the shipments
      this.getShipments();
    });
  }

  getShipments(): void {
    this.shipmentsService.getShipments(this.isAuth).subscribe({
      next: (shipments) => {
        console.log(shipments);
        this.shipments = shipments;
      },
      error: (error) => {
        console.error('ShipmentsComponent error', error);
      }
    });
  }

  // update the shipment status
  updateShipmentStatus(shipmentId: number, newStatus: string): void {
    this.shipmentsService.updateShipmentStatus(shipmentId, newStatus).subscribe({
      next: () => {
        // update the shipment status in the shipments array
        const shipment = this.shipments.find((s) => s.id === shipmentId);
        if (shipment) {
          shipment.status = newStatus;
        }
      },
      error: (error) => {
        console.error('ShipmentsComponent error', error);
      }
    });
  }

}
