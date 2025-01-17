import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/Services/auth.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit{
  editProductForm: FormGroup;

  constructor(private authService:AuthService,  private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.editProductForm = this.fb.group({
        name: [data.name ],
        description: [data.description],
        originalPrice: [data.originalPrice],
        stockQuantity: [data.stockQuantity],
        categoryId: [data.categoryId],
        brandId: [data.brandId]
      });
  }
  ngOnInit(): void {

  }

  onCancel(): void {
    this.dialogRef.close();
  }
  onFileChange(event: any): void {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.editProductForm.patchValue({
        thumbnail: file
      });
    } else {
      this.editProductForm.patchValue({
        thumbnail: null
      });
      this.editProductForm.get('thumbnail')?.markAsTouched();
    }
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
      formData.append('thumbnail', this.editProductForm.get('thumbnail')?.value);
  
      console.log('Form data to be sent:', formData);
      alert('data updated ')
      this.dialogRef.close(formData);
    } else {
      console.log('Form is invalid', this.editProductForm.errors);
    }
  }
    
}
 


  

