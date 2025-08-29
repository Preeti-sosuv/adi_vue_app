import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  email: string;
  token: string;
  loginTime: number;
  expiry?: string;
  orgId?: number;
  deptId?: number;
  permissions?: any[];
  userFunctionEntitlements?: Record<string, any>;
}

interface LoginApiResult {
  default_dept: number;
  expiry: string;
  default_org: number;
  permissions: any[];
  user_function_entitlements: Record<string, any>;
  org_id: number;
  dept_id: number;
  last_org: number;
  token: string;
  org_mask: number;
  last_dept: number;
  dept_mask: number;
  system_style: string;
}

interface LoginResponse {
  result?: LoginApiResult;
  error?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const isAuthenticated = computed(() => !!user.value?.token);
  const userEmail = computed(() => user.value?.email || '');

  // Initialize auth state from sessionStorage
  const initializeAuth = () => {
    try {
      const token = sessionStorage.getItem('askai_token');
      if (token) {
        // Create minimal user object with token
        user.value = {
          email: '', // Will be set when we have user info
          token,
          loginTime: Date.now()
        };
      }
    } catch (error) {
      console.error('Failed to initialize auth from sessionStorage:', error);
      clearAuth();
    }
  };

  // Login function
  const login = async (email: string): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('http://34.69.208.233:8040/proxy/user_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: email
        })
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }

      const data: LoginResponse = await response.json();
      
      // Handle the actual API response format
      if (!data.result || !data.result.token) {
        throw new Error(data.error || 'Login failed - no token received');
      }

      const result = data.result;
      
      // Create user object with all relevant data from API response
      const userData: User = {
        email,
        token: result.token,
        loginTime: Date.now(),
        expiry: result.expiry,
        orgId: result.org_id,
        deptId: result.dept_id,
        permissions: result.permissions,
        userFunctionEntitlements: result.user_function_entitlements
      };

      // Save to state and sessionStorage
      user.value = userData;
      sessionStorage.setItem('askai_token', result.token);

      console.log('Login successful:', { email, token: result.token.substring(0, 10) + '...' });
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown login error';
      error.value = errorMessage;
      console.error('Login error:', errorMessage);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Set token directly (for external login handling)
  const setToken = (token: string) => {
    user.value = {
      email: '',
      token,
      loginTime: Date.now()
    };
    sessionStorage.setItem('askai_token', token);
  };

  // Logout function
  const logout = () => {
    user.value = null;
    sessionStorage.removeItem('askai_token');
    error.value = null;
    console.log('User logged out successfully');
  };

  // Clear auth state
  const clearAuth = () => {
    user.value = null;
    sessionStorage.removeItem('askai_token');
    error.value = null;
  };

  // Get current token
  const getToken = (): string => {
    return user.value?.token || '';
  };

  // Check if session is valid with expiration logic
  const isSessionValid = (): boolean => {
    if (!user.value) return false;
    
    // Check if token has expired based on API response
    if (user.value.expiry) {
      const expiryTime = new Date(user.value.expiry).getTime();
      const currentTime = Date.now();
      
      if (currentTime >= expiryTime) {
        console.log('Token has expired, clearing session');
        clearAuth();
        return false;
      }
    }
    
    return true;
  };

  return {
    // State
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Getters
    isAuthenticated,
    userEmail,
    
    // Actions
    initializeAuth,
    login,
    setToken,
    logout,
    clearAuth,
    getToken,
    isSessionValid
  };
});
