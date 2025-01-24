export interface GetUserOrdersDTO {
    id: number;
    orderDate: string;
    totalPriceAfterDiscount: number;
    status: string;
    selected?: boolean;
    expanded?: boolean;  // this property is for expand and collapse the row 
}