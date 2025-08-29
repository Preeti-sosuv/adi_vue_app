<template>
  <Login 
    @loginSuccess="handleLoginSuccess"
    @loginError="handleLoginError"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../components/Login.vue';

const router = useRouter();
const authStore = useAuthStore();

// Redirect if already authenticated
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});

const handleLoginSuccess = (token: string) => {
  // Update auth store with the token
  authStore.setToken(token);
  // Redirect to main app on successful login
  router.push('/');
};

const handleLoginError = (error: string) => {
  console.error('Login failed:', error);
  // Error handling is already done in the Login component
};
</script>
