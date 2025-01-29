// import { Component, Inject, OnInit } from '@angular/core';
// import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { AuthService } from 'src/app/core/Services/auth.service';
// import { NotificationService } from 'src/app/notification/notification.service';

// @Component({
//   selector: 'app-edit-product',
//   templateUrl: './edit-product.component.html',
//   styleUrls: ['./edit-product.component.scss']
// })
// export class EditProductComponent implements OnInit{
//   editProductForm: FormGroup;
//   thumbnailError: string | null = null;

//   constructor(private authService:AuthService,  private fb: FormBuilder,
//     public dialogRef: MatDialogRef<EditProductComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any, private notification: NotificationService) {

//       this.editProductForm = this.fb.group({
//         name: ['', Validators.required],
//         description: ['', Validators.required],
//         originalPrice: ['', [Validators.required, Validators.min(1000), Validators.max(250000), this.nonNegativeValidator]],
//         stockQuantity: ['', [Validators.required, Validators.min(0)]],
//         categoryId: ['', [Validators.required, Validators.min(0)]],
//         brandId: ['', [Validators.required, Validators.min(0)]],
//         thumbnail: [null, Validators.required]
//       });
//   }
//   ngOnInit(): void {

//   }

//   nonNegativeValidator(control: AbstractControl): ValidationErrors | null {
//     const value = control.value;
//     return value >= 0 ? null : { nonNegative: true };
//   }

//   onFileChange(event: any) {
//     const fileInput = event.target;
//     this.thumbnailError = null;

//     if (fileInput.files.length > 0) {
//       const file = fileInput.files[0];
//       const fileType = file.type;
//       const validImageTypes = ['image/jpeg', 'image/png'];

//       if (!validImageTypes.includes(fileType)) {
//         this.thumbnailError = 'Only JPEG and PNG formats are allowed.';
//         this.editProductForm.patchValue({
//           thumbnail: null
//         });
//         this.editProductForm.get('thumbnail')?.markAsTouched();
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         const img = new Image();
//         img.src = e.target.result;
//         img.onload = () => {
//           if (img.width === 800 && img.height === 800) {
//             this.editProductForm.patchValue({
//               thumbnail: file
//             });
//           } else {
//             this.thumbnailError = 'Image dimensions must be 800 x 800 pixels.';
//             this.editProductForm.patchValue({
//               thumbnail: null
//             });
//             this.editProductForm.get('thumbnail')?.markAsTouched();
//           }
//         };
//       };
//       reader.readAsDataURL(file);
//     } else {
//       this.thumbnailError = 'Thumbnail is required.';
//       this.editProductForm.patchValue({
//         thumbnail: null
//       });
//       this.editProductForm.get('thumbnail')?.markAsTouched();
//     }
//   }

//   onInput(event: any) {
//     const input = event.target;
//     let value = input.value;
//     value = value.replace(/[^0-9]/g, '');
//     input.value = value;
//   }

//   onCancel(): void {
//     this.dialogRef.close();
//   }
//   // onFileChange(event: any): void {
//   //   const fileInput = event.target;
//   //   if (fileInput.files.length > 0) {
//   //     const file = fileInput.files[0];
//   //     this.editProductForm.patchValue({
//   //       thumbnail: file
//   //     });
//   //   } else {
//   //     this.editProductForm.patchValue({
//   //       thumbnail: null
//   //     });
//   //     this.editProductForm.get('thumbnail')?.markAsTouched();
//   //   }
//   // }
 

//   onSave(): void {
//     if (this.editProductForm.valid) {
//       const formData = new FormData();
//       formData.append('name', this.editProductForm.get('name')?.value);
//       formData.append('description', this.editProductForm.get('description')?.value);
//       formData.append('originalPrice', this.editProductForm.get('originalPrice')?.value);
//       formData.append('stockQuantity', this.editProductForm.get('stockQuantity')?.value);
//       formData.append('categoryId', this.editProductForm.get('categoryId')?.value);
//       formData.append('brandId', this.editProductForm.get('brandId')?.value);
//       formData.append('thumbnail', this.editProductForm.get('thumbnail')?.value);
  
//       console.log('Form data to be sent:', formData);
//       this.notification.Success('Product updated!')

//       setTimeout(() => {
//         this.dialogRef.close(formData);
//       }, 1000);
//     } else {
//       console.log('Form is invalid', this.editProductForm.errors);
//     }
//   }
    
// }
 





  









import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/Services/auth.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  editProductForm: FormGroup;
  thumbnailError: string | null = null;

  constructor(
    private fb: FormBuilder,
    public authservcie: AuthService,
    public notification: NotificationService,
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editProductForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
      originalPrice: [data.originalPrice, [Validators.required, Validators.min(1000), Validators.max(250000), this.nonNegativeValidator]],
      stockQuantity: [data.stockQuantity, [Validators.required, Validators.min(0)]],
      categoryId: [data.categoryId, [Validators.required, Validators.min(0)]],
      brandId: [data.brandId, [Validators.required, Validators.min(0)]],
      thumbnail: [null],
      discountPercentage: [data.discountPercentage, [this.nonNegativeValidator, Validators.max(100)]]
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
      const validImageTypes = ['image/jpeg', 'image/png'];
  
      if (!validImageTypes.includes(fileType)) {
        this.thumbnailError = 'Only JPEG and PNG formats are allowed.';
        this.editProductForm.patchValue({
          thumbnail: null
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
              thumbnail: file
            });
          } else {
            this.thumbnailError = 'Image dimensions must be 800 x 800 pixels.';
            this.editProductForm.patchValue({
              thumbnail: null
            });
            this.editProductForm.get('thumbnail')?.markAsTouched();
          }
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.thumbnailError = '';
      this.editProductForm.patchValue({
        thumbnail: null
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
      formData.append('description', this.editProductForm.get('description')?.value);
      formData.append('originalPrice', this.editProductForm.get('originalPrice')?.value);
      formData.append('stockQuantity', this.editProductForm.get('stockQuantity')?.value);
      formData.append('categoryId', this.editProductForm.get('categoryId')?.value);
      formData.append('brandId', this.editProductForm.get('brandId')?.value);
      formData.append('discountPercentage', this.editProductForm.get('discountPercentage')?.value);

      // Append thumbnail only if it has been changed
      if (this.editProductForm.get('thumbnail')?.value) {
        formData.append('thumbnail', this.editProductForm.get('thumbnail')?.value);
      }

      console.log('Form data to be sent:', formData);
      this.notification.Success('Product updated!');
      window.location.reload();

      setTimeout(() => {
        this.dialogRef.close(formData);
      }, 1000);
    } else {
      console.log('Form is invalid', this.editProductForm.errors);
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
