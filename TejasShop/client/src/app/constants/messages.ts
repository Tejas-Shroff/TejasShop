export const Messages = {
  SomethingBadErrorOccurred: 'Something bad happened; please try again later.',
};

export const ProductDetails_M = {
  MaxQty: 'You can only add a maximum of {0} quantities for this item.',
  MaximumQtyForCart:
    'Maximum quantity of {0} for this item is already in the cart.',
};

export const add_product_c = {
  validImageTypes: ['image/jpeg', 'image/png'],
  thumbnailError_Format: 'Only JPEG and PNG formats are allowed.',
  thumbnailError_Dimension: 'Image dimensions must be 800 x 800 pixels.',
  thumbnailError_Required: 'Thumbnail is required.',
  productAddedSuccessfully_a: 'Product Added Successfully',
  ErrorAddingProduct: 'Error adding product: ',

  productUpdated_e: 'Product updated!', //_e for edit compoenent
  formInvalid_e: 'Form is Invalid',
};

export const view_product_c = {
  widthofEditDialogbox: '400px',
  UpdatingProductWithID: 'Updating product with ID:',
  productUpdatedSuccesffuly_v: 'Product updated successfully!',
  updateFailed_v: 'Update failed',
  ErrorDeletingProduct_v: 'Error deleting product',
  productDeleted_v: 'Product deleted!',
};

export const login_c = {
  InvalidPassword_l: 'Invalid password!',
  InvalidRoleSelection_l: 'Invalid role selection',
  rememberMe_l : 'rememberMe'
};

export const Register_c = {
  Registered_r: 'User registered successfully!',
};

export const address_form_c = {
  Free: 'free',
  AddressAddedSuccess: 'Address added successfully!',
  states: [
    'Andhra Pradesh',
    ' Arunachal Pradesh',
    ' Assam',
    ' Bihar',
    ' Chhattisgarh',
    ' Goa',
    ' Gujarat',
    ' Haryana',
    ' Himachal Pradesh',
    ' Jharkhand',
    ' Karnataka',
    ' Kerala',
    ' Madhya Pradesh',
    ' Maharashtra',
    ' Manipur',
    ' Meghalaya',
    ' Mizoram',
    ' Nagaland',
    ' Odisha',
    ' Punjab',
    ' Rajasthan',
    ' Sikkim',
    ' Tamil Nadu',
    ' Telangana',
    ' Tripura',
    ' Uttar Pradesh',
    ' Uttarakhand',
    'West Bengal',
  ],
};
export const cart_c = {
  AddresRemoved_c: 'Address Removed!',
  orderCreated_c: 'Order Created',
  ShippingAdressSelect_c: 'Please Select Shipping Address.',
  MaxQtyValidaton_c:
    'You can only add a maximum of {0} quantities for this item.',

  FailedToAddProductToCart_Cartservice: 'Failed to add product to cart.',
};
export const checkout_c = {
  modal_lg: 'modal-lg',
};
export const Wishlist_c = {
  ItemAlreadyInCart: 'This item is already in your cart.',
  UserNotLoggedIn_E : 'User not logged in',   // _E for refering Wishlist.effects.ts

  NotifyMessage_u:
    'Will notify you once the product is in stock again! We appreciate your patience.',
};
export const ApiInterceptor_c = {
  ServerSideErr: 'This is server side error',
  ClientSideErr: 'This is client side error',
  Authorization_i: 'Authorization',
  Bearer_i: 'Bearer ',
};
export const getMaxAllowedQuantity = (stockQuantity: number): number => {
  return stockQuantity <= 10
    ? 1
    : stockQuantity <= 20
    ? 2
    : stockQuantity <= 50
    ? 3
    : stockQuantity <= 500
    ? 4
    : 5;
};
export const header_c = {
  ErrorFetchingProduct_h: 'Error fetching products:',
  SearchTermShort_h: 'Search term is too short.',
};
export const NOTIFICATION_MESSAGES = {
  SUCCESS: 'Success!',
  ERROR: 'Error!',
  WARNING: 'Warning!',
  INFO: 'Info!',
};
export const orderDeatails_o = {

  pending_COD: 'Pending - Cash on Delivery',
  RetryPaymentfailedToastr_o:
    'Online payment failed twice, updated your payment status to Cash on Delivery.',
  transactionFailedToastr_o: 'Transaction cancelled.',
  orderCancelledSuccess_o: 'Order cancelled successfully',
  orderCancelledError_o: 'Failed to cancel the order',
  generalError_o: 'There was an error!',
  statusCancelled_o: 'Cancelled',
  statusRefundNotApplicable_o: 'Refund Not Applicable',
  statusRefundInitiated_o: 'Refund Initiated',
  paymentStatusPending_o: 'pending',
  paymentStatusCompleted_o: 'completed',
  paymentStatusPendingCOD_o: 'pending - cash on delivery',
};
export const general_u = {
    INR_o: 'INR',
    AmazonShop_o: 'AmazonShop',
    PurchaseDescription_o: 'Purchase Description',
    Completed_o: 'Completed',
    mail_o: 'youremail@example.com',
    color_code_o: '#0c238a',
    blur_o : 'blur',
    loadinMessage_o : 'loading-message',
    block_o : 'block',
    none_o : 'none'
}
export const orderTracker_c = {
  Completed_o: 'completed',
  Cancelled_o: 'cancelled',
  Confirmed_o: 'confirmed',
  paymentCompleted_o: 'Payment Completed',
  orderStatus_o: 'orderStatus',
  paymentStatus_o: 'paymentStatus',
  placed_o: 'Placed',
  payments_o: 'Payments',
  orderConfirmed: 'Order Confirmed',
  shipped_o: 'Shipped',
  ourForDelivery_o: 'Out For Delivery',
  delivered_o: 'Delivered',
  orderCancelled_o: 'Order Cancelled',
  orderConfirmed_o: 'Order Confirmed',
};
export const userOrders_c = {
  dateFomrat: 'yyyy-MM-dd',
  today_u: 'today',
  oneMonth_u: '1month',
  twoMonth_u: '2months',
  threeMonth_u: '3months',
  sixMonth_u: '6months',
};
export const product_c = {
  AddedToWishList_u: 'Added to wishlist', //_u for universal
  RemovedToWishList_u: 'Removed from wishlist',
};
export const sortHeader_c = {
  sortOptions: [
    { sortName: 'Featured', sortCode: 'featured' },
    { sortName: 'Price: Low to High', sortCode: 'price_lth' },
    { sortName: 'Price: High to Low', sortCode: 'price_htl' },
  ],
};
export const orderService_c = {
    startDate_o : 'startDate',
    enddate_o : 'endDate'
}
export const autService_c = {
    accesstoken_a : 'accestoken' ,
    refreshToken_a : 'refreshtoken',
    userRole_a : 'userRole',
    methodNotimplemented_a : 'Method not implemented.'
}

