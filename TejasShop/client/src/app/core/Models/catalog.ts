import { ImageDtoRes } from './image';
import { Pagination } from './pagination';

export interface CategoryResDto {
  id: number;
  name: string;

  image: ImageDtoRes | null;
}

export interface BrandResDto {
  id: number;
  name: string;

  image: ImageDtoRes | null;
}

export interface ProductResDto {
  id: number;
  name: string;
  description: string;
  originalPrice: number;
  discountPercentage: number | null;
  newPrice: number;
  isOnDiscount: boolean;
  stockQuantity: number;
  inStock: boolean;
  isFeatured: boolean;
  category: CategoryResDto;
  brand: BrandResDto;
  thumbnail: ImageDtoRes | null;
}

export interface SortFilter {
  sort?: string;
}
export interface ProductFilters {
  sort?: string;
  brandIds?: number[];
  categoryIds?: number[];
  search?: string;
  inStock?: boolean;
}

export interface addProductDTO {
  thumbnailFile(arg0: string, thumbnailFile: any): unknown;
  name: string;
  description: string;
  originalPrice: number;
  discountPercentage: number;
  stockQuantity: number;
  categoryId: number;
  brandId: number;
  thumbnail: ImageDtoRes | null;
}
