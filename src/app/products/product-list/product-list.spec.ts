import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideQueryClient, QueryClient } from '@ngneat/query';
import { Observable, of, Subject, throwError } from 'rxjs';
import { ProductApiService } from '../data-access/product-api.service';
import { Product } from '../models/product.model';
import { ProductList } from './product-list';

describe('ProductList', () => {
  const products: Product[] = [
    {
      id: 1,
      title: 'Test product',
      price: 29.99,
      description: 'A product returned by the mocked API.',
      category: 'electronics',
      image: 'https://example.com/product.jpg',
      rating: { rate: 4.5, count: 12 },
    },
  ];

  async function setup(response$: Observable<Product[]>): Promise<{
    fixture: ComponentFixture<ProductList>;
    getProducts: ReturnType<typeof vi.fn<() => Observable<Product[]>>>;
  }> {
    const getProducts = vi.fn<() => Observable<Product[]>>(() => response$);

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        {
          provide: ProductApiService,
          useValue: { getProducts },
        },
        provideQueryClient(
          () =>
            new QueryClient({
              defaultOptions: {
                queries: {
                  gcTime: 0,
                  retryDelay: 0,
                },
              },
            }),
        ),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductList);
    fixture.detectChanges();

    return { fixture, getProducts };
  }

  it('should display a loading state while the request is pending', async () => {
    const pendingResponse$ = new Subject<Product[]>();
    const { fixture } = await setup(pendingResponse$);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'Loading products',
    );

    pendingResponse$.complete();
  });

  it('should render products returned by the service', async () => {
    const { fixture, getProducts } = await setup(of(products));

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('app-product-card')).toHaveLength(1);
    });

    expect(getProducts).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(products[0].title);
  });

  it('should display an empty state when the API returns no products', async () => {
    const { fixture } = await setup(of([]));

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('No products found');
    });
  });

  it('should display an error and allow the user to try again', async () => {
    const failedResponse$ = throwError(() => new Error('Network error'));
    const { fixture, getProducts } = await setup(failedResponse$);

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    });

    const callsBeforeRetry = getProducts.mock.calls.length;
    getProducts.mockReturnValue(of(products));
    const retryButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    retryButton.click();

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('app-product-card')).toHaveLength(1);
    });

    expect(getProducts.mock.calls.length).toBeGreaterThan(callsBeforeRetry);
  });
});
