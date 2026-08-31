import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { injectMutation } from '@ngneat/query';
import { ProductApiService } from '../data-access/product-api.service';
import { CreateProductInput } from '../models/product.model';

@Component({
  selector: 'app-product-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-create.html',
  styleUrl: './product-create.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCreate {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productApi = inject(ProductApiService);
  private readonly useMutation = injectMutation();

  private readonly initialFormValue: CreateProductInput = {
    title: '',
    price: 0,
    category: '',
    image: '',
    description: '',
  };

  protected readonly categories = [
    'electronics',
    'jewelery',
    "men's clothing",
    "women's clothing",
  ];

  protected readonly productForm = this.formBuilder.nonNullable.group({
    title: [
      this.initialFormValue.title,
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    price: [
      this.initialFormValue.price,
      [Validators.required, Validators.min(0.01)],
    ],
    category: [this.initialFormValue.category, Validators.required],
    image: [
      this.initialFormValue.image,
      [Validators.required, Validators.pattern(/^https?:\/\/\S+$/i)],
    ],
    description: [
      this.initialFormValue.description,
      [Validators.required, Validators.minLength(20), Validators.maxLength(1000)],
    ],
  });

  private readonly createProductMutation = this.useMutation({
    mutationFn: (product: CreateProductInput) =>
      this.productApi.createProduct(product),
  });

  protected readonly createState = this.createProductMutation.result;

  protected isInvalid(controlName: keyof CreateProductInput): boolean {
    const control = this.productForm.controls[controlName];
    return control.invalid && control.touched;
  }

  protected submit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.createState().isPending) {
      return;
    }

    this.createProductMutation.mutate(this.productForm.getRawValue());
  }

  protected createAnother(): void {
    this.productForm.reset(this.initialFormValue);
    this.createProductMutation.reset();
  }
}
