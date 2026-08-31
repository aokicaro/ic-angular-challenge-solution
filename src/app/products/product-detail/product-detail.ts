import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { injectQuery } from '@ngneat/query';
import { ProductApiService } from '../data-access/product-api.service';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly productApi = inject(ProductApiService);
  private readonly useQuery = injectQuery();
  private readonly productId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly hasValidProductId =
    Number.isSafeInteger(this.productId) && this.productId > 0;

  protected readonly productState = this.useQuery({
    queryKey: ['products', this.productId] as const,
    queryFn: () => this.productApi.getProduct(this.productId),
    enabled: this.hasValidProductId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  }).result;
}
