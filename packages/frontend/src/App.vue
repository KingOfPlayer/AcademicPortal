<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="bg-[#1e9d4c] p-4 flex space-x-4">
    <RouterLink 
      to="/" 
      class="text-white hover:bg-white hover:text-[#1e9d4c] px-3 py-2 rounded transition-colors duration-200"
    >
      Home
    </RouterLink>
    <RouterLink 
      to="/about" 
      class="text-white hover:bg-white hover:text-[#1e9d4c] px-3 py-2 rounded transition-colors duration-200"
    >
      About
    </RouterLink>
  </nav>

  <RouterView />
</template>
