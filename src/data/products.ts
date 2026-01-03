export interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    personalPrice: number;
    companyPrice: number;
    category: string;
    isRecommendedPersonal?: boolean;
    isRecommendedCompany?: boolean;
    detailImages?: string[];
}

export const products: Product[] = [
    {
        id: 1,
        name: "Premium Ergonomic Chair",
        description: "Ultimate comfort for long working hours. Breathable mesh and lumbar support.",
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800",
        personalPrice: 350,
        companyPrice: 280,
        category: "Furniture",
        isRecommendedPersonal: true,
        isRecommendedCompany: true
    },
    {
        id: 2,
        name: "Wireless Noise-Canceling Headphones",
        description: "Industry-leading noise cancellation. 30-hour battery life and crystal clear calls.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        personalPrice: 299,
        companyPrice: 240,
        category: "Electronics",
        isRecommendedPersonal: true,
        isRecommendedCompany: false
    },
    {
        id: 3,
        name: "Minimalist Desk Lamp",
        description: "Adjustable color temperature and brightness. Sleek design for modern workspaces.",
        image: "https://images.unsplash.com/photo-1507473888900-52e1ad2d69b4?auto=format&fit=crop&q=80&w=800",
        personalPrice: 89,
        companyPrice: 65,
        category: "Accessories",
        isRecommendedPersonal: false,
        isRecommendedCompany: true
    },
    {
        id: 4,
        name: "Smart Air Purifier",
        description: "HEPA filter removes 99.9% of dust and allergens. Monitoring via mobile app.",
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800",
        personalPrice: 150,
        companyPrice: 120,
        category: "Appliances",
        isRecommendedPersonal: true,
        isRecommendedCompany: true
    },
    {
        id: 5,
        name: "Mechanical Keyboard",
        description: "Tactile switches for satisfying typing experience. RGB custom backlighting.",
        image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800",
        personalPrice: 120,
        companyPrice: 95,
        category: "Electronics",
        isRecommendedPersonal: true,
        isRecommendedCompany: false
    },
    {
        id: 6,
        name: "Executive Office Desk",
        description: "Spacious L-shaped desk with built-in cable management. Scratch-resistant surface.",
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800",
        personalPrice: 450,
        companyPrice: 380,
        category: "Furniture",
        isRecommendedPersonal: false,
        isRecommendedCompany: true
    }
];
