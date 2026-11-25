export type ChainId = 'chizhik' | 'pyaterochka'
export type ChainFilterValue = 'all' | ChainId

export interface Chain {
  id: ChainId
  name: string
  genitive: string
  initial: string
  color: string
}

export const chains: Record<ChainId, Chain> = {
  chizhik: {
    id: 'chizhik',
    name: 'Чижик',
    genitive: 'Чижика',
    initial: 'Ч',
    color: '#12643f',
  },
  pyaterochka: {
    id: 'pyaterochka',
    name: 'Пятёрочка',
    genitive: 'Пятёрочки',
    initial: 'П',
    color: '#d9542f',
  },
}
