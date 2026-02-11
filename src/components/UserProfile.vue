<script setup lang="ts">
import { computed } from 'vue';
import { initData, useSignal } from '@tma.js/sdk-vue';

const initDataRef = useSignal(initData.state);

const user = computed(() => initDataRef.value?.user);

const displayName = computed(() => {
  if (!user.value) return null;
  const { first_name, last_name } = user.value;
  return last_name ? `${first_name} ${last_name}` : first_name;
});

const initials = computed(() => {
  if (!user.value) return '?';
  const { first_name, last_name } = user.value;
  const first = first_name?.charAt(0) || '';
  const last = last_name?.charAt(0) || '';
  return (first + last).toUpperCase() || '?';
});

// Generate a gradient based on the user ID
const avatarGradient = computed(() => {
  if (!user.value) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  const id = user.value.id;
  const hue1 = (id % 360);
  const hue2 = (hue1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 55%) 0%, hsl(${hue2}, 70%, 45%) 100%)`;
});
</script>

<template>
  <div class="user-profile">
    <div v-if="user" class="user-profile__card">
      <div class="user-profile__avatar-container">
        <div
          v-if="user.photo_url"
          class="user-profile__avatar"
          :style="{ backgroundImage: `url(${user.photo_url})` }"
        />
        <div
          v-else
          class="user-profile__avatar user-profile__avatar--initials"
          :style="{ background: avatarGradient }"
        >
          {{ initials }}
        </div>
        <div v-if="user.is_premium" class="user-profile__premium-badge" title="Telegram Premium">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </div>
      </div>

      <div class="user-profile__info">
        <h3 class="user-profile__name">
          {{ displayName }}
        </h3>
        <span v-if="user.username" class="user-profile__username">
          @{{ user.username }}
        </span>
        <div class="user-profile__meta">
          <span class="user-profile__id">ID: {{ user.id }}</span>
          <span v-if="user.language_code" class="user-profile__lang">
            {{ user.language_code.toUpperCase() }}
          </span>
        </div>
      </div>

      <div v-if="user.is_premium" class="user-profile__premium-tag">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
        Premium
      </div>
    </div>

    <div v-else class="user-profile__empty">
      <div class="user-profile__empty-icon">👤</div>
      <p>User information not available</p>
    </div>
  </div>
</template>

<style scoped>
.user-profile {
  margin: 1rem 0;
}

.user-profile__card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 16px;
  overflow: hidden;
}

.user-profile__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    135deg,
    var(--tg-theme-button-color, #3390ec) 0%,
    var(--tg-theme-accent-text-color, #5a9cf8) 100%
  );
  opacity: 0.15;
}

.user-profile__avatar-container {
  position: relative;
  z-index: 1;
  margin-bottom: 0.75rem;
}

.user-profile__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 3px solid var(--tg-theme-bg-color, #fff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-profile__avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.user-profile__premium-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--tg-theme-bg-color, #fff);
  box-shadow: 0 2px 6px rgba(255, 170, 0, 0.4);
}

.user-profile__premium-badge svg {
  width: 14px;
  height: 14px;
  color: #fff;
}

.user-profile__info {
  position: relative;
  z-index: 1;
  text-align: center;
}

.user-profile__name {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000);
}

.user-profile__username {
  display: block;
  font-size: 0.9rem;
  color: var(--tg-theme-link-color, #3390ec);
  margin-bottom: 0.5rem;
}

.user-profile__meta {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.user-profile__id,
.user-profile__lang {
  font-size: 0.75rem;
  color: var(--tg-theme-hint-color, #999);
  background: var(--tg-theme-bg-color, #fff);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.user-profile__premium-tag {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.6rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(255, 170, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-profile__premium-tag svg {
  flex-shrink: 0;
}

.user-profile__empty {
  text-align: center;
  padding: 2rem 1rem;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 16px;
  color: var(--tg-theme-hint-color, #999);
}

.user-profile__empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.user-profile__empty p {
  margin: 0;
  font-size: 0.9rem;
}
</style>
