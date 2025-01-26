import { HttpClient , HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetUserOrdersDTO } from '../Models/userOrder';
import { OrderDetailDTO, updateOrderStatusDTO } from '../Models/order';
import { interval, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http:HttpClient) { }

  
  getUserOrders(startDate: string, endDate: string){
    let params = new HttpParams();
    params = params.append('startDate', startDate);
    params = params.append('endDate', endDate);
    return this.http.get<GetUserOrdersDTO[]>('Order/Get-all-orders', { params })
  }
    
  getAllUserOrders(){
    let params = new HttpParams()
    return this.http.get<GetUserOrdersDTO[]>('Order/Get-all-orders', { params })
  }

  getOrderDetail(orderId:number){
    return this.http.get<OrderDetailDTO>('Order/orderdetail/'+orderId)
  }

  updateOrderStatus(orderId: string, status: string){
    return this.http.put<updateOrderStatusDTO>('Order/UpdateStatus', { orderId, status })
  }
  updateCancelledOrderStatus(orderId: number, status: string): Observable<{ isSuccessed: boolean }> {
    return this.http.put<{ isSuccessed: boolean }>('Order/UpdateStatus', { orderId, status });
}
}
