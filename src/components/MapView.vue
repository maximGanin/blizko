<script setup lang="ts">
import * as L from 'leaflet'
import 'leaflet.markercluster'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { chains, type ChainFilterValue } from '../data/chains'
import { stores } from '../data/stores'
import type { CategoryStats, StoreCategoryStat } from '../lib/savings'
import { savingsLabel } from '../lib/format'
import StoreDetailCard from './StoreDetailCard.vue'

const props = defineProps<{
  stats: CategoryStats
  chainFilter: ChainFilterValue
  selectedStoreId: string | null
  selectedStat: StoreCategoryStat | null
}>()

const emit = defineEmits<{ select: [string]; clear: [] }>()

const mapEl = ref<HTMLDivElement | null>(null)
const map = shallowRef<L.Map | null>(null)
const markers = new Map<string, L.Marker>()
const savingsByMarker = new WeakMap<L.Marker, number>()
let clusterGroup: L.MarkerClusterGroup | null = null
let markerLayer: L.LayerGroup | null = null

function tooltipHtml(stat: StoreCategoryStat): string {
  return `<strong>${chains[stat.store.chain].name} · ${savingsLabel(stat.savingsPct)}</strong><span>${stat.store.address}</span>`
}

function stateClass(stat: StoreCategoryStat): string {
  if (stat.savingsPct > 0.5) return 'is-cheap'
  if (stat.savingsPct < -0.5) return 'is-pricey'
  return ''
}

function markerHtml(stat: StoreCategoryStat): string {
  return `<div class="store-marker ${stateClass(stat)}" data-chain="${stat.store.chain}">
    <span class="store-marker__bubble">
      <span class="store-marker__chain">${chains[stat.store.chain].initial}</span>
      <span class="store-marker__value">${savingsLabel(stat.savingsPct)}</span>
    </span>
  </div>`
}

function createIcon(stat: StoreCategoryStat): L.DivIcon {
  return L.divIcon({
    className: 'blizko-marker',
    html: markerHtml(stat),
    iconSize: [86, 44],
    iconAnchor: [43, 42],
  })
}

function ariaLabel(stat: StoreCategoryStat): string {
  return `${chains[stat.store.chain].name}, ${stat.store.address}: ${savingsLabel(stat.savingsPct)} относительно средней «Пятёрочки»`
}

function currentStat(storeId: string): StoreCategoryStat | undefined {
  return props.stats.stores.find((entry) => entry.store.id === storeId)
}

function clusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  const children = cluster.getAllChildMarkers()
  const average = children.length
    ? Math.round(
        children.reduce((sum, marker) => sum + (savingsByMarker.get(marker) ?? 0), 0) /
          children.length,
      )
    : 0
  const state = average > 0.5 ? 'is-cheap' : average < -0.5 ? 'is-pricey' : ''

  return L.divIcon({
    className: 'blizko-cluster-icon',
    html: `<div class="blizko-cluster ${state}">
      <span class="blizko-cluster__count">${cluster.getChildCount()}</span>
      <span class="blizko-cluster__savings">${savingsLabel(average)}</span>
    </div>`,
    iconSize: [62, 62],
    iconAnchor: [31, 31],
  })
}

function attachA11y(element: HTMLElement, storeId: string) {
  if (element.dataset.blizkoA11y === 'true') return
  element.dataset.blizkoA11y = 'true'
  element.setAttribute('role', 'button')
  element.setAttribute('tabindex', '0')
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      emit('select', storeId)
    }
  })
}

