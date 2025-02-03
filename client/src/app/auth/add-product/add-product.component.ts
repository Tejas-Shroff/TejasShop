import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AdminService } from 'src/app/core/Services/admin.service';
import { AuthService } from 'src/app/core/Services/auth.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;
  thumbnailError: string | null = null;

  ngOnInit(): void {}
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private adminService: AdminService,
    public notification: NotificationService
  ) {
    this.addProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
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
      const validImageTypes = ['image/jpeg', 'image/png'];

      if (!validImageTypes.includes(fileType)) {
        this.thumbnailError = 'Only JPEG and PNG formats are allowed.';
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
            this.thumbnailError = 'Image dimensions must be 800 x 800 pixels.';
            this.addProductForm.patchValue({
              thumbnail: null,
            });
            this.addProductForm.get('thumbnail')?.markAsTouched();
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.thumbnailError = 'Thumbnail is required.';
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
        console.log('Product Added Response:', response); 
        this.notification.Success('Product Added Successfully');       
        this.resetForm();
      },
      (error) => {
        this.notification.Error('Error adding product: ' + error.message);
      }
    );
  }

  resetForm() {
    this.addProductForm.reset();
  }

  logout() {
    this.authService.LogOutAdminSide().subscribe();
  }
}
