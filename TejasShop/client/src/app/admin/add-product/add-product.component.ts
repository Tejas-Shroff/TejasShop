import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { add_product_c } from 'src/app/constants/messages';
import { CategoryResDto, BrandResDto } from 'src/app/core/Models/catalog';
import { AdminService } from 'src/app/core/Services/admin.service';
import { AuthService } from 'src/app/core/Services/auth.service';
import { NotificationService } from 'src/app/notification/notification.service';
import { loadCategories, loadBrands } from 'src/app/redux/catalog/catalog.action';
import { selectCategories, selectBrands } from 'src/app/redux/catalog/catalog.selector';
import { AppState } from 'src/app/redux/store';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
 
  addProductForm: FormGroup;
  thumbnailError: string | null = null;
  categories$: Observable<CategoryResDto[]>;
  brands$: Observable<BrandResDto[]>;
  
  ngOnInit(): void {
    this.categories$.pipe(
      tap(categories => {
        if (categories.length === 0) {
          this.store.dispatch(loadCategories());
        }
      })
    ).subscribe();

    this.brands$.pipe(
      tap(brands => {
        if (brands.length === 0) {
          this.store.dispatch(loadBrands());
        }
      })
    ).subscribe();
  }
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private adminService: AdminService,
    public notification: NotificationService,
    private store: Store<AppState>
  ) {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(512)]],
      originalPrice: [
        '',
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(250000),
          this.nonNegativeValidator,
        ],
      ],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', [Validators.required, Validators.min(0)]],
      brandId: ['', [Validators.required, Validators.min(0)]],
      thumbnail: [null, Validators.required],
      discountPercentage: [
        '',
        [this.nonNegativeValidator, Validators.max(100)],
      ],
    });


    this.categories$ = this.store.select(selectCategories);
    this.brands$ = this.store.select(selectBrands);
  }

  nonNegativeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value >= 0 ? null : { nonNegative: true };
  }

  onFileChange(event: any) {
    const fileInput = event.target;
    this.thumbnailError = null;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileType = file.type;

      if (!add_product_c.validImageTypes.includes(fileType)) {
        this.thumbnailError = add_product_c.thumbnailError_Format;
        this.addProductForm.patchValue({
          thumbnail: null,
        });
        this.addProductForm.get('thumbnail')?.markAsTouched();
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          if (img.width === 800 && img.height === 800) {
            this.addProductForm.patchValue({
              thumbnail: file,
            });
          } else {
            this.thumbnailError = add_product_c.thumbnailError_Dimension;
            this.addProductForm.patchValue({
              thumbnail: null,
            });
            this.addProductForm.get('thumbnail')?.markAsTouched();
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.thumbnailError = add_product_c.thumbnailError_Required;
      this.addProductForm.patchValue({
        thumbnail: null,
      });
      this.addProductForm.get('thumbnail')?.markAsTouched();
    }
  }

  onInput(event: any) {
    const input = event.target;
    const value = input.value;
    input.value = value.replace(/[^0-9]/g, '');
  }

  onSubmit() {
    if (this.addProductForm.invalid) {
      this.markAllAsTouched();

      return;
    }
    const formData = new FormData();
    formData.append('name', this.addProductForm.get('name')?.value);
    formData.append(
      'description',
      this.addProductForm.get('description')?.value
    );
    formData.append(
      'originalPrice',
      this.addProductForm.get('originalPrice')?.value
    );
    formData.append(
      'stockQuantity',
      this.addProductForm.get('stockQuantity')?.value
    );
    formData.append('categoryId', this.addProductForm.get('categoryId')?.value);
    formData.append('brandId', this.addProductForm.get('brandId')?.value);
    formData.append('thumbnail', this.addProductForm.get('thumbnail')?.value);
    formData.append(
      'discountPercentage',
      this.addProductForm.get('discountPercentage')?.value
    );

    this.adminService.addProduct(formData).subscribe(
      (response) => {
        this.notification.Success(add_product_c.productAddedSuccessfully_a);       
        this.resetForm();
      },
      (error) => {
        this.notification.Error(add_product_c.ErrorAddingProduct + error.message);
      }
    );
  }

  markAllAsTouched() {
    Object.keys(this.addProductForm.controls).forEach(field => {
      const control = this.addProductForm.get(field);
      console.log('Control',control);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  resetForm() {
    this.addProductForm.reset();
  }

  logout() {
    this.authService.LogOutAdminSide().subscribe();
  }

  
  onFileChangeThumbnail(event: any) {
    const file = event.target.files[0];
    this.addProductForm.patchValue({
      image: file
    });
    this.addProductForm.get('image')?.updateValueAndValidity();
  }
  
}
