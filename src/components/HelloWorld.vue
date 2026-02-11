<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>

<template>
  <div class="hello-world">
    <h2>{{ message || 'Hello World!' }}</h2>
    <p>Welcome to the Telegram Mini Apps Vue Template.</p>
  </div>
</template>

<style scoped>
.hello-world {
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  background: var(--tg-theme-secondary-bg-color, #f0f0f0);
}

.hello-world h2 {
  margin: 0 0 0.5rem 0;
  color: var(--tg-theme-text-color, #333);
}

.hello-world p {
  margin: 0;
  color: var(--tg-theme-hint-color, #666);
}
</style>
