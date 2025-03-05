import { TestBed } from '@angular/core/testing';
import { ShipmentsService } from './shipments.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ShipmentsService', () => {
  let service: ShipmentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShipmentsService]
    });
    service = TestBed.inject(ShipmentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform shipments response correctly', () => {
    const dummyResponse = {
      items: [{
        id: '123',
        pickup_date: '2025-03-13T10:00:00',
        pickup_location: 'Toronto, ON',
        delivery_date: '2025-03-21T15:00:00',
        delivery_location: 'Quebec, QC',
        distance: 300,
        price: 405,
        status: 'Delivered'
      }]
    };

    service.getShipments(true).subscribe(shipments => {
      expect(shipments.length).toBe(1);
      expect(shipments[0].id).toBe('123');
    });

    const req = httpMock.expectOne('https://pt.gda.one/api/tests/v1/shipments/list');
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should update shipment status with uuid as query param', () => {
    service.updateShipmentStatus('123', 'Pending').subscribe(response => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(req =>
      req.url === 'https://pt.gda.one/api/tests/v1/shipments/status' &&
      req.params.get('uuid') === '123'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ status: 'Pending' });
    req.flush({});
  });
});
