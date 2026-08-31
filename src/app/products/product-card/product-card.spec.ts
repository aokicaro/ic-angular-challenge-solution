import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductCard } from './product-card';

describe('ProductCard', () => {
  let fixture: ComponentFixture<ProductCard>;

  const product: Product = {
    id: 1,
    title: 'Test product',
    price: 29.99,
    description: 'A complete description for the product card.',
    category: 'electronics',
    image: 'https://example.com/product.jpg',
    rating: { rate: 4.5, count: 12 },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();
  });

  it('should render the product information', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.product-card__title')?.textContent).toContain(
      product.title,
    );
    expect(element.querySelector('.product-card__category')?.textContent).toContain(
      product.category,
    );
    expect(element.querySelector('.product-card__description')?.textContent).toContain(
      product.description,
    );
    expect(element.querySelector('.product-card__price')?.textContent).toContain('29.99');
    expect(element.querySelector('.product-card__rating')?.textContent).toContain('4.5');
  });

  it('should render an accessible product image', () => {
    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(image.getAttribute('src')).toBe(product.image);
    expect(image.getAttribute('alt')).toBe(product.title);
    expect(image.getAttribute('loading')).toBe('lazy');
  });

  it('should link to the product details page', () => {
    const link = fixture.nativeElement.querySelector(
      '.product-card__action',
    ) as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe(`/products/${product.id}`);
    expect(link.getAttribute('aria-label')).toContain(product.title);
  });
});
