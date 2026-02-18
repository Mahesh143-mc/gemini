
export enum Category {
  Sparklers = 'Sparklers',
  Rockets = 'Rockets',
  Fountains = 'Fountains',
  FlowerPots = 'Flower Pots',
  Chakkars = 'Ground Chakkars',
  AerialShells = 'Aerial Shells',
  GiftBoxes = 'Gift Boxes'
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  safetyLevel: 'Green' | 'Standard' | 'Pro';
  noiseLevel: 'Low' | 'Medium' | 'High';
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface User {
  id: string;
  name: string;
  email: string;
}
