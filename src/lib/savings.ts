import { categoryById, type Category, type CategoryId } from '../data/categories'
import type { ChainId } from '../data/chains'
import { stores, type Store } from '../data/stores'

export interface ProductPrice {
  name: string
  unit: string
  price: number
  /** Средняя цена товара в точках Пятёрочки — база для сравнения. */
  baselinePrice: number
}

export interface StoreCategoryStat {
  store: Store
  price: number
  baselinePrice: number
  savingsPct: number
  savingsRub: number
  promoPct: number
  items: ProductPrice[]
}

export interface CategoryStats {
  category: Category
  stores: StoreCategoryStat[]
  /** Средняя стоимость корзины в Пятёрочке — опорная цена. */
  baselinePrice: number
  chainAverage: Record<ChainId, number>
  cheaperChain: ChainId
  cheaperChainSavingsPct: number
}

/** Детерминированный псевдослучайный хеш — данные стабильны между перезагрузками. */
function hash(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

function storeVariance(storeId: string, categoryId: string): number {
  return 0.958 + hash(`${storeId}|${categoryId}|variance`) * 0.084
}

function storePromo(storeId: string, categoryId: string, chain: ChainId): number {
  const roll = hash(`${storeId}|${categoryId}|promo`)
  const threshold = chain === 'chizhik' ? 0.87 : 0.66
  if (roll < threshold) return 0
  const t = (roll - threshold) / (1 - threshold)
  return 0.05 + t * 0.07
}

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

const cache = new Map<CategoryId, CategoryStats>()

export function getCategoryStats(categoryId: CategoryId): CategoryStats {
  const cached = cache.get(categoryId)
  if (cached) return cached

  const category = categoryById.get(categoryId)
  if (!category) throw new Error(`Unknown category: ${categoryId}`)

  const baseEntries = stores.map((store) => {
    const variance = storeVariance(store.id, categoryId)
    const promoPct = storePromo(store.id, categoryId, store.chain)
    const items = category.items.map((item) => ({
      name: item.name,
      unit: item.unit,
      price: Math.round(item.prices[store.chain] * variance * (1 - promoPct)),
    }))
    const price = items.reduce((sum, item) => sum + item.price, 0)
    return { store, price, promoPct, items }
  })

  const byChain = (chain: ChainId) =>
    baseEntries.filter((entry) => entry.store.chain === chain).map((entry) => entry.price)

  const chainAverage = {
    chizhik: Math.round(mean(byChain('chizhik'))),
    pyaterochka: Math.round(mean(byChain('pyaterochka'))),
  }

  const baselinePrice = chainAverage.pyaterochka

  /* Средняя цена каждого товара в Пятёрочке — база для сравнения. */
  const itemBaseline = category.items.map((_, index) => {
    const prices = baseEntries
      .filter((entry) => entry.store.chain === 'pyaterochka')
      .map((entry) => entry.items[index].price)
    return Math.round(mean(prices))
  })

  const stats: StoreCategoryStat[] = baseEntries
    .map((entry) => ({
      store: entry.store,
      price: entry.price,
      baselinePrice,
      savingsPct: ((baselinePrice - entry.price) / baselinePrice) * 100,
      savingsRub: Math.round(baselinePrice - entry.price),
      promoPct: entry.promoPct,
      items: entry.items.map((item, index) => ({
        ...item,
        baselinePrice: itemBaseline[index],
      })),
    }))
    .sort((a, b) => b.savingsPct - a.savingsPct)

  const cheaperChain: ChainId =
    chainAverage.chizhik <= chainAverage.pyaterochka ? 'chizhik' : 'pyaterochka'
  const cheaperChainSavingsPct =
    ((baselinePrice - chainAverage[cheaperChain]) / baselinePrice) * 100

  const result: CategoryStats = {
    category,
    stores: stats,
    baselinePrice,
    chainAverage,
    cheaperChain,
    cheaperChainSavingsPct,
  }

  cache.set(categoryId, result)
  return result
}

export function statForStore(stats: CategoryStats, storeId: string | null) {
  if (!storeId) return null
  return stats.stores.find((entry) => entry.store.id === storeId) ?? null
}
