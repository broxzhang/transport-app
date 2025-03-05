import { AuthService } from 'src/app/services/auth.service';
import { ShipmentsService } from './../../services/shipments.service';
import { Component, OnInit } from '@angular/core';
import { Shipment } from 'src/app/services/shipments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private authService: AuthService,
    private snackBar: MatSnackBar
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

  // fix #2 add refresh button to get the shipments
  onRefresh(): void {
    this.getShipments();
  }

  // use select dropdown to change the shipment status
  onStatusChange(shipment: Shipment, newStatus: string): void {
    if (!this.isAuth) {
      return;
    }
    this.shipmentsService.updateShipmentStatus(shipment.id, newStatus).subscribe({
      next: () => {
        shipment.status = newStatus;

        // show a snackbar message
        this.snackBar.open(`Shipment ${shipment.id} status updated to ${newStatus}`, 'Close', {
          duration: 2000
        });
      },
      error: (error) => {
        console.error('Error updating shipment status', error);
        // show a snackbar message
        this.snackBar.open(`Error updating shipment ${shipment.id} status`, 'Close', {
          duration: 2000
        });
      }
    });
  }


  // update the shipment status
  // updateShipmentStatus(shipmentId: number, newStatus: string): void {
  //   this.shipmentsService.updateShipmentStatus(shipmentId, newStatus).subscribe({
  //     next: () => {
  //       // update the shipment status in the shipments array
  //       const shipment = this.shipments.find((s) => s.id === shipmentId);
  //       if (shipment) {
  //         shipment.status = newStatus;
  //       }
  //     },
  //     error: (error) => {
  //       console.error('ShipmentsComponent error', error);
  //     }
  //   });
  // }

}
