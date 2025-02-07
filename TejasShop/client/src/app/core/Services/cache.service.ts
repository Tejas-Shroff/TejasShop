import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  private cache: { [key: string]: any } = {};

  setItem(key: string, value: any): void {
    this.cache[key] = value;
  }

  getItem(key: string): any {
    return this.cache[key];
  }

  removeItem(key: string): void {
    delete this.cache[key];
  }
  
}
