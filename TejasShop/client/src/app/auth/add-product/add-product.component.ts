// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-add-product',
//   templateUrl: './add-product.component.html',
//   styleUrls: ['./add-product.component.scss']
// })
// export class AddProductComponent implements OnInit{

//   product = {
//     name: '',
//     description: '',
//     originalPrice: 0,
//     stockQuantity: 0,
//     categoryId: 0,
//     brandId: 0,
//     thumbnail: null
    
//   };
//   stockQuantityInvalid: boolean | undefined;

//   constructor(private http: HttpClient,private route: ActivatedRoute) {}
  
//   ngOnInit(): void {
    
//   }
//   onFileSelected(event: any) {
//     this.product.thumbnail = event.target.files[0];
//   }

//   // onSubmit(products: { name: string, description: string, originalPrice: number, stockQuantity: number, categoryId: number, brandId: number }) {
//   //   console.log('products params', products); // const formData = new FormData();
//   //   // formData.append('Name', this.product.name);
//   //   // formData.append('Description', this.product.description);
//   //   // formData.append('OriginalPrice', this.product.originalPrice.toString());
//   //   // formData.append('StockQuantity', this.product.stockQuantity.toString());
//   //   // formData.append('CategoryId', this.product.categoryId.toString());
//   //   // formData.append('BrandId', this.product.brandId.toString());
//   //   //formData.append('Thumbnail', this.product.thumbnail);


//   //   let params = new HttpParams()
//   //   .set('Name', products.name)
//   //   .set('Description', products.description)
//   //   .set('OriginalPrice', products.originalPrice.toString())
//   //   .set('StockQuantity', products.stockQuantity.toString())
//   //   .set('CategoryId', products.categoryId.toString())
//   //   .set('BrandId', products.brandId.toString());
//   //   console.log('products params',products);
//   //   this.http.post('http://localhost:5129/api/Catalog/product/create', {}, { params })
//   //     .subscribe(response => {
//   //       console.log('Product added:', response);
//   //       alert('Product added successfully!');
//   //       // Reset the form
//   //       this.product = {
//   //         name: '',
//   //         description: '',
//   //         originalPrice: 0,
//   //         stockQuantity: 0,
//   //         categoryId: 0,
//   //         brandId: 0,
//   //         thumbnail: null
//   //       };
//   //     }, error => {
//   //       console.error('Error adding product:', error);
//   //       alert('Failed to add product.');
//   //     });
//   // }
  
//   onSubmit(products: {
//     name: string,
//     description: string,
//     originalPrice: number,
//     stockQuantity: number,
//     categoryId: number,
//     brandId: number
//    }) {
//     console.log('Product params', products);
//     this.http.post('http://localhost:5129/api/Catalog/product/create', products)
//       .subscribe(response => {
//         console.log('Product added:', response);
//         alert('Product added successfully!');
//         // Reset the form
//         this.product = {
//           name: '',
//           description: '',
//           originalPrice: 0,
//           stockQuantity: 0,
//           categoryId: 0,
//           brandId: 0,
//           thumbnail: null
//         };
//       }, error => {
//         console.error('Error adding product:', error.error); // Log detailed error message
//         alert('Failed to add product.');
//       });
//    }
//   validateStockQuantity() {
//     this.stockQuantityInvalid = this.product.stockQuantity < 0;
//   }



 
  

// }



import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/core/Services/auth.service';
@Component({
 selector: 'app-add-product',
 templateUrl: './add-product.component.html',
 styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {

 productForm: FormGroup;

 constructor(private fb: FormBuilder, private authservcie: AuthService) {
   this.productForm = this.fb.group({
     Name: ['', Validators.required],
     Description: ['', Validators.required],
     OriginalPrice: [0, [Validators.required, Validators.min(1)]],
     StockQuantity: [0, [Validators.required, Validators.min(0)]],
     CategoryId: ['', Validators.required],
     BrandId: ['', Validators.required],
   });
 }

 onSubmit() {
   if (this.productForm.valid) {
    
     this.authservcie.addProduct(this.productForm.value).subscribe(
     
       (response) => {
         console.log('Product added successfully!', response);
         alert('Product added successfully!');
         this.productForm.reset();
       },
       (error) => {
         console.error('Error adding product', error);
         alert('Failed to add product');
       }
     );
   } else {
     alert('Please fill out the form correctly.');
   }
 }
}