function updateMarker(stat: StoreCategoryStat) {
  const marker = markers.get(stat.store.id)
  if (!marker) return

  const dimmed = props.chainFilter !== 'all' && stat.store.chain !== props.chainFilter
  savingsByMarker.set(marker, stat.savingsPct)

  const element = marker.getElement()
  if (element) {
    const root = element.querySelector<HTMLElement>('.store-marker')
    if (root) {
      root.classList.toggle('is-cheap', stat.savingsPct > 0.5)
      root.classList.toggle('is-pricey', stat.savingsPct < -0.5)
      root.classList.toggle('is-selected', stat.store.id === props.selectedStoreId)
      root.classList.toggle('is-dimmed', dimmed)
      const value = root.querySelector<HTMLElement>('.store-marker__value')
      if (value) value.textContent = savingsLabel(stat.savingsPct)
    }
    element.style.pointerEvents = dimmed ? 'none' : ''
    element.setAttribute('aria-label', ariaLabel(stat))
    attachA11y(element, stat.store.id)
  } else {
    /* Маркер сейчас внутри кластера — обновляем иконку для будущего показа. */
    marker.setIcon(createIcon(stat))
  }

  marker.setZIndexOffset(stat.store.id === props.selectedStoreId ? 1200 : 0)
  marker.setTooltipContent(tooltipHtml(stat))
}

function updateAllMarkers() {
  for (const stat of props.stats.stores) updateMarker(stat)
}

/** В фильтре по сети показываем только маркеры этой сети — в том числе внутри кластеров. */
function syncMarkerLayer() {
  const layer = markerLayer
  if (!layer) return

  layer.clearLayers()
  const visibleStats =
    props.chainFilter === 'all'
      ? props.stats.stores
      : props.stats.stores.filter((stat) => stat.store.chain === props.chainFilter)

  for (const stat of visibleStats) {
    const marker = markers.get(stat.store.id)
    if (marker) layer.addLayer(marker)
  }
}

onMounted(() => {
  if (!mapEl.value) return

  const instance = L.map(mapEl.value, {
    center: [55.74, 37.62],
    zoom: 10,
    minZoom: 9,
    maxZoom: 16,
    zoomControl: false,
    attributionControl: true,
    zoomSnap: 0.5,
    wheelPxPerZoomLevel: 110,
    maxBounds: L.latLngBounds([55.2, 36.4], [56.2, 38.9]),
    maxBoundsViscosity: 0.6,
  })

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(instance)

  instance.attributionControl.setPrefix(false)
  L.control.zoom({
    position: 'topright',
    zoomInTitle: 'Приблизить',
    zoomOutTitle: 'Отдалить',
  }).addTo(instance)

  const useClusters = window.matchMedia('(max-width: 1023px)').matches
  const layer: L.LayerGroup = useClusters
    ? L.markerClusterGroup({
        maxClusterRadius: (_zoom: number) => (window.innerHeight < 720 ? 64 : 110),
        disableClusteringAtZoom: 13,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true,
        animate: true,
        iconCreateFunction: clusterIcon,
      })
    : L.layerGroup()

  clusterGroup = useClusters ? (layer as L.MarkerClusterGroup) : null
  markerLayer = layer
  layer.addTo(instance)

  for (const stat of props.stats.stores) {
    const marker = L.marker(stat.store.coords, {
      icon: createIcon(stat),
      keyboard: false,
      riseOnHover: true,
    })

    marker.bindTooltip(tooltipHtml(stat), {
      direction: 'top',
      offset: [0, -40],
      opacity: 1,
      className: 'blizko-tooltip',
    })

    marker.on('click', () => emit('select', stat.store.id))
    savingsByMarker.set(marker, stat.savingsPct)
    marker.on('add', () => {
      const current = currentStat(stat.store.id)
      if (current) updateMarker(current)
    })
    markers.set(stat.store.id, marker)
    layer.addLayer(marker)
  }

  instance.on('click', () => emit('clear'))
  map.value = instance

  updateAllMarkers()
  clusterGroup?.refreshClusters()

  const bounds = L.latLngBounds(stores.map((store) => store.coords))
  instance.fitBounds(bounds, {
    paddingTopLeft: useClusters ? [24, 26] : [42, 52],
    paddingBottomRight: useClusters ? [24, 36] : [42, 64],
    maxZoom: 12,
  })

  window.setTimeout(() => instance.invalidateSize(), 200)
})

