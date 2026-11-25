import type { ChainId } from './chains'

export interface Store {
  id: string
  chain: ChainId
  address: string
  district: string
  hours: string
  coords: [number, number]
  features: string[]
}

/**
 * Реальные адреса магазинов в Москве.
 * Координаты — по данным OpenStreetMap / Photon.
 */
export const stores: Store[] = [
  {
    id: 'chizhik-profsoyuznaya',
    chain: 'chizhik',
    address: 'Профсоюзная ул., 152, к2',
    district: 'Тёплый Стан',
    hours: '09:00–21:00',
    coords: [55.62256, 37.50551],
    features: ['у метро', 'парковка'],
  },
  {
    id: 'chizhik-chertanovo',
    chain: 'chizhik',
    address: 'Чертановская ул., 66, к3',
    district: 'Чертаново Южное',
    hours: '09:00–21:00',
    coords: [55.59653, 37.58385],
    features: ['у метро', 'первая линия'],
  },
  {
    id: 'chizhik-volgogradsky',
    chain: 'chizhik',
    address: 'Волгоградский просп., 4А',
    district: 'Таганский',
    hours: '09:00–22:00',
    coords: [55.73127, 37.67049],
    features: ['у метро', 'первая линия'],
  },
  {
    id: 'chizhik-ryazansky',
    chain: 'chizhik',
    address: 'Рязанский просп., 2/1, к2',
    district: 'Нижегородский',
    hours: '09:00–21:00',
    coords: [55.72879, 37.73726],
    features: ['ТЦ', 'парковка'],
  },
  {
    id: 'chizhik-sokolniki',
    chain: 'chizhik',
    address: 'Сокольническая пл., 9',
    district: 'Сокольники',
    hours: '09:00–21:00',
    coords: [55.79036, 37.68036],
    features: ['у метро', 'у парка'],
  },
  {
    id: 'chizhik-yaroslavskoe',
    chain: 'chizhik',
    address: 'Ярославское ш., 30',
    district: 'Ярославский',
    hours: '09:00–21:00',
    coords: [55.8611, 37.69514],
    features: ['парковка', 'первая линия'],
  },
  {
    id: 'chizhik-yablochkova',
    chain: 'chizhik',
    address: 'ул. Яблочкова, 21Д',
    district: 'Бутырский',
    hours: '09:00–21:00',
    coords: [55.81983, 37.57798],
    features: ['парковка', 'у метро'],
  },
  {
    id: 'chizhik-mnevniki',
    chain: 'chizhik',
    address: 'ул. Мнёвники, 7, к1',
    district: 'Хорошёво-Мнёвники',
    hours: '09:00–21:00',
    coords: [55.77176, 37.49415],
    features: ['у метро', 'парковка'],
  },
  {
    id: 'pyat-halturina',
    chain: 'pyaterochka',
    address: 'Халтуринская ул., 15',
    district: 'Преображенское',
    hours: '08:00–23:00',
    coords: [55.80295, 37.72598],
    features: ['у метро', 'первая линия'],
  },
  {
    id: 'pyat-yaroslavskoe',
    chain: 'pyaterochka',
    address: 'Ярославское ш., 111',
    district: 'Ярославский',
    hours: '08:00–23:00',
    coords: [55.87023, 37.70941],
    features: ['парковка', 'первая линия'],
  },
  {
    id: 'pyat-dmitrovskoe',
    chain: 'pyaterochka',
    address: 'Дмитровское ш., 43, к1',
    district: 'Тимирязевский',
    hours: '08:00–23:00',
    coords: [55.83351, 37.5717],
    features: ['у метро', 'ТЦ'],
  },
  {
    id: 'pyat-mitino',
    chain: 'pyaterochka',
    address: 'Митинская ул., 17',
    district: 'Митино',
    hours: 'круглосуточно',
    coords: [55.84241, 37.36786],
    features: ['у метро', 'круглосуточно'],
  },
  {
    id: 'pyat-vernadskogo',
    chain: 'pyaterochka',
    address: 'просп. Вернадского, 93',
    district: 'Проспект Вернадского',
    hours: '08:00–23:00',
    coords: [55.66753, 37.4969],
    features: ['у метро', 'первая линия'],
  },
  {
    id: 'pyat-kashirskoe',
    chain: 'pyaterochka',
    address: 'Каширское ш., 42, к1',
    district: 'Москворечье-Сабурово',
    hours: '08:00–23:00',
    coords: [55.64865, 37.66219],
    features: ['у метро', 'парковка'],
  },
  {
    id: 'pyat-krasnoproletarskaya',
    chain: 'pyaterochka',
    address: 'Краснопролетарская ул., 16, с1',
    district: 'Тверской',
    hours: '08:00–23:00',
    coords: [55.77689, 37.60726],
    features: ['в центре', 'у метро'],
  },
]
