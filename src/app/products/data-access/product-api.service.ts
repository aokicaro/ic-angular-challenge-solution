import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreatedProduct,
  CreateProductInput,
  Product,
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://fakestoreapi.com';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProduct(productId: number): Observable<Product | null> {
    return this.http.get<Product | null>(`${this.apiUrl}/products/${productId}`);
  }

  createProduct(product: CreateProductInput): Observable<CreatedProduct> {
    return this.http.post<CreatedProduct>(`${this.apiUrl}/products`, product);
  }
}
