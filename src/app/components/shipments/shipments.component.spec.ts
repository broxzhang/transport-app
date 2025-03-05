import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShipmentsComponent } from './shipments.component';
import { ShipmentsService } from '../../services/shipments.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ShipmentsComponent', () => {
  let component: ShipmentsComponent;
  let fixture: ComponentFixture<ShipmentsComponent>;
  let shipmentsServiceStub: Partial<ShipmentsService>;
  let authServiceStub: Partial<AuthService>;

  beforeEach(async () => {
    shipmentsServiceStub = {
      getShipments: jasmine.createSpy('getShipments').and.returnValue(of([{
        id: '123',
        pickup_date: '2025-03-13T10:00:00',
        pickup_location: 'Toronto, ON',
        delivery_date: '2025-03-21T15:00:00',
        delivery_location: 'Quebec, QC',
        distance: 300,
        price: 405,
        status: 'Delivered'
      }])),
      updateShipmentStatus: jasmine.createSpy('updateShipmentStatus').and.returnValue(of({}))
    };

    authServiceStub = {
      isAuthenticated$: of(true)
    };

    await TestBed.configureTestingModule({
      declarations: [ShipmentsComponent],
      imports: [
        MatTableModule,
        MatSelectModule,
        MatFormFieldModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ShipmentsService, useValue: shipmentsServiceStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load shipments on init', () => {
    expect(component.shipments.length).toBe(1);
    expect(component.shipments[0].id).toBe('123');
  });

  it('should call updateShipmentStatus when status is changed', () => {
    component.onStatusChange(component.shipments[0], 'Pending');
    expect(shipmentsServiceStub.updateShipmentStatus).toHaveBeenCalledWith('123', 'Pending');
  });
});
