export interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    personalPrice: number;
    companyPrice: number;
    category: string;
}

export const products: Product[] = [
    {
        id: 1,
        name: "Premium Ergonomic Chair",
        description: "Ultimate comfort for long working hours. Breathable mesh and lumbar support.",
        image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800",
        personalPrice: 350,
        companyPrice: 280,
        category: "Furniture"
    },
    {
        id: 2,
        name: "4K Ultra-Wide Monitor",
        description: "Crystal clear display for multitasking professionals. 144Hz refresh rate.",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800",
        personalPrice: 600,
        companyPrice: 520,
        category: "Electronics"
    },
    {
        id: 3,
        name: "Smart Standing Desk",
        description: "Dual-motor electric standing desk with memory presets.",
        image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=800",
        personalPrice: 450,
        companyPrice: 380,
        category: "Furniture"
    },
    {
        id: 4,
        name: "Noise Cancelling Headphones",
        description: "Industry-leading noise cancellation for focus in any environment.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        personalPrice: 250,
        companyPrice: 200,
        category: "Electronics"
    },
    {
        id: 5,
        name: "Mechanical Keyboard",
        description: "Tactile switches with customizable RGB lighting. Durable aluminum frame.",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&q=80&w=800",
        personalPrice: 150,
        companyPrice: 120,
        category: "Accessories"
    },
    {
        id: 6,
        name: "Office Coffee Machine",
        description: "Bean-to-cup coffee machine for high-quality espresso at work.",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
        personalPrice: 800,
        companyPrice: 650,
        category: "Appliances"
    }
];
