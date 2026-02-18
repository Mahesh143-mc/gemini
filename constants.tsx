
import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Glittering Gold Sparklers',
    category: Category.Sparklers,
    price: 15,
    description: 'Traditional long-lasting gold sparklers perfect for children.',
    image: 'https://images.unsplash.com/photo-1533230392651-d39442035384?auto=format&fit=crop&q=70&w=400',
    safetyLevel: 'Green',
    noiseLevel: 'Low',
    inStock: true
  },
  {
    id: '2',
    name: 'Multi-Color Rocket Pack',
    category: Category.Rockets,
    price: 45,
    description: 'A pack of 10 sky-soaring rockets with vibrant color trails.',
    image: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=70&w=400',
    safetyLevel: 'Standard',
    noiseLevel: 'High',
    inStock: true
  },
  {
    id: '3',
    name: 'Silver Rain Fountain',
    category: Category.Fountains,
    price: 25,
    description: 'Majestic ground fountain that spews silver sparks up to 8 feet.',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=70&w=400',
    safetyLevel: 'Standard',
    noiseLevel: 'Low',
    inStock: true
  },
  {
    id: '4',
    name: 'Mega Flower Pot XL',
    category: Category.FlowerPots,
    price: 30,
    description: 'Extra large conical cracker that creates a beautiful flower-like fire pattern.',
    image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&q=70&w=400',
    safetyLevel: 'Standard',
    noiseLevel: 'Medium',
    inStock: true
  },
  {
    id: '5',
    name: 'Super Sonic Chakkars',
    category: Category.Chakkars,
    price: 12,
    description: 'High-speed spinning ground wheels with changing colors.',
    image: 'https://images.unsplash.com/photo-1498622114704-58564da1977e?auto=format&fit=crop&q=70&w=400',
    safetyLevel: 'Standard',
    noiseLevel: 'Low',
    inStock: true
  },
  {
    id: '6',
    name: 'Royal Celebration Box',
    category: Category.GiftBoxes,
    price: 150,
    description: 'The ultimate collection of our best crackers for a grand celebration.',
    image: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=70&w=400',
    safetyLevel: 'Pro',
    noiseLevel: 'High',
    inStock: true
  },
  {
    id: '7',
    name: 'Blue Thunder Shells',
    category: Category.AerialShells,
    price: 85,
    description: 'Professional grade aerial shells that explode into massive blue peonies.',
    image: 'https://images.unsplash.com/photo-1473204907297-f58c42a27572?auto=format&fit=crop&q=70&w=400',
    safetyLevel: 'Pro',
    noiseLevel: 'High',
    inStock: false
  },
  {
    id: '8',
    name: 'Eco-Friendly Green Crackers',
    category: Category.Sparklers,
    price: 20,
    description: 'Low-emission, smokeless crackers designed for sensitive environments.',
    image: 'https://images.unsplash.com/photo-1496337589254-7e19d01ced44?auto=format&fit=crop&q=70&w=400',
    safetyLevel: 'Green',
    noiseLevel: 'Low',
    inStock: true
  }
];
