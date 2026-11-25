<script setup lang="ts">
import { Info, MapPin } from 'lucide-vue-next'

defineEmits<{ info: [] }>()
</script>

<template>
  <header class="header">
    <a class="brand" href="/" aria-label="Близко — на главную">
      <span class="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <rect width="64" height="64" rx="18" fill="currentColor" />
          <path
            d="M32 12.5c-8.6 0-15.5 6.8-15.5 15.2 0 11.3 15.5 22.4 15.5 22.4s15.5-11.1 15.5-22.4c0-8.4-6.9-15.2-15.5-15.2Z"
            fill="#ddf36c"
          />
          <circle cx="32" cy="27.6" r="5.6" fill="#0b2a1b" />
        </svg>
      </span>
      <span class="brand__text">
        <span class="brand__name">Близко</span>
        <span class="brand__tag">карта выгодных покупок</span>
      </span>
    </a>

    <div class="header__right">
      <button class="how" type="button" aria-label="Как считаем выгоду" @click="$emit('info')">
        <Info :size="16" :stroke-width="2" aria-hidden="true" />
        <span>Как считаем</span>
      </button>
      <div class="city" aria-label="Город: Москва, 15 точек">
        <MapPin :size="16" :stroke-width="2.1" aria-hidden="true" />
        <span class="city__name">Москва</span>
        <span class="city__divider" aria-hidden="true" />
        <span class="city__count">15 точек</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: var(--header-h);
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 26px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
  border-radius: 14px;
}

.brand__mark {
  width: 42px;
  height: 42px;
  color: var(--forest);
  filter: drop-shadow(0 8px 14px rgba(11, 42, 27, 0.2));
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.brand:hover .brand__mark {
  transform: rotate(-6deg) scale(1.04);
}

.brand__mark svg {
  width: 100%;
  height: 100%;
}

.brand__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand__name {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--ink);
}

.brand__tag {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.header__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.how {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 40px;
  padding: 0 15px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.66);
  color: var(--ink-2);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.how:hover {
  background: var(--surface);
  color: var(--ink);
  border-color: var(--line-strong);
}

.city {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  background: var(--forest);
  color: #fff;
  box-shadow: 0 10px 22px -12px rgba(11, 42, 27, 0.7);
}

.city svg {
  color: var(--lime);
}

.city__name {
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.city__divider {
  width: 1px;
  height: 14px;
  background: rgba(255, 255, 255, 0.2);
}

.city__count {
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.62);
}

@media (max-width: 1023px) {
  .header {
    height: 64px;
    padding: 0 14px;
  }

  .brand {
    gap: 9px;
  }

  .brand__mark {
    width: 34px;
    height: 34px;
  }

  .brand__name {
    font-size: 18px;
  }

  .brand__tag {
    display: none;
  }

  .how {
    width: 40px;
    height: 40px;
    padding: 0;
    justify-content: center;
  }

  .how span {
    display: none;
  }

  .city {
    height: 40px;
    padding: 0 13px;
    gap: 6px;
  }

  .city__divider,
  .city__count {
    display: none;
  }

  .city__name {
    font-size: 12.5px;
  }
}

</style>
