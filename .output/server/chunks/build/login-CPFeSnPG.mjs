import { defineComponent, mergeProps, ref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { u as useAuthStore, _ as _imports_0 } from './favicon-DCREk2iO.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'pinia';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Login",
  __ssrInlineRender: true,
  emits: ["loginSuccess", "loginError"],
  setup(__props, { emit: __emit }) {
    const email = ref("");
    const loading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-container" }, _attrs))} data-v-0c6ceb9a><div class="login-card" data-v-0c6ceb9a><div class="login-header" data-v-0c6ceb9a><div class="logo" data-v-0c6ceb9a><img${ssrRenderAttr("src", _imports_0)} alt="AI Assistant" width="48" height="48" data-v-0c6ceb9a></div><h1 class="login-title" data-v-0c6ceb9a>Welcome Back</h1><p class="login-subtitle" data-v-0c6ceb9a>Sign in to continue to AI Assistant</p></div><form class="login-form" data-v-0c6ceb9a><div class="form-group" data-v-0c6ceb9a><label for="email" class="form-label" data-v-0c6ceb9a>Email Address</label><input id="email"${ssrRenderAttr("value", email.value)} type="email" class="form-input" placeholder="Enter your email address" required${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} autofocus data-v-0c6ceb9a></div><div class="form-group" data-v-0c6ceb9a><label for="password" class="form-label" data-v-0c6ceb9a>Password</label><input id="password" type="password" class="form-input disabled" placeholder="Password authentication disabled" disabled data-v-0c6ceb9a><p class="password-note" data-v-0c6ceb9a>Password authentication is currently disabled</p></div>`);
      if (error.value) {
        _push(`<div class="error-message" data-v-0c6ceb9a><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-0c6ceb9a><circle cx="12" cy="12" r="10" data-v-0c6ceb9a></circle><line x1="12" y1="8" x2="12" y2="12" data-v-0c6ceb9a></line><line x1="12" y1="16" x2="12.01" y2="16" data-v-0c6ceb9a></line></svg> ${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="login-button"${ssrIncludeBooleanAttr(loading.value || !email.value.trim()) ? " disabled" : ""} data-v-0c6ceb9a>`);
      if (!loading.value) {
        _push(`<span data-v-0c6ceb9a>Sign In</span>`);
      } else {
        _push(`<span class="loading-content" data-v-0c6ceb9a><svg class="loading-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-0c6ceb9a><path d="M21 12a9 9 0 11-6.219-8.56" data-v-0c6ceb9a></path></svg> Signing In... </span>`);
      }
      _push(`</button></form><div class="login-footer" data-v-0c6ceb9a><p class="footer-text" data-v-0c6ceb9a> Having trouble? Contact your administrator for assistance. </p></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Login.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Login = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-0c6ceb9a"]]), { __name: "Login" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const authStore = useAuthStore();
    const handleLoginSuccess = (token) => {
      authStore.setToken(token);
      router.push("/");
    };
    const handleLoginError = (error) => {
      console.error("Login failed:", error);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(Login, mergeProps({
        onLoginSuccess: handleLoginSuccess,
        onLoginError: handleLoginError
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-CPFeSnPG.mjs.map
