import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { add_product_c } from 'src/app/constants/messages';
import { AdminService } from 'src/app/core/Services/admin.service';
import { AuthService } from 'src/app/core/Services/auth.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  editProductForm: FormGroup;
  thumbnailError: string | null = null;
  
  @Output() productUpdated = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    public authservcie: AuthService,
    public adminService: AdminService,
    public notification: NotificationService,
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editProductForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
      originalPrice: [
        data.originalPrice,
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(250000),
          this.nonNegativeValidator,
        ],
      ],
      stockQuantity: [
        data.stockQuantity,
        [Validators.required, Validators.min(0)],
      ],
      categoryId: [data.categoryId, [Validators.required, Validators.min(0)]],
      brandId: [data.brandId, [Validators.required, Validators.min(0)]],
      thumbnail: [null],
      discountPercentage: [
        data.discountPercentage,
        [this.nonNegativeValidator, Validators.max(100)],
      ],
    });
  }

  ngOnInit(): void {}

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
        this.editProductForm.patchValue({
          thumbnail: null,
        });
        this.editProductForm.get('thumbnail')?.markAsTouched();
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          if (img.width === 800 && img.height === 800) {
            this.editProductForm.patchValue({
              thumbnail: file,
            });
          } else {
            this.thumbnailError = add_product_c.thumbnailError_Dimension;
            this.editProductForm.patchValue({
              thumbnail: null,
            });
            this.editProductForm.get('thumbnail')?.markAsTouched();
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.thumbnailError = '';
      this.editProductForm.patchValue({
        thumbnail: null,
      });
      this.editProductForm.get('thumbnail')?.markAsTouched();
    }
  }

  onInput(event: any) {
    const input = event.target;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    input.value = value;
  }

  onSave(): void {
    if (this.editProductForm.valid) {
      const formData = new FormData();
      formData.append('name', this.editProductForm.get('name')?.value);
      formData.append(
        'description',
        this.editProductForm.get('description')?.value
      );
      formData.append(
        'originalPrice',
        this.editProductForm.get('originalPrice')?.value
      );
      formData.append(
        'stockQuantity',
        this.editProductForm.get('stockQuantity')?.value
      );
      formData.append(
        'categoryId',
        this.editProductForm.get('categoryId')?.value
      );
      formData.append('brandId', this.editProductForm.get('brandId')?.value);
      formData.append(
        'discountPercentage',
        this.editProductForm.get('discountPercentage')?.value ?? 0
      );

 
      if (this.editProductForm.get('thumbnail')?.value) {
        formData.append(
          'thumbnail',
          this.editProductForm.get('thumbnail')?.value
        );
      }

      this.notification.Success(add_product_c.productUpdated_e);
      // window.location.reload();

      setTimeout(() => {
        this.dialogRef.close(formData);
      }, 1000);
    } else {
      this.notification.Error(add_product_c.formInvalid_e) ;
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
