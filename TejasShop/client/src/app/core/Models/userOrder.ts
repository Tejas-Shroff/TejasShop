export interface GetUserOrdersDTO {
    id: number;
    orderDate: string;
    totalPriceAfterDiscount: number;
    status: string;
    selected?: boolean;
    expanded?: boolean;  
}