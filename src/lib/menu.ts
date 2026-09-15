export type Size = { id: string; name: string; price: number };
export type Addon = { id: string; name: string; price: number; img: string; for: string[] };
export type MenuItem = {
  id: string;
  cat: Category;
  name: string;
  desc: string;
  price: number;
  img: string;
  hero?: boolean;
  tags?: string[];
  sizes?: Size[];
  imgs?: Record<string, string>;
};

export const CATS = ["Lunch", "Maggi & More", "Snacks", "Beverages"] as const;
export type Category = (typeof CATS)[number];

export const ADDONS: Record<string, Addon> = {
  cheese: {
    id: "cheese",
    name: "Cheese",
    price: 20,
    img: "/food/cheese.png",
    for: ["sandwich", "maggi"],
  },
  schezwan: {
    id: "schezwan",
    name: "Schezwan sauce",
    price: 20,
    img: "/food/schezwan.png",
    for: ["sandwich", "maggi"],
  },
  masala: {
    id: "masala",
    name: "Double masala",
    price: 10,
    img: "/food/double-masala.png",
    for: ["maggi"],
  },
};

export const MENU: MenuItem[] = [
  {
    id: "veg-meals",
    cat: "Lunch",
    name: "Meals (Veg)",
    desc: "Homely thali · rice, dal, curry, curd",
    price: 100,
    img: "/food/veg-meals.png",
    hero: true,
  },
  {
    id: "chicken-curry",
    cat: "Lunch",
    name: "Chicken Curry",
    desc: "Full or half plate",
    price: 80,
    img: "/food/chicken-curry.png",
    sizes: [
      { id: "full", name: "Full", price: 80 },
      { id: "half", name: "Half", price: 60 },
    ],
  },
  {
    id: "egg-curry",
    cat: "Lunch",
    name: "Egg Curry",
    desc: "Home-style gravy",
    price: 40,
    img: "/food/egg-curry.png",
  },
  {
    id: "veg-curry",
    cat: "Lunch",
    name: "Curries (separately)",
    desc: "Extra curry bowl",
    price: 30,
    img: "/food/veg-curry.png",
  },
  {
    id: "omelette",
    cat: "Lunch",
    name: "Omelette",
    desc: "Single egg",
    price: 20,
    img: "/food/omelette.png",
  },
  {
    id: "double-omelette",
    cat: "Lunch",
    name: "Double Egg Omelette",
    desc: "Two eggs",
    price: 40,
    img: "/food/double-omelette.png",
  },
  {
    id: "egg-burji",
    cat: "Lunch",
    name: "Egg Burji",
    desc: "Two eggs, spicy scramble",
    price: 40,
    img: "/food/egg-burji.png",
  },
  {
    id: "chapati",
    cat: "Lunch",
    name: "Chapati (2 pcs)",
    desc: "Soft wheat rotis",
    price: 30,
    img: "/food/chapati.png",
  },
  {
    id: "veg-maggi",
    cat: "Maggi & More",
    name: "Veg Maggi",
    desc: "Masala noodles",
    price: 40,
    img: "/food/veg-maggi.png",
    hero: true,
    tags: ["maggi"],
  },
  {
    id: "egg-maggi",
    cat: "Maggi & More",
    name: "Egg Maggi",
    desc: "Noodles with egg",
    price: 50,
    img: "/food/egg-maggi.png",
    tags: ["maggi"],
  },
  {
    id: "onion-pakoda",
    cat: "Maggi & More",
    name: "Onion Pakoda",
    desc: "Crispy fritters",
    price: 35,
    img: "/food/onion-pakoda.png",
  },
  {
    id: "mirchi-bajji",
    cat: "Maggi & More",
    name: "Mirchi Bajji",
    desc: "Stuffed chilli fry",
    price: 35,
    img: "/food/mirchi-bajji.png",
  },
  {
    id: "bread-pakoda",
    cat: "Maggi & More",
    name: "Bread Pakoda",
    desc: "Stuffed fried bread",
    price: 40,
    img: "/food/bread-pakoda.png",
  },
  {
    id: "egg-bajji",
    cat: "Maggi & More",
    name: "Egg Bajji",
    desc: "Batter-fried egg",
    price: 40,
    img: "/food/egg-bajji.png",
  },
  {
    id: "maggi-omelette",
    cat: "Maggi & More",
    name: "Omelette",
    desc: "Single egg",
    price: 20,
    img: "/food/omelette.png",
  },
  {
    id: "maggi-double-omelette",
    cat: "Maggi & More",
    name: "Double Egg Omelette",
    desc: "Two eggs",
    price: 40,
    img: "/food/double-omelette.png",
  },
  {
    id: "masala-omelette",
    cat: "Maggi & More",
    name: "Masala Omelette",
    desc: "Two eggs, chilli onion",
    price: 50,
    img: "/food/masala-omelette.png",
  },
  {
    id: "bread-omelette",
    cat: "Maggi & More",
    name: "Bread Omelette",
    desc: "Two eggs on toast",
    price: 40,
    img: "/food/bread-omelette.png",
  },
  {
    id: "samosa",
    cat: "Snacks",
    name: "Samosa",
    desc: "Spiced potato filling",
    price: 20,
    img: "/food/samosa.png",
    hero: true,
  },
  {
    id: "egg-puff",
    cat: "Snacks",
    name: "Egg Puff",
    desc: "Flaky bakery puff",
    price: 25,
    img: "/food/egg-puff.png",
  },
  {
    id: "veg-sandwich",
    cat: "Snacks",
    name: "Veg Sandwich",
    desc: "Cold or grill",
    price: 60,
    img: "/food/veg-sandwich-cold.png",
    tags: ["sandwich"],
    sizes: [
      { id: "cold", name: "Cold", price: 60 },
      { id: "grill", name: "Grill", price: 80 },
    ],
    imgs: {
      cold: "/food/veg-sandwich-cold.png",
      grill: "/food/veg-sandwich-grill.png",
    },
  },
  {
    id: "chicken-sandwich",
    cat: "Snacks",
    name: "Chicken Sandwich",
    desc: "Cold or grill",
    price: 80,
    img: "/food/chicken-sandwich-cold.png",
    tags: ["sandwich"],
    sizes: [
      { id: "cold", name: "Cold", price: 80 },
      { id: "grill", name: "Grill", price: 100 },
    ],
    imgs: {
      cold: "/food/chicken-sandwich-cold.png",
      grill: "/food/chicken-sandwich-grill.png",
    },
  },
  {
    id: "tea",
    cat: "Beverages",
    name: "Tea",
    desc: "Hot · clay cup",
    price: 20,
    img: "/food/tea.png",
    hero: true,
  },
  {
    id: "black-coffee",
    cat: "Beverages",
    name: "Black Coffee",
    desc: "Hot",
    price: 20,
    img: "/food/black-coffee.png",
  },
  {
    id: "coffee",
    cat: "Beverages",
    name: "Coffee",
    desc: "Hot filter coffee",
    price: 25,
    img: "/food/coffee.png",
  },
  {
    id: "iced-tea",
    cat: "Beverages",
    name: "Iced Lemon Tea",
    desc: "Cold",
    price: 25,
    img: "/food/iced-tea.png",
  },
  {
    id: "cold-coffee",
    cat: "Beverages",
    name: "Cold Coffee",
    desc: "Frappe style",
    price: 40,
    img: "/food/cold-coffee.png",
  },
  {
    id: "lassi",
    cat: "Beverages",
    name: "Sweet Lassi",
    desc: "Cold yogurt drink",
    price: 35,
    img: "/food/lassi.png",
  },
];

export const SLOTS = ["12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "6:30 PM", "7:00 PM"];

export function itemById(id: string) {
  return MENU.find((i) => i.id === id);
}

export function addonsFor(item: MenuItem) {
  const tags = item.tags ?? [];
  return Object.values(ADDONS).filter((a) => a.for.some((t) => tags.includes(t)));
}
