export type InventoryStatus = 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';

export interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  rating: number;
  inventoryStatus: InventoryStatus;
}
