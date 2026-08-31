import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideQueryClient, QueryClient } from '@ngneat/query';
import { Observable, of, Subject, throwError } from 'rxjs';
import { ProductApiService } from '../data-access/product-api.service';
import { Product } from '../models/product.model';
import { ProductDetail } from './product-detail';

describe('ProductDetail', () => {
  const product: Product = {
    id: 1,
    title: 'Test product',
    price: 29.99,
    description: 'A full description for the product details page.',
    category: 'electronics',
    image: 'https://example.com/product.jpg',
    rating: { rate: 4.5, count: 12 },
  };

  async function setup(response$: Observable<Product | null>): Promise<{
    fixture: ComponentFixture<ProductDetail>;
    getProduct: ReturnType<
      typeof vi.fn<(productId: number) => Observable<Product | null>>
    >;
  }> {
    const getProduct = vi.fn<(productId: number) => Observable<Product | null>>(
      () => response$,
    );

    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        provideRouter([]),
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
        {
          provide: ProductApiService,
          useValue: { getProduct },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: String(product.id) }),
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductDetail);
    fixture.detectChanges();

    return { fixture, getProduct };
  }

  it('should display a loading state while the request is pending', async () => {
    const pendingResponse$ = new Subject<Product | null>();
    const { fixture } = await setup(pendingResponse$);

    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Loading product details',
    );

    pendingResponse$.complete();
  });

  it('should render the complete product information', async () => {
    const { fixture, getProduct } = await setup(of(product));

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.product-detail')).not.toBeNull();
    });

    const element = fixture.nativeElement as HTMLElement;
    expect(getProduct).toHaveBeenCalledWith(product.id);
    expect(element.querySelector('h1')?.textContent).toContain(product.title);
    expect(element.textContent).toContain(product.description);
    expect(element.textContent).toContain(product.category);
    expect(element.textContent).toContain(String(product.rating.count));
  });

  it('should display a not-found state for a missing product', async () => {
    const { fixture } = await setup(of(null));

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Product not found');
    });
  });

  it('should display an error and allow the user to try again', async () => {
    const failedResponse$ = throwError(() => new Error('Network error'));
    const { fixture, getProduct } = await setup(failedResponse$);

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    });

    const callsBeforeRetry = getProduct.mock.calls.length;
    getProduct.mockReturnValue(of(product));
    const retryButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    retryButton.click();

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.product-detail')).not.toBeNull();
    });

    expect(getProduct.mock.calls.length).toBeGreaterThan(callsBeforeRetry);
  });
});