watch(
  () => props.stats,
  () => {
    updateAllMarkers()
    clusterGroup?.refreshClusters()
  },
)

watch(
  () => props.chainFilter,
  () => {
    syncMarkerLayer()
    updateAllMarkers()
    clusterGroup?.refreshClusters()
  },
)

watch(
  () => props.selectedStoreId,
  () => updateAllMarkers(),
)

watch(
  () => props.selectedStoreId,
  (storeId) => {
    const instance = map.value
    if (!instance || !storeId) return
    const stat = props.stats.stores.find((entry) => entry.store.id === storeId)
    if (!stat) return

    const isMobile = window.matchMedia('(max-width: 1023px)').matches
    const zoom = Math.max(instance.getZoom(), isMobile ? 13 : 12)
    const point = instance.project(L.latLng(stat.store.coords), zoom)
    point.y += isMobile ? 56 : 26
    instance.once('moveend', () => updateAllMarkers())
    instance.flyTo(instance.unproject(point, zoom), zoom, {
      duration: 0.7,
      easeLinearity: 0.3,
    })
  },
)

onBeforeUnmount(() => {
  map.value?.remove()
  map.value = null
  markers.clear()
  markerLayer = null
  clusterGroup = null
})
</script>

<template>
  <div class="map">
    <div ref="mapEl" class="map__canvas" role="region" aria-label="Карта магазинов Москвы" />

    <div class="map__legend" aria-hidden="true">
      <span class="map__legend-title">Сравнение с «Пятёрочкой»</span>
      <span class="map__legend-item">
        <span class="map__legend-pill is-cheap">−22%</span>
        <span>дешевле</span>
      </span>
      <span class="map__legend-item">
        <span class="map__legend-pill">+3%</span>
        <span>дороже</span>
      </span>
      <span class="map__legend-chains">
        <span><i :style="{ background: chains.chizhik.color }" />Чижик</span>
        <span><i :style="{ background: chains.pyaterochka.color }" />Пятёрочка</span>
      </span>
    </div>

    <Transition name="detail-panel">
      <div v-if="selectedStat" class="map__detail">
        <StoreDetailCard
          :stat="selectedStat"
          :category-label="stats.category.label"
          @close="emit('clear')"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.map {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  background: #e8eee1;
}

.map__canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.map__legend {
  position: absolute;
  z-index: 900;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 11px 12px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 12px 30px -20px rgba(11, 42, 27, 0.4);
  backdrop-filter: blur(12px);
  pointer-events: none;
}

.map__legend-title {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 1px;
}

.map__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 600;
  color: var(--ink-2);
}

.map__legend-pill {
  display: inline-grid;
  place-items: center;
  min-width: 40px;
  height: 19px;
  padding: 0 6px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: #fff;
  color: var(--ink);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: -0.02em;
  box-shadow: 0 2px 5px rgba(11, 42, 27, 0.06);
}

.map__legend-pill.is-cheap {
  border-color: transparent;
  background: var(--green-deep);
  color: #fff;
}

.map__legend-chains {
  display: flex;
  gap: 9px;
  margin-top: 2px;
  padding-top: 6px;
  border-top: 1px solid var(--line);
  font-size: 9px;
  font-weight: 700;
  color: var(--ink-2);
}

.map__legend-chains span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.map__legend-chains i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.map__detail {
  position: absolute;
  z-index: 950;
  left: 16px;
  bottom: 16px;
  width: min(356px, calc(100% - 32px));
}

.detail-panel-enter-active,
.detail-panel-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.detail-panel-enter-from,
.detail-panel-leave-to {
  opacity: 0;
  transform: translateY(14px);
}

@media (max-width: 1023px) {
  .map__legend,
  .map__detail {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .detail-panel-enter-active,
  .detail-panel-leave-active {
    transition: none;
  }
}
</style>
