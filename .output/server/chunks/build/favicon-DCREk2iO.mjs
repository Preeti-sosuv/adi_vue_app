import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const isAuthenticated = computed(() => !!user.value?.token);
  const userEmail = computed(() => user.value?.email || "");
  const initializeAuth = () => {
    try {
      const token = sessionStorage.getItem("askai_token");
      if (token) {
        user.value = {
          email: "",
          // Will be set when we have user info
          token,
          loginTime: Date.now()
        };
      }
    } catch (error2) {
      console.error("Failed to initialize auth from sessionStorage:", error2);
      clearAuth();
    }
  };
  const login = async (email) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetch("http://34.69.208.233:8040/proxy/user_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: email
        })
      });
      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.result || !data.result.token) {
        throw new Error(data.error || "Login failed - no token received");
      }
      const result = data.result;
      const userData = {
        email,
        token: result.token,
        loginTime: Date.now(),
        expiry: result.expiry,
        orgId: result.org_id,
        deptId: result.dept_id,
        permissions: result.permissions,
        userFunctionEntitlements: result.user_function_entitlements
      };
      user.value = userData;
      sessionStorage.setItem("askai_token", result.token);
      console.log("Login successful:", { email, token: result.token.substring(0, 10) + "..." });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown login error";
      error.value = errorMessage;
      console.error("Login error:", errorMessage);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  const setToken = (token) => {
    user.value = {
      email: "",
      token,
      loginTime: Date.now()
    };
    sessionStorage.setItem("askai_token", token);
  };
  const logout = () => {
    user.value = null;
    sessionStorage.removeItem("askai_token");
    error.value = null;
    console.log("User logged out successfully");
  };
  const clearAuth = () => {
    user.value = null;
    sessionStorage.removeItem("askai_token");
    error.value = null;
  };
  const getToken = () => {
    return user.value?.token || "";
  };
  const isSessionValid = () => {
    if (!user.value) return false;
    if (user.value.expiry) {
      const expiryTime = new Date(user.value.expiry).getTime();
      const currentTime = Date.now();
      if (currentTime >= expiryTime) {
        console.log("Token has expired, clearing session");
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
const _imports_0 = "" + __buildAssetsURL("favicon.CZBj4eNF.png");

export { _imports_0 as _, useAuthStore as u };
//# sourceMappingURL=favicon-DCREk2iO.mjs.map
