import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideQueryClient, QueryClient } from '@ngneat/query';
import { Observable, of, throwError } from 'rxjs';
import { ProductApiService } from '../data-access/product-api.service';
import {
  CreatedProduct,
  CreateProductInput,
} from '../models/product.model';
import { ProductCreate } from './product-create';

describe('ProductCreate', () => {
  const productInput: CreateProductInput = {
    title: 'Test product',
    price: 29.99,
    category: 'electronics',
    image: 'https://example.com/product.jpg',
    description: 'A sufficiently detailed description for the new product.',
  };

  async function setup(response$: Observable<CreatedProduct>): Promise<{
    fixture: ComponentFixture<ProductCreate>;
    createProduct: ReturnType<
      typeof vi.fn<(product: CreateProductInput) => Observable<CreatedProduct>>
    >;
  }> {
    const createProduct = vi.fn<
      (product: CreateProductInput) => Observable<CreatedProduct>
    >(() => response$);

    await TestBed.configureTestingModule({
      imports: [ProductCreate],
      providers: [
        provideRouter([]),
        provideQueryClient(
          () =>
            new QueryClient({
              defaultOptions: {
                mutations: {
                  gcTime: 0,
                  retry: false,
                },
              },
            }),
        ),
        {
          provide: ProductApiService,
          useValue: { createProduct },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProductCreate);
    fixture.detectChanges();

    return { fixture, createProduct };
  }

  function setFieldValue(
    fixture: ComponentFixture<ProductCreate>,
    selector: string,
    value: string,
    eventName = 'input',
  ): void {
    const field = fixture.nativeElement.querySelector(selector) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;

    field.value = value;
    field.dispatchEvent(new Event(eventName, { bubbles: true }));
  }

  function fillValidForm(fixture: ComponentFixture<ProductCreate>): void {
    setFieldValue(fixture, '#title', productInput.title);
    setFieldValue(fixture, '#price', String(productInput.price));
    setFieldValue(fixture, '#category', productInput.category, 'change');
    setFieldValue(fixture, '#image', productInput.image);
    setFieldValue(fixture, '#description', productInput.description);
    fixture.detectChanges();
  }

  function submitForm(fixture: ComponentFixture<ProductCreate>): void {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  it('should show validation errors and not submit an invalid form', async () => {
    const { fixture, createProduct } = await setup(of({ ...productInput, id: 21 }));

    submitForm(fixture);

    expect(createProduct).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('.field-error')).toHaveLength(5);
  });

  it('should submit a valid product and display the simulated result', async () => {
    const createdProduct: CreatedProduct = { ...productInput, id: 21 };
    const { fixture, createProduct } = await setup(of(createdProduct));

    fillValidForm(fixture);
    submitForm(fixture);

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
    });

    expect(createProduct).toHaveBeenCalledWith(productInput);
    expect(fixture.nativeElement.textContent).toContain(String(createdProduct.id));
  });

  it('should display an error when product creation fails', async () => {
    const failedResponse$ = throwError(() => new Error('Network error'));
    const { fixture, createProduct } = await setup(failedResponse$);

    fillValidForm(fixture);
    submitForm(fixture);

    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    });

    expect(createProduct).toHaveBeenCalledWith(productInput);
  });
});
