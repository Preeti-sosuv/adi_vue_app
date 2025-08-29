<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="logo">
          <img src="/images/favicon.png" alt="AI Assistant" width="48" height="48" />
        </div>
        <h1 class="login-title">Welcome Back</h1>
        <p class="login-subtitle">Sign in to continue to AI Assistant</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="Enter your email address"
            required
            :disabled="loading"
            autofocus
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            type="password"
            class="form-input disabled"
            placeholder="Password authentication disabled"
            disabled
          />
          <p class="password-note">Password authentication is currently disabled</p>
        </div>

        <div v-if="error" class="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="login-button"
          :disabled="loading || !email.trim()"
        >
          <span v-if="!loading">Sign In</span>
          <span v-else class="loading-content">
            <svg class="loading-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Signing In...
          </span>
        </button>
      </form>

      <!-- Footer -->
      <div class="login-footer">
        <p class="footer-text">
          Having trouble? Contact your administrator for assistance.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Define emits for parent component communication
const emit = defineEmits<{
  loginSuccess: [token: string]
  loginError: [error: string]
}>();

const email = ref('');
const loading = ref(false);
const error = ref('');

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  loading.value = true;
  error.value = '';

  try {
    // Use base URL from environment
    const baseURL = 'http://34.69.208.233:8040/proxy';
    
    console.log('Attempting login with email:', email.value);
    
    const res = await fetch(`${baseURL}/user_login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: email.value })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Login failed: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Login successful');
    
    if (data.result && data.result.token) {
      // Store token in sessionStorage
      sessionStorage.setItem('askai_token', data.result.token);
      
      // Store additional user data if needed
      sessionStorage.setItem('user_data', JSON.stringify({
        email: email.value,
        expiry: data.result.expiry,
        orgId: data.result.org_id,
        deptId: data.result.dept_id,
        permissions: data.result.permissions,
        userFunctionEntitlements: data.result.user_function_entitlements
      }));
      
      emit('loginSuccess', data.result.token);
    } else {
      console.error('No token in response:', data);
      error.value = 'No token received';
      emit('loginError', 'No token received');
    }
  } catch (err) {
    console.error('Login error details:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    error.value = 'Login failed. Please try again.';
    emit('loginError', 'Login failed. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
  padding: 20px;
}

.login-card {
  background: var(--surface-container);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border: 1px solid var(--outline-variant);
  animation: slideIn 0.4s cubic-bezier(0.2, 0.0, 0.38, 0.9);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--on-surface);
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.login-subtitle {
  font-size: 16px;
  color: var(--on-surface-variant);
  margin: 0;
  line-height: 1.4;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface);
  margin-bottom: 4px;
}

.form-input {
  padding: 16px;
  border: 2px solid var(--outline-variant);
  border-radius: 12px;
  font-size: 16px;
  color: var(--on-surface);
  background: var(--surface);
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
  box-sizing: border-box;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-container);
}

.form-input:hover:not(:disabled) {
  border-color: var(--outline);
}

.form-input.disabled {
  background: var(--surface-container-high);
  color: var(--on-surface-variant);
  cursor: not-allowed;
  opacity: 0.6;
}

.password-note {
  font-size: 12px;
  color: var(--on-surface-variant);
  margin: 0;
  font-style: italic;
  opacity: 0.8;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--error-container);
  color: var(--on-error-container);
  border-radius: 12px;
  font-size: 14px;
  border: 1px solid var(--error);
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.login-button {
  background: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
}

.login-button:hover:not(:disabled) {
  background: var(--primary-container);
  color: var(--on-primary-container);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.login-button:disabled {
  background: var(--surface-container-high);
  color: var(--on-surface-variant);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.6;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-footer {
  margin-top: 32px;
  text-align: center;
}

.footer-text {
  font-size: 14px;
  color: var(--on-surface-variant);
  margin: 0;
  line-height: 1.4;
}

/* Responsive design */
@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card {
    padding: 32px 24px;
    border-radius: 20px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .form-input {
    padding: 14px;
  }
  
  .login-button {
    padding: 14px 20px;
  }
}

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  .login-card {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
}
</style>
