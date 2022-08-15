export interface FilterByProducts{
  products?: {
    productId:string;
    variantId?:string;
  }[];
}