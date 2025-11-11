/* exported dishes */
"use strict";

const dishes = [
  // Супы
  {
    keyword: 'soup_of_day',
    name: 'Суп дня',
    price: 250,
    category: 'soup',
    kind: 'veg',
    count: '300 мл',
    image: 'image/daysup.jpg'
  },
  {
    keyword: 'tom_yan',
    name: 'Том ян',
    price: 365,
    category: 'soup',
    kind: 'meat',
    count: '350 мл',
    image: 'image/tomyan.jpg'
  },
  {
    keyword: 'north_soup',
    name: 'Норвежский суп',
    price: 470,
    category: 'soup',
    kind: 'fish',
    count: '350 мл',
    image: 'image/northsup.jpg'
  },
  {
    keyword: 'borshch',
    name: 'Борщ',
    price: 300,
    category: 'soup',
    kind: 'meat',
    count: '350 мл',
    image: 'image/borch.jpg'
  },
  {
    keyword: 'gazpacho',
    name: 'Гаспачо',
    price: 280,
    category: 'soup',
    kind: 'veg',
    count: '300 мл',
    image: 'image/gaspacho.jpg'
  },
  {
    keyword: 'fish_soup',
    name: 'Рыбный суп',
    price: 400,
    category: 'soup',
    kind: 'fish',
    count: '350 мл',
    image: 'image/fish_soup.jpg'
  },

  // Главные блюда
  {
    keyword: 'potato_with_chicken',
    name: 'Жареная картошка с курицей',
    price: 400,
    category: 'main',
    kind: 'meat',
    count: '350 г',
    image: 'image/potatotowithchicken.jpg'
  },
  {
    keyword: 'kotleta_with_pure',
    name: 'Котлеты с картофельным пюре',
    price: 500,
    category: 'main',
    kind: 'meat',
    count: '400 г',
    image: 'image/kotletapure.jpg'
  },
  {
    keyword: 'shaurma',
    name: 'Шаурма',
    price: 100,
    category: 'main',
    kind: 'meat',
    count: '300 г',
    image: 'image/shaurma.jpg'
  },
  {
    keyword: 'fish_steak',
    name: 'Стейк из лосося',
    price: 550,
    category: 'main',
    kind: 'fish',
    count: '250 г',
    image: 'image/losos_steyk.jpg'
  },
  {
    keyword: 'veg_pasta',
    name: 'Паста с овощами',
    price: 350,
    category: 'main',
    kind: 'veg',
    count: '300 г',
    image: 'image/pasta_ovosh.jpg'
  },
  {
    keyword: 'fish_potato',
    name: 'Рыба с картофелем',
    price: 450,
    category: 'main',
    kind: 'fish',
    count: '300 г',
    image: 'image/fish_potato.jpg'
  },

  // Напитки
  {
    keyword: 'orange_juice',
    name: 'Апельсиновый сок',
    price: 120,
    category: 'drink',
    kind: 'cold',
    count: '300 мл',
    image: 'image/oringejuce.jpg'
  },
  {
    keyword: 'apple_juice',
    name: 'Яблочный сок',
    price: 90,
    category: 'drink',
    kind: 'cold',
    count: '300 мл',
    image: 'image/applejuce.jpg'
  },
  {
    keyword: 'carrot_juice',
    name: 'Морковный сок',
    price: 110,
    category: 'drink',
    kind: 'cold',
    count: '300 мл',
    image: 'image/carrotjuce.jpg'
  },
  {
    keyword: 'green_tea',
    name: 'Зелёный чай',
    price: 80,
    category: 'drink',
    kind: 'hot',
    count: '200 мл',
    image: 'image/green_tea.jpg'
  },
  {
    keyword: 'coffee',
    name: 'Кофе',
    price: 100,
    category: 'drink',
    kind: 'hot',
    count: '200 мл',
    image: 'image/coffee.jpg'
  },
  {
    keyword: 'hot_chocolate',
    name: 'Горячий шоколад',
    price: 120,
    category: 'drink',
    kind: 'hot',
    count: '250 мл',
    image: 'image/hot_choco.jpg'
  },

  // Салаты и стартеры
  {
    keyword: 'ceasar_salad',
    name: 'Цезарь с курицей',
    price: 350,
    category: 'salads',
    kind: 'meat',
    count: '250 г',
    image: 'image/zezar.jpg'
  },
  {
    keyword: 'greek_salad',
    name: 'Греческий салат',
    price: 300,
    category: 'salads',
    kind: 'veg',
    count: '200 г',
    image: 'image/greece_salat.jpg'
  },
  {
    keyword: 'shrimp_salad',
    name: 'Салат с креветками',
    price: 450,
    category: 'salads',
    kind: 'fish',
    count: '220 г',
    image: 'image/krevetka_salat.jpg'
  },
  {
    keyword: 'caprese',
    name: 'Капрезе',
    price: 320,
    category: 'salads',
    kind: 'veg',
    count: '200 г',
    image: 'image/kapreze.jpg'
  },
  {
    keyword: 'vegan_salad',
    name: 'Веганский салат',
    price: 300,
    category: 'salads',
    kind: 'veg',
    count: '250 г',
    image: 'image/vegan_salat.jpg'
  },
  {
    keyword: 'starter_mix',
    name: 'Микс стартеров',
    price: 400,
    category: 'salads',
    kind: 'veg',
    count: '200 г',
    image: 'image/mix_starter.jpg'
  },

  // Десерты
  {
    keyword: 'small_cake',
    name: 'Маленький торт',
    price: 150,
    category: 'desserts',
    kind: 'small',
    count: '100 г',
    image: 'image/small_tort.jpg'
  },
  {
    keyword: 'medium_cake',
    name: 'Средний торт',
    price: 250,
    category: 'desserts',
    kind: 'medium',
    count: '200 г',
    image: 'image/medium_tort.jpg'
  },
  {
    keyword: 'large_cake',
    name: 'Большой торт',
    price: 400,
    category: 'desserts',
    kind: 'large',
    count: '400 г',
    image: 'image/bir_tort.jpg'
  },
  {
    keyword: 'chocolate_mousse',
    name: 'Шоколадный мусс',
    price: 200,
    category: 'desserts',
    kind: 'small',
    count: '100 г',
    image: 'image/choco_muss.jpg'
  },
  {
    keyword: 'fruit_tart',
    name: 'Фруктовый тарт',
    price: 220,
    category: 'desserts',
    kind: 'medium',
    count: '150 г',
    image: 'image/fruit_tart.jpg'
  },
  {
    keyword: 'creme_brulee',
    name: 'Крем-брюле',
    price: 250,
    category: 'desserts',
    kind: 'small',
    count: '120 г',
    image: 'image/brule.jpg'
  }
];
