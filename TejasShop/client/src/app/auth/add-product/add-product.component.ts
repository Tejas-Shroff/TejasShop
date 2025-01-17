import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { addProductDTO } from 'src/app/core/Models/catalog';

import { AuthService } from 'src/app/core/Services/auth.service';
import { NotificationService } from 'src/app/notification/notification.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit{

  addProductForm: FormGroup;
  
  ngOnInit(): void {}
    constructor(private fb: FormBuilder, public authservcie: AuthService, private notification : NotificationService) {
      this.addProductForm = this.fb.group({
        // name: ['', Validators.required],
        // description: ['', Validators.required],
        // originalPrice: ['', Validators.required],
        // stockQuantity: ['', Validators.required],
        // categoryId: ['', Validators.required],
        // brandId: ['', Validators.required],
        // thumbnail: [null, Validators.required]

        name: ['', Validators.required],
        description: ['', Validators.required],
        originalPrice: ['', [Validators.required, Validators.min(0)]],
        stockQuantity: ['', [Validators.required, Validators.min(0)]],
        categoryId: ['', [Validators.required, Validators.min(0)]],
        brandId: ['', [Validators.required, Validators.min(0)]],
        thumbnail: [null, Validators.required]
      });
    }
  
    // onFileChange(event: any) {
    //   if (event.target.files.length > 0) {
    //     const file = event.target.files[0];
    //     this.addProductForm.patchValue({
    //       thumbnail: file
    //     });
    //   }
    // }
    onFileChange(event: any) {
      const fileInput = event.target;
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        this.addProductForm.patchValue({
          thumbnail: file
        });
      } else {
        this.addProductForm.patchValue({
          thumbnail: null
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
        return;
      }
      const formData = new FormData();
      formData.append('name', this.addProductForm.get('name')?.value);
      formData.append('description', this.addProductForm.get('description')?.value);
      formData.append('originalPrice', this.addProductForm.get('originalPrice')?.value);
      formData.append('stockQuantity', this.addProductForm.get('stockQuantity')?.value);
      formData.append('categoryId', this.addProductForm.get('categoryId')?.value);
      formData.append('brandId', this.addProductForm.get('brandId')?.value);
      formData.append('thumbnail', this.addProductForm.get('thumbnail')?.value);
  
      this.authservcie.addProduct(formData).subscribe(response => {
        
 
        console.log('Product added successfully', response);  
        alert("product ADDED")
      });
    }
    
    logout(){
      this.authservcie.LogOutAdminSide().subscribe();
    }
  }

  
 
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from 'src/app/core/Services/auth.service';
// @Component({
//  selector: 'app-add-product',
//  templateUrl: './add-product.component.html',
//  styleUrls: ['./add-product.component.scss']
// })
// export class AddProductComponent implements OnInit {
//  addProductForm: FormGroup;
//  isSubmitting: boolean = false; // Flag to disable the button during submission
//  errorMessage: string | null = null;
//  constructor(private fb: FormBuilder, private authService: AuthService) {
//    this.addProductForm = this.fb.group({
//      name: ['', Validators.required],
//      description: ['', [Validators.required, Validators.minLength(10)]], // Minimum length validation
//      originalPrice: ['', [Validators.required, Validators.min(1)]], // Must be greater than 0
//      stockQuantity: ['', [Validators.required, Validators.min(1)]], // Must be greater than 0
//      categoryId: ['', Validators.required],
//      brandId: ['', Validators.required],
//      thumbnail: [null, Validators.required] // File is required
//    });
//  }
//  ngOnInit(): void {}
//  // Handling file input
//  onFileChange(event: any) {
//    if (event.target.files.length > 0) {
//      const file = event.target.files[0];
//      this.addProductForm.patchValue({
//        thumbnail: file
//      });
//    }
//  }
//  // Submission of the form
//  onSubmit() {
//    // Check if the form is valid
//    if (this.addProductForm.invalid) {
//      this.addProductForm.markAllAsTouched(); // Mark fields to show error messages
//      return;
//    }
//    this.isSubmitting = true;
//    this.errorMessage = null;
//    // Prepare FormData
//    const formData = new FormData();
//    formData.append('name', this.addProductForm.get('name')?.value);
//    formData.append('description', this.addProductForm.get('description')?.value);
//    formData.append('originalPrice', this.addProductForm.get('originalPrice')?.value);
//    formData.append('stockQuantity', this.addProductForm.get('stockQuantity')?.value);
//    formData.append('categoryId', this.addProductForm.get('categoryId')?.value);
//    formData.append('brandId', this.addProductForm.get('brandId')?.value);
//    formData.append('thumbnail', this.addProductForm.get('thumbnail')?.value);
//    // Submit FormData
//    this.authService.addProduct(formData).subscribe(
//      response => {
//        console.log('Product added successfully:', response);
//        this.addProductForm.reset(); // Reset the form on success
//        this.isSubmitting = false;
//      },
//      error => {
//        console.error('Error adding product:', error);
//        this.errorMessage = 'An error occurred while adding the product. Please try again.';
//        this.isSubmitting = false;
//      }
//    );
//  }
//  // Utility for easy access to form controls in HTML
//  get formControls() {
//    return this.addProductForm.controls;
//  }
// }