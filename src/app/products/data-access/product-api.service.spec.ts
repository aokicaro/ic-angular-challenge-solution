import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductApiService } from './product-api.service';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch products from the Fake Store API', async () => {
    const products: Product[] = [
      {
        id: 1,
        title: 'Test product',
        price: 29.99,
        description: 'A product used by the service test.',
        category: 'electronics',
        image: 'https://example.com/product.jpg',
        rating: { rate: 4.5, count: 12 },
      },
    ];

    const responsePromise = firstValueFrom(service.getProducts());
    const request = httpTesting.expectOne('https://fakestoreapi.com/products');

    expect(request.request.method).toBe('GET');
    request.flush(products);

    await expect(responsePromise).resolves.toEqual(products);
  });
});
