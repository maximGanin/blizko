import type { ChainId } from './chains'

export type CategoryId =
  | 'cheese'
  | 'dairy'
  | 'bread'
  | 'meat'
  | 'produce'
  | 'grocery'
  | 'drinks'
  | 'frozen'
  | 'sweets'
  | 'household'

export interface CategoryItem {
  name: string
  unit: string
  prices: Record<ChainId, number>
}

export interface Category {
  id: CategoryId
  label: string
  description: string
  icon: string
  items: CategoryItem[]
}

export const categories: Category[] = [
  {
    id: 'cheese',
    label: 'Сыр',
    description: 'Твёрдые, мягкие и творожные',
    icon: 'cheese',
    items: [
      { name: 'Сыр «Российский»', unit: '1 кг', prices: { chizhik: 649, pyaterochka: 849 } },
      { name: 'Моцарелла', unit: '250 г', prices: { chizhik: 159, pyaterochka: 209 } },
      { name: 'Пармезан', unit: '200 г', prices: { chizhik: 289, pyaterochka: 379 } },
      { name: 'Сыр творожный', unit: '200 г', prices: { chizhik: 139, pyaterochka: 179 } },
    ],
  },
  {
    id: 'dairy',
    label: 'Молоко',
    description: 'Молоко, кефир, яйца и творог',
    icon: 'milk',
    items: [
      { name: 'Молоко 2,5%', unit: '1 л', prices: { chizhik: 69, pyaterochka: 89 } },
      { name: 'Кефир 1%', unit: '900 мл', prices: { chizhik: 74, pyaterochka: 95 } },
      { name: 'Яйца С1', unit: '10 шт.', prices: { chizhik: 99, pyaterochka: 129 } },
      { name: 'Творог 5%', unit: '200 г', prices: { chizhik: 89, pyaterochka: 115 } },
    ],
  },
  {
    id: 'bread',
    label: 'Хлеб',
    description: 'Хлеб, батоны и выпечка',
    icon: 'bread',
    items: [
      { name: 'Хлеб пшеничный', unit: '400 г', prices: { chizhik: 39, pyaterochka: 55 } },
      { name: 'Батон нарезной', unit: '400 г', prices: { chizhik: 42, pyaterochka: 59 } },
      { name: 'Круассан с начинкой', unit: '75 г', prices: { chizhik: 29, pyaterochka: 39 } },
      { name: 'Лаваш тонкий', unit: '250 г', prices: { chizhik: 49, pyaterochka: 69 } },
    ],
  },
  {
    id: 'meat',
    label: 'Мясо',
    description: 'Птица, фарш и сосиски',
    icon: 'meat',
    items: [
      { name: 'Грудка куриная', unit: '1 кг', prices: { chizhik: 349, pyaterochka: 449 } },
      { name: 'Фарш свино-говяжий', unit: '500 г', prices: { chizhik: 219, pyaterochka: 279 } },
      { name: 'Сосиски сливочные', unit: '400 г', prices: { chizhik: 169, pyaterochka: 219 } },
      { name: 'Бедро куриное', unit: '1 кг', prices: { chizhik: 269, pyaterochka: 349 } },
    ],
  },
  {
    id: 'produce',
    label: 'Овощи и фрукты',
    description: 'Свежие овощи и фрукты',
    icon: 'produce',
    items: [
      { name: 'Яблоки', unit: '1 кг', prices: { chizhik: 99, pyaterochka: 139 } },
      { name: 'Помидоры', unit: '1 кг', prices: { chizhik: 169, pyaterochka: 229 } },
      { name: 'Картофель', unit: '1 кг', prices: { chizhik: 39, pyaterochka: 59 } },
      { name: 'Бананы', unit: '1 кг', prices: { chizhik: 89, pyaterochka: 119 } },
    ],
  },
  {
    id: 'grocery',
    label: 'Бакалея',
    description: 'Рис, макароны, сахар, масло',
    icon: 'grocery',
    items: [
      { name: 'Рис длиннозёрный', unit: '900 г', prices: { chizhik: 109, pyaterochka: 139 } },
      { name: 'Макароны', unit: '450 г', prices: { chizhik: 69, pyaterochka: 89 } },
      { name: 'Сахар', unit: '1 кг', prices: { chizhik: 69, pyaterochka: 85 } },
      { name: 'Масло подсолнечное', unit: '1 л', prices: { chizhik: 119, pyaterochka: 149 } },
    ],
  },
  {
    id: 'drinks',
    label: 'Напитки',
    description: 'Вода, соки, чай и кофе',
    icon: 'drinks',
    items: [
      { name: 'Вода питьевая', unit: '1,5 л', prices: { chizhik: 29, pyaterochka: 42 } },
      { name: 'Сок апельсиновый', unit: '1 л', prices: { chizhik: 89, pyaterochka: 119 } },
      { name: 'Кофе растворимый', unit: '100 г', prices: { chizhik: 299, pyaterochka: 379 } },
      { name: 'Чай чёрный', unit: '25 пак.', prices: { chizhik: 79, pyaterochka: 99 } },
    ],
  },
  {
    id: 'frozen',
    label: 'Заморозка',
    description: 'Пельмени, овощи, мороженое',
    icon: 'frozen',
    items: [
      { name: 'Пельмени', unit: '800 г', prices: { chizhik: 299, pyaterochka: 389 } },
      { name: 'Мороженое пломбир', unit: '400 г', prices: { chizhik: 199, pyaterochka: 259 } },
      { name: 'Овощная смесь', unit: '400 г', prices: { chizhik: 99, pyaterochka: 129 } },
      { name: 'Блинчики с творогом', unit: '300 г', prices: { chizhik: 149, pyaterochka: 189 } },
    ],
  },
  {
    id: 'sweets',
    label: 'Сладости',
    description: 'Шоколад, печенье, конфеты',
    icon: 'sweets',
    items: [
      { name: 'Шоколад молочный', unit: '90 г', prices: { chizhik: 99, pyaterochka: 129 } },
      { name: 'Печенье сдобное', unit: '300 г', prices: { chizhik: 89, pyaterochka: 119 } },
      { name: 'Конфеты шоколадные', unit: '250 г', prices: { chizhik: 169, pyaterochka: 219 } },
      { name: 'Зефир', unit: '250 г', prices: { chizhik: 119, pyaterochka: 149 } },
    ],
  },
  {
    id: 'household',
    label: 'Бытовая химия',
    description: 'Стирка, посуда и гигиена',
    icon: 'household',
    items: [
      { name: 'Гель для стирки', unit: '1,3 л', prices: { chizhik: 549, pyaterochka: 699 } },
      { name: 'Средство для посуды', unit: '500 мл', prices: { chizhik: 149, pyaterochka: 189 } },
      { name: 'Туалетная бумага', unit: '8 рул.', prices: { chizhik: 269, pyaterochka: 339 } },
      { name: 'Зубная паста', unit: '100 мл', prices: { chizhik: 129, pyaterochka: 169 } },
    ],
  },
]

export const categoryById = new Map(categories.map((category) => [category.id, category]))
