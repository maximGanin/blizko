<script setup lang="ts">
import { Calculator, Map, ShoppingBasket, X } from 'lucide-vue-next'
import { ref, watch } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)

watch(
  () => props.open,
  (open) => {
    const element = dialog.value
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
  },
)

function close() {
  emit('close')
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <dialog ref="dialog" class="info" @close="close" @click="onBackdropClick">
    <div class="info__card">
      <header class="info__head">
        <span class="info__eyebrow">О проекте</span>
        <button class="info__close" type="button" aria-label="Закрыть" @click="close">
          <X :size="18" :stroke-width="2.2" aria-hidden="true" />
        </button>
      </header>

      <h2 class="info__title">Как мы считаем выгоду</h2>
      <p class="info__lead">
        «Близко» показывает, где привычная продуктовая корзина стоит дешевле средней цены
        в Пятёрочке — магазине, который чаще всего оказывается по соседству.
      </p>

      <ol class="steps">
        <li class="step">
          <span class="step__icon" aria-hidden="true"><ShoppingBasket :size="19" :stroke-width="1.9" /></span>
          <div>
            <h3 class="step__title">Собираем корзину</h3>
            <p class="step__text">
              В каждой категории — четыре типовых товара. Складываем их стоимость отдельно
              для Чижика и Пятёрочки.
            </p>
          </div>
        </li>
        <li class="step">
          <span class="step__icon" aria-hidden="true"><Calculator :size="19" :stroke-width="1.9" /></span>
          <div>
            <h3 class="step__title">Учитываем точку и акции</h3>
            <p class="step__text">
              К цене каждой точки применяем локальную вариацию и скидки. Затем сравниваем
              со средней корзиной Пятёрочки по Москве.
            </p>
          </div>
        </li>
        <li class="step">
          <span class="step__icon" aria-hidden="true"><Map :size="19" :stroke-width="1.9" /></span>
          <div>
            <h3 class="step__title">Показываем на карте</h3>
            <p class="step__text">
              Минус в зелёной метке — экономия, плюс в светлой — переплата. Выберите сеть,
              чтобы оставить на карте только её точки.
            </p>
          </div>
        </li>
      </ol>

      <p class="info__note">
        Адреса магазинов — реальные точки в Москве из открытых картографических данных.
        Цены, акции и проценты — демонстрационные и не являются офертой.
      </p>

      <div class="info__footer">
        <span>Близко · демо-проект</span>
        <span>Москва · 2026</span>
      </div>

      <button class="info__done" type="button" @click="close">Понятно</button>
    </div>
  </dialog>
</template>

<style scoped>
.info {
  width: min(560px, calc(100vw - 28px));
  max-height: 88dvh;
  padding: 0;
  border: none;
  border-radius: 28px;
  background: transparent;
  overflow: hidden;
  color: var(--ink);
}

.info::backdrop {
  background: rgba(11, 42, 27, 0.52);
  backdrop-filter: blur(9px);
}

.info[open] {
  animation: modal-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.info__card {
  max-height: 88dvh;
  overflow-y: auto;
  padding: 26px 26px 22px;
  border-radius: 28px;
  background:
    radial-gradient(90% 60% at 100% 0%, rgba(221, 243, 108, 0.32), transparent 60%),
    var(--surface);
}

.info__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info__eyebrow {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--green-deep);
}

.info__close {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  margin: -4px -4px 0 0;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--surface);
  color: var(--ink-2);
  transition: background 0.18s ease;
}

.info__close:hover {
  background: var(--surface-2);
}

.info__title {
  margin: 12px 0 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.08;
  color: var(--ink);
}

.info__lead {
  margin: 9px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--ink-2);
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.step {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
}

.step__icon {
  flex: none;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: var(--mint);
  color: var(--green-deep);
}

.step__title {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.015em;
}

.step__text {
  margin: 3px 0 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--ink-2);
}

.info__note {
  margin: 16px 0 0;
  padding: 11px 13px;
  border-radius: 13px;
  background: var(--surface-2);
  font-size: 10.5px;
  line-height: 1.5;
  color: var(--ink-3);
}

.info__footer {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.info__done {
  position: sticky;
  bottom: 0;
  z-index: 2;
  width: 100%;
  height: 44px;
  margin-top: 14px;
  border: none;
  border-radius: 13px;
  background: var(--forest);
  color: #fff;
  font: inherit;
  font-size: 12.5px;
  font-weight: 700;
  transition: background 0.18s ease;
}

.info__done:hover {
  background: #123a26;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.975);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 600px) {
  .info__card {
    padding: 20px 16px 16px;
  }

  .info__title {
    font-size: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .info[open] {
    animation: none;
  }
}
</style>
