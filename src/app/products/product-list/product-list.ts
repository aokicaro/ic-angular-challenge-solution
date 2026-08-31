import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectQuery } from '@ngneat/query';
import { ProductApiService } from '../data-access/product-api.service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductList {
  private readonly productApi = inject(ProductApiService);
  private readonly useQuery = injectQuery();

  protected readonly loadingCards = Array.from({ length: 8 });
  protected readonly productsState = this.useQuery({
    queryKey: ['products'] as const,
    queryFn: () => this.productApi.getProducts(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  }).result;
}
