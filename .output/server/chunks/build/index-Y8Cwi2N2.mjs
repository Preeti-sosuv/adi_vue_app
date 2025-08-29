import { defineComponent, ref, mergeProps, unref, computed, readonly, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderTeleport, ssrRenderSlot, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { u as useAuthStore, _ as _imports_0 } from './favicon-DCREk2iO.mjs';
import { _ as _export_sfc, b as useRuntimeConfig } from './server.mjs';
import { defineStore } from 'pinia';
import axios from 'axios';
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

const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "UserProfilePopup",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    userEmail: {}
  },
  emits: ["close", "logout", "organizationSelected"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const authStore = useAuthStore();
    const organizations = ref([]);
    const showOrganizationsList = ref(false);
    const loadingOrganizations = ref(false);
    const organizationsError = ref("");
    const selectedOrgId = ref(null);
    const selectedOrganization = ref("");
    const userDisplayEmail = computed(() => {
      return authStore.user?.email || props.userEmail || "user@example.com";
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (_ctx.isOpen) {
          _push2(`<div class="profile-overlay" data-v-e1551940><div class="profile-popup" data-v-e1551940><div class="profile-header" data-v-e1551940><div class="user-info" data-v-e1551940><div class="user-avatar" data-v-e1551940><div class="status-dot online" data-v-e1551940></div></div><div class="user-details" data-v-e1551940><div class="user-name" data-v-e1551940>${ssrInterpolate(userDisplayEmail.value.split("@")[0] || "User")}</div><div class="user-email" data-v-e1551940>${ssrInterpolate(userDisplayEmail.value)}</div><div class="user-role" data-v-e1551940>Engineering Team</div></div></div></div><div class="profile-body" data-v-e1551940><div class="menu-section" data-v-e1551940><div class="menu-item" data-v-e1551940><div class="menu-icon" data-v-e1551940><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e1551940><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" data-v-e1551940></path><circle cx="9" cy="7" r="4" data-v-e1551940></circle><path d="m22 21-3-3m0 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0z" data-v-e1551940></path></svg></div><div class="menu-content" data-v-e1551940><span class="menu-title" data-v-e1551940>Profile Settings</span><span class="menu-subtitle" data-v-e1551940>Manage your account</span></div><div class="menu-arrow" data-v-e1551940><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-v-e1551940><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" data-v-e1551940></path></svg></div></div><div class="${ssrRenderClass([{ "loading": loadingOrganizations.value }, "menu-item"])}" data-v-e1551940><div class="menu-icon" data-v-e1551940>`);
          if (!loadingOrganizations.value) {
            _push2(`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e1551940><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" data-v-e1551940></path><circle cx="9" cy="7" r="4" data-v-e1551940></circle><polyline points="16,11 18,13 22,9" data-v-e1551940></polyline></svg>`);
          } else {
            _push2(`<div class="loading-spinner" data-v-e1551940></div>`);
          }
          _push2(`</div><div class="menu-content" data-v-e1551940><span class="menu-title" data-v-e1551940>Organizations</span><span class="menu-subtitle" data-v-e1551940>${ssrInterpolate(selectedOrganization.value || "Select organization")}</span></div><div class="menu-arrow" data-v-e1551940><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-v-e1551940><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" data-v-e1551940></path></svg></div></div>`);
          if (showOrganizationsList.value) {
            _push2(`<div class="organizations-list" data-v-e1551940><div class="org-header" data-v-e1551940><span class="org-title" data-v-e1551940>Select Organization</span><button class="close-org-btn" data-v-e1551940><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-e1551940><line x1="18" y1="6" x2="6" y2="18" data-v-e1551940></line><line x1="6" y1="6" x2="18" y2="18" data-v-e1551940></line></svg></button></div>`);
            if (organizationsError.value) {
              _push2(`<div class="org-error" data-v-e1551940><p data-v-e1551940>${ssrInterpolate(organizationsError.value)}</p><button class="retry-btn" data-v-e1551940>Retry</button></div>`);
            } else if (organizations.value.length === 0 && !loadingOrganizations.value) {
              _push2(`<div class="org-empty" data-v-e1551940><p data-v-e1551940>No organizations available</p></div>`);
            } else {
              _push2(`<div class="org-items" data-v-e1551940><!--[-->`);
              ssrRenderList(organizations.value, (org) => {
                _push2(`<div class="${ssrRenderClass([{ "selected": selectedOrgId.value === org.org_id }, "org-item"])}" data-v-e1551940><div class="org-info" data-v-e1551940><div class="org-name" data-v-e1551940>${ssrInterpolate(org.name)}</div><div class="org-details" data-v-e1551940>ID: ${ssrInterpolate(org.org_id)}</div></div>`);
                if (selectedOrgId.value === org.org_id) {
                  _push2(`<div class="org-check" data-v-e1551940><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-e1551940><polyline points="20,6 9,17 4,12" data-v-e1551940></polyline></svg></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="menu-item" data-v-e1551940><div class="menu-icon" data-v-e1551940><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e1551940><circle cx="12" cy="12" r="3" data-v-e1551940></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" data-v-e1551940></path></svg></div><div class="menu-content" data-v-e1551940><span class="menu-title" data-v-e1551940>Preferences</span><span class="menu-subtitle" data-v-e1551940>Theme, notifications &amp; more</span></div><div class="menu-arrow" data-v-e1551940><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-v-e1551940><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" data-v-e1551940></path></svg></div></div></div><div class="status-section" data-v-e1551940><div class="status-item" data-v-e1551940><div class="status-indicator" data-v-e1551940><div class="status-dot online" data-v-e1551940></div><span class="status-text" data-v-e1551940>System Status: Online</span></div><div class="status-badge online" data-v-e1551940>Active</div></div></div><div class="actions-section" data-v-e1551940><button class="help-button" data-v-e1551940><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e1551940><circle cx="12" cy="12" r="10" data-v-e1551940></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" data-v-e1551940></path><line x1="12" y1="17" x2="12.01" y2="17" data-v-e1551940></line></svg><span data-v-e1551940>Help &amp; Support</span></button><button class="logout-button" data-v-e1551940><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e1551940><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" data-v-e1551940></path><polyline points="16,17 21,12 16,7" data-v-e1551940></polyline><line x1="21" y1="12" x2="9" y2="12" data-v-e1551940></line></svg><span data-v-e1551940>Sign out</span></button></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserProfilePopup.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const UserProfilePopup = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$8, [["__scopeId", "data-v-e1551940"]]), { __name: "UserProfilePopup" });
const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref("light");
  const initializeTheme = () => {
  };
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
  };
  const setTheme = (theme) => {
    currentTheme.value = theme;
  };
  const isDark = computed(() => currentTheme.value === "dark");
  const isLight = computed(() => currentTheme.value === "light");
  watch(currentTheme, (newTheme) => {
  });
  return {
    // State
    currentTheme: readonly(currentTheme),
    isDark,
    isLight,
    // Actions
    toggleTheme,
    setTheme,
    initializeTheme
  };
});
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "ThemeToggle",
  __ssrInlineRender: true,
  setup(__props) {
    const themeStore = useThemeStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: "theme-toggle",
        title: unref(themeStore).isDark ? "Switch to light mode" : "Switch to dark mode",
        "aria-label": unref(themeStore).isDark ? "Switch to light mode" : "Switch to dark mode"
      }, _attrs))} data-v-8055ec55><div class="toggle-container" data-v-8055ec55>`);
      if (unref(themeStore).isDark) {
        _push(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="theme-icon sun-icon" data-v-8055ec55><circle cx="12" cy="12" r="5" data-v-8055ec55></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" data-v-8055ec55></path></svg>`);
      } else {
        _push(`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="theme-icon moon-icon" data-v-8055ec55><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" data-v-8055ec55></path></svg>`);
      }
      _push(`</div></button>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ThemeToggle.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const ThemeToggle = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$7, [["__scopeId", "data-v-8055ec55"]]), { __name: "ThemeToggle" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  __ssrInlineRender: true,
  emits: ["close"],
  setup(__props) {
    const showProfilePopup = ref(false);
    const activeItem = ref("Ask AI");
    const router = useRouter();
    const authStore = useAuthStore();
    const handleLogout = () => {
      showProfilePopup.value = false;
      authStore.logout();
      router.push("/login");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sidebar" }, _attrs))} data-v-932a18d3><div class="sidebar-header" data-v-932a18d3><div class="logo" data-v-932a18d3><div class="logo-icon" data-v-932a18d3><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" data-v-932a18d3><path d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z" data-v-932a18d3></path></svg></div></div></div><nav class="sidebar-nav" data-v-932a18d3><div class="nav-section" data-v-932a18d3><div class="${ssrRenderClass([{ active: activeItem.value === "Ask AI" }, "nav-item"])}" data-v-932a18d3><div class="nav-icon" data-v-932a18d3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-932a18d3><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" data-v-932a18d3></path><path d="M8 12h8M8 8h8" data-v-932a18d3></path></svg></div><span class="nav-tooltip" data-v-932a18d3>Ask AI</span></div><div class="${ssrRenderClass([{ active: activeItem.value === "Masters" }, "nav-item"])}" data-v-932a18d3><div class="nav-icon" data-v-932a18d3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-932a18d3><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" data-v-932a18d3></path></svg></div><span class="nav-tooltip" data-v-932a18d3>Masters</span></div><div class="${ssrRenderClass([{ active: activeItem.value === "Projects" }, "nav-item"])}" data-v-932a18d3><div class="nav-icon" data-v-932a18d3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-932a18d3><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2l5 0 2 3h9a2 2 0 0 1 2 2z" data-v-932a18d3></path></svg></div><span class="nav-tooltip" data-v-932a18d3>Projects</span></div><div class="${ssrRenderClass([{ active: activeItem.value === "Catalog" }, "nav-item"])}" data-v-932a18d3><div class="nav-icon" data-v-932a18d3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-932a18d3><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-932a18d3></path><polyline points="14,2 14,8 20,8" data-v-932a18d3></polyline></svg></div><span class="nav-tooltip" data-v-932a18d3>Catalog</span></div></div><div class="nav-divider" data-v-932a18d3></div><div class="nav-section" data-v-932a18d3><div class="${ssrRenderClass([{ active: activeItem.value === "Analytics" }, "nav-item"])}" data-v-932a18d3><div class="nav-icon" data-v-932a18d3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-932a18d3><line x1="18" y1="20" x2="18" y2="10" data-v-932a18d3></line><line x1="12" y1="20" x2="12" y2="4" data-v-932a18d3></line><line x1="6" y1="20" x2="6" y2="14" data-v-932a18d3></line></svg></div><span class="nav-tooltip" data-v-932a18d3>Analytics</span></div><div class="${ssrRenderClass([{ active: activeItem.value === "Tasks" }, "nav-item"])}" data-v-932a18d3><div class="nav-icon" data-v-932a18d3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-932a18d3><path d="M9 12l2 2 4-4" data-v-932a18d3></path><rect width="18" height="18" x="3" y="3" rx="2" data-v-932a18d3></rect></svg></div><span class="nav-tooltip" data-v-932a18d3>Tasks</span></div><div class="${ssrRenderClass([{ active: activeItem.value === "Settings" }, "nav-item"])}" data-v-932a18d3><div class="nav-icon" data-v-932a18d3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-932a18d3><circle cx="12" cy="12" r="3" data-v-932a18d3></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" data-v-932a18d3></path></svg></div><span class="nav-tooltip" data-v-932a18d3>Settings</span></div></div></nav><div class="sidebar-footer" data-v-932a18d3><div class="footer-controls" data-v-932a18d3>`);
      _push(ssrRenderComponent(ThemeToggle, null, null, _parent));
      _push(`<div class="user-avatar" data-v-932a18d3><div class="status-indicator online" data-v-932a18d3></div></div></div></div>`);
      _push(ssrRenderComponent(UserProfilePopup, {
        isOpen: showProfilePopup.value,
        userEmail: unref(authStore).userEmail,
        onClose: ($event) => showProfilePopup.value = false,
        onLogout: handleLogout
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$6, [["__scopeId", "data-v-932a18d3"]]), { __name: "Sidebar" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ChatResponse",
  __ssrInlineRender: true,
  props: {
    content: {},
    loading: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const formattedContent = computed(() => {
      if (props.loading || !props.content) return "";
      let content = "";
      const data = props.content;
      if (typeof data === "object" && data !== null) {
        if (data.result) {
          content = data.result;
        } else if (data.message) {
          content = data.message;
        } else if (data.help) {
          content = data.help;
        } else {
          content = JSON.stringify(data, null, 2);
        }
      } else if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          if (parsed.result) {
            content = parsed.result;
          } else {
            content = data;
          }
        } catch {
          content = data;
        }
      } else {
        content = String(data);
      }
      return content.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>').replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>').replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong class="md-bold">$1</strong>').replace(/\*(.*?)\*/g, '<em class="md-italic">$1</em>').replace(/`([^`]+)`/g, '<code class="md-code">$1</code>').replace(/^(\s*)[-•*]\s+(.*$)/gim, (match, indent, text) => {
        const level = Math.floor(indent.length / 2);
        return `<li class="md-li level-${level}">${text}</li>`;
      }).replace(/(<li class="md-li[^>]*>.*?<\/li>[\s\n]*)+/gs, '<ul class="md-ul">$&</ul>').replace(/\n\n/g, '</p><p class="md-p">').replace(/\n/g, "<br>").replace(/^(?!<[hul])/gm, '<p class="md-p">').replace(new RegExp("(?<!>)$", "gm"), "</p>").replace(/<p class="md-p">\s*<\/p>/g, "").replace(/<p class="md-p">\s*(<[hul])/g, "$1").replace(/(<\/[hul][^>]*>)\s*<\/p>/g, "$1");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "chat-response" }, _attrs))} data-v-2dbe5450><div class="ai-avatar" data-v-2dbe5450><img${ssrRenderAttr("src", _imports_0)} alt="AI" width="20" height="20" data-v-2dbe5450></div><div class="ai-text" data-v-2dbe5450>`);
      if (_ctx.loading) {
        _push(`<div class="loading-dots" data-v-2dbe5450><span data-v-2dbe5450></span><span data-v-2dbe5450></span><span data-v-2dbe5450></span></div>`);
      } else {
        _push(`<div class="rich-text-content" data-v-2dbe5450>${formattedContent.value ?? ""}</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatResponse.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$5, [["__scopeId", "data-v-2dbe5450"]]), { __name: "ChatResponse" });
const usePromptListStore = defineStore("promptList", {
  state: () => ({
    prompts: [],
    documents: [],
    selectedDocuments: [],
    showPopover: false,
    showPromptContentModel: false,
    showModelSelection: false,
    selectedModel: "Gemini",
    popoverData: null,
    promptContentData: null,
    loading: false,
    error: null,
    // Pagination state
    currentPage: 1,
    pageSize: 10,
    // Sorting state
    sortField: "name",
    sortDirection: "asc"
  }),
  getters: {
    // Pagination getters
    totalDocuments: (state) => state.documents.length,
    totalPages: (state) => Math.ceil(state.documents.length / state.pageSize),
    startIndex: (state) => (state.currentPage - 1) * state.pageSize,
    endIndex: (state) => Math.min((state.currentPage - 1) * state.pageSize + state.pageSize, state.documents.length),
    // Sorted documents
    sortedDocuments: (state) => {
      const docs = [...state.documents];
      if (state.sortField && docs.length > 0) {
        docs.sort((a, b) => {
          const aVal = a[state.sortField] || "";
          const bVal = b[state.sortField] || "";
          const comparison = String(aVal).localeCompare(String(bVal));
          return state.sortDirection === "asc" ? comparison : -comparison;
        });
      }
      return docs;
    },
    // Paginated documents
    paginatedDocuments: (state) => {
      const docs = [...state.documents];
      if (state.sortField && docs.length > 0) {
        docs.sort((a, b) => {
          const aVal = a[state.sortField] || "";
          const bVal = b[state.sortField] || "";
          const comparison = String(aVal).localeCompare(String(bVal));
          return state.sortDirection === "asc" ? comparison : -comparison;
        });
      }
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = Math.min(startIndex + state.pageSize, docs.length);
      return docs.slice(startIndex, endIndex);
    },
    // Selection getters
    allSelected: (state) => {
      const docs = [...state.documents];
      if (state.sortField && docs.length > 0) {
        docs.sort((a, b) => {
          const aVal = a[state.sortField] || "";
          const bVal = b[state.sortField] || "";
          const comparison = String(aVal).localeCompare(String(bVal));
          return state.sortDirection === "asc" ? comparison : -comparison;
        });
      }
      const startIndex = (state.currentPage - 1) * state.pageSize;
      const endIndex = Math.min(startIndex + state.pageSize, docs.length);
      const pageDocs = docs.slice(startIndex, endIndex);
      return pageDocs.length > 0 && pageDocs.every(
        (doc) => state.selectedDocuments.includes(doc.id || pageDocs.indexOf(doc))
      );
    },
    selectedCount: (state) => state.selectedDocuments.length,
    // Check if data is documents format
    isDocumentsData: (state) => {
      if (!state.promptContentData || typeof state.promptContentData !== "object") return false;
      const data = state.promptContentData;
      if (Array.isArray(data.documents || data.data || data)) return true;
      if (data.document_id || data.result) return true;
      return false;
    }
  },
  actions: {
    // API Actions
    async addToPromptList(payload) {
      const baseURL = "http://34.69.208.233:8040/proxy";
      const response = await axios.post(`${baseURL}/add_to_prompt_list`, payload);
      this.prompts.push(response.data);
      return response.data;
    },
    async getPromptList(baseURL, token) {
      this.loading = true;
      this.error = null;
      try {
        let resolveBaseURL = function(url) {
          if (true) return url;
          try {
            const u = new URL(url);
            if (u.hostname === "0.0.0.0") {
              u.hostname = (void 0).location.hostname || "localhost";
            }
            return u.toString().replace(/\/$/, "");
          } catch {
            return url;
          }
        };
        const headers = { "Content-Type": "application/json" };
        const resolvedBaseURL = resolveBaseURL(baseURL);
        const body = { token };
        console.log("Fetching prompt list:", {
          url: `${resolvedBaseURL}/get_prompt_list`,
          token: token ? token.substring(0, 10) + "..." : "No token"
        });
        const response = await axios.post(`${resolvedBaseURL}/get_prompt_list`, body, { headers });
        const data = response.data;
        let extractedPrompts = [];
        if (!data) {
          console.warn("API returned null/undefined response for getPromptList");
          this.popoverData = [];
          this.showPopover = true;
          return;
        }
        if (data.result && Array.isArray(data.result)) {
          extractedPrompts = data.result.map((item) => item?.prompt || item).filter((p) => typeof p === "string" && p.trim().length > 0);
        } else if (data.prompts && Array.isArray(data.prompts)) {
          extractedPrompts = data.prompts.map((item) => item?.prompt || item).filter((p) => typeof p === "string" && p.trim().length > 0);
        } else if (Array.isArray(data)) {
          extractedPrompts = data.map((item) => item?.prompt || item).filter((p) => typeof p === "string" && p.trim().length > 0);
        }
        extractedPrompts = [...new Set(extractedPrompts)];
        console.log("Extracted prompts:", extractedPrompts);
        this.popoverData = extractedPrompts.length > 0 ? extractedPrompts : data || [];
        this.showPopover = true;
      } catch (error) {
        this.error = "Failed to get prompt list.";
        this.popoverData = {
          error: "Failed to get prompt list.",
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data || error?.message || String(error)
        };
        this.showPopover = true;
      } finally {
        this.loading = false;
      }
    },
    async getDocuments(baseURL, token) {
      this.loading = true;
      this.error = null;
      try {
        let resolveBaseURL = function(url) {
          if (true) return url;
          try {
            const u = new URL(url);
            if (u.hostname === "0.0.0.0") {
              u.hostname = (void 0).location.hostname || "localhost";
            }
            return u.toString().replace(/\/$/, "");
          } catch {
            return url;
          }
        };
        const headers = { "Content-Type": "application/json" };
        headers["token"] = token;
        const resolvedBaseURL = resolveBaseURL(baseURL);
        const body = {
          document_id: null,
          document_status: "Active",
          token
        };
        const response = await axios.post(`${resolvedBaseURL}/get_documents`, body, { headers });
        this.promptContentData = response.data;
        this.showPromptContentModel = true;
        const data = response.data;
        console.log("API Response:", data);
        console.log("Response type:", typeof data);
        console.log("Is array:", Array.isArray(data));
        let extractedDocs = [];
        if (data.result && Array.isArray(data.result) && data.result.length === 2) {
          if (data.result[0] === true && Array.isArray(data.result[1])) {
            extractedDocs = data.result[1];
            console.log("Extracted from result[1] (documents array):", extractedDocs);
          } else if (data.result[1] && !Array.isArray(data.result[1])) {
            extractedDocs = [data.result[1]];
            console.log("Extracted from result[1] (single document):", extractedDocs);
          }
        } else if (data.result && Array.isArray(data.result) && data.result.length > 2) {
          extractedDocs = data.result.slice(1);
          console.log("Extracted from result slice:", extractedDocs);
        } else if (data.result && Array.isArray(data.result)) {
          extractedDocs = data.result;
          console.log("Extracted from result array:", extractedDocs);
        } else if (data.documents && Array.isArray(data.documents)) {
          extractedDocs = data.documents;
          console.log("Extracted from documents array:", extractedDocs);
        } else if (data.data && Array.isArray(data.data)) {
          extractedDocs = data.data;
          console.log("Extracted from data array:", extractedDocs);
        } else if (data.document_id || data.result && !Array.isArray(data.result)) {
          extractedDocs = [data];
          console.log("Extracted as single document:", extractedDocs);
        } else if (Array.isArray(data)) {
          extractedDocs = data;
          console.log("Extracted from direct array:", extractedDocs);
        } else {
          extractedDocs = data.documents || data.data || data || [];
          console.log("Extracted from fallback:", extractedDocs);
        }
        this.documents = extractedDocs.map((doc, index2) => {
          if (typeof doc === "object" && doc !== null) {
            return {
              id: doc.id || doc.document_id || index2,
              document_id: doc.document_id || doc.id || index2,
              dataroom: doc.dataroom || doc.data_room || "-",
              data_room: doc.data_room || doc.dataroom || "-",
              classification: doc.classification || "-",
              name: doc.name || doc.document_id || "-",
              categorisation: doc.categorisation || "-",
              loaded: doc.loaded || doc.pit || doc.email_when || "-",
              source: doc.source || doc.document_source || "-",
              document_source: doc.document_source || doc.source || "-",
              ...doc
              // Include all other properties
            };
          } else {
            return {
              id: index2,
              document_id: index2,
              dataroom: "-",
              data_room: "-",
              classification: "-",
              name: String(doc) || "-",
              categorisation: "-",
              loaded: "-",
              source: "-",
              document_source: "-"
            };
          }
        });
        console.log("Final processed documents:", this.documents);
      } catch (error) {
        this.error = "Failed to get documents.";
        this.promptContentData = {
          error: "Failed to get documents.",
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data || error?.message || String(error)
        };
        this.showPromptContentModel = true;
      } finally {
        this.loading = false;
      }
    },
    async addPromptToBookmark(baseURL, token, inputText) {
      this.loading = true;
      this.error = null;
      try {
        let resolveBaseURL = function(url) {
          if (true) return url;
          try {
            const u = new URL(url);
            if (u.hostname === "0.0.0.0") {
              u.hostname = (void 0).location.hostname || "localhost";
            }
            return u.toString().replace(/\/$/, "");
          } catch {
            return url;
          }
        };
        const headers = { "Content-Type": "application/json" };
        headers["token"] = token;
        const resolvedBaseURL = resolveBaseURL(baseURL);
        const body = {
          prompt: inputText,
          model: "Claude",
          prompt_type: "DOC_SEARCH",
          token
        };
        const response = await axios.post(`${resolvedBaseURL}/add_to_prompt_list`, body, { headers });
        const results = Array.isArray(response.data?.result) ? response.data.result : [];
        const promptsOnly = results.map((item) => item?.prompt).filter((p) => typeof p === "string" && p.trim().length > 0);
        this.popoverData = promptsOnly;
        this.showPopover = true;
      } catch (error) {
        this.error = "Failed to add to prompt list.";
        this.popoverData = {
          error: "Failed to add to prompt list.",
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data || error?.message || String(error)
        };
        this.showPopover = true;
      } finally {
        this.loading = false;
      }
    },
    // UI Actions
    closePopover() {
      this.showPopover = false;
      this.popoverData = null;
    },
    closePromptContentModel() {
      this.showPromptContentModel = false;
      this.promptContentData = null;
    },
    closeModelSelection() {
      this.showModelSelection = false;
    },
    setSelectedModel(model) {
      this.selectedModel = model;
    },
    // Pagination Actions
    setPage(page) {
      this.currentPage = page;
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    // Sorting Actions
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortField = field;
        this.sortDirection = "asc";
      }
    },
    // Selection Actions
    toggleDocument(id) {
      const index2 = this.selectedDocuments.indexOf(id);
      if (index2 > -1) {
        this.selectedDocuments.splice(index2, 1);
      } else {
        this.selectedDocuments.push(id);
      }
      console.log("Selected documents:", this.selectedDocuments);
      console.log("Selected document details:", this.documents.filter(
        (doc) => this.selectedDocuments.includes(doc.id || doc.document_id || 0)
      ));
    },
    toggleAll() {
      const pageDocs = this.paginatedDocuments;
      const pageIds = pageDocs.map((doc) => doc.id || pageDocs.indexOf(doc));
      if (this.allSelected) {
        this.selectedDocuments = this.selectedDocuments.filter((id) => !pageIds.includes(id));
      } else {
        const newSelected = [...this.selectedDocuments];
        pageIds.forEach((id) => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        this.selectedDocuments = newSelected;
      }
    },
    clearSelection() {
      this.selectedDocuments = [];
    },
    // Get selected documents with their details
    getSelectedDocumentDetails() {
      return this.documents.filter(
        (doc) => this.selectedDocuments.includes(doc.id || doc.document_id || 0)
      );
    },
    // Get database documents (dataroom === "database")
    getSelectedDatabaseDocuments() {
      const selectedDocs = this.getSelectedDocumentDetails();
      return selectedDocs.filter((doc) => {
        const dataroom = (doc.dataroom || doc.data_room || "").toLowerCase();
        return dataroom === "database";
      });
    },
    // Get non-database documents
    getSelectedNonDatabaseDocuments() {
      const selectedDocs = this.getSelectedDocumentDetails();
      return selectedDocs.filter((doc) => {
        const dataroom = (doc.dataroom || doc.data_room || "").toLowerCase();
        return dataroom !== "database";
      });
    },
    // Get connection IDs for database documents
    getConnectionIds() {
      const databaseDocs = this.getSelectedDatabaseDocuments();
      return databaseDocs.map((doc) => doc.name).filter((name) => name && name !== "-");
    },
    // Get document IDs for non-database documents
    getDocumentContextIds() {
      const nonDatabaseDocs = this.getSelectedNonDatabaseDocuments();
      return nonDatabaseDocs.map((doc) => doc.id || doc.document_id).filter((id) => id !== void 0);
    },
    // Legacy method - kept for backward compatibility
    getSelectedDatabaseId() {
      const connectionIds = this.getConnectionIds();
      return connectionIds.length > 0 ? connectionIds[0] : "";
    }
  }
});
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Popover",
  __ssrInlineRender: true,
  props: {
    placement: {}
  },
  emits: ["promptSelected"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const store = usePromptListStore();
    ref(null);
    const placement = computed(() => props.placement ?? "bottom");
    const formatted = computed(() => {
      try {
        return JSON.stringify(store.popoverData, null, 2);
      } catch {
        return String(store.popoverData ?? "");
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(store).showPopover) {
          _push2(`<div class="popover-overlay" data-v-a91e74d9><div class="${ssrRenderClass([placement.value, "popover-container"])}" data-v-a91e74d9>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, () => {
            if (unref(store).isDocumentsData) {
              _push2(`<div class="documents-modal" data-v-a91e74d9><div class="modal-header" data-v-a91e74d9><div class="header-info" data-v-a91e74d9><h3 class="modal-title" data-v-a91e74d9>Document Sources</h3><p class="modal-subtitle" data-v-a91e74d9>${ssrInterpolate(unref(store).selectedCount)} of ${ssrInterpolate(unref(store).totalDocuments)} selected</p></div><button class="close-button" data-v-a91e74d9><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-a91e74d9><line x1="18" y1="6" x2="6" y2="18" data-v-a91e74d9></line><line x1="6" y1="6" x2="18" y2="18" data-v-a91e74d9></line></svg></button></div><div class="table-container" data-v-a91e74d9><table class="documents-table" data-v-a91e74d9><thead data-v-a91e74d9><tr data-v-a91e74d9><th class="select-col" data-v-a91e74d9><input type="checkbox"${ssrIncludeBooleanAttr(unref(store).allSelected) ? " checked" : ""} class="select-all-checkbox" data-v-a91e74d9></th><th data-v-a91e74d9>Data Room</th><th data-v-a91e74d9>Classification</th><th class="sortable" data-v-a91e74d9> Name `);
              if (unref(store).sortField === "name") {
                _push2(`<span class="sort-indicator" data-v-a91e74d9>${ssrInterpolate(unref(store).sortDirection === "asc" ? "↑" : "↓")}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</th><th data-v-a91e74d9>Categorisation</th><th data-v-a91e74d9>Loaded</th><th data-v-a91e74d9>Source</th></tr></thead><tbody data-v-a91e74d9><!--[-->`);
              ssrRenderList(unref(store).paginatedDocuments, (doc, index2) => {
                _push2(`<tr data-v-a91e74d9><td data-v-a91e74d9><input type="checkbox"${ssrIncludeBooleanAttr(unref(store).selectedDocuments.includes(doc.id || index2)) ? " checked" : ""} class="document-checkbox" data-v-a91e74d9></td><td data-v-a91e74d9>${ssrInterpolate(doc.data_room || "-")}</td><td data-v-a91e74d9>${ssrInterpolate(doc.classification || "-")}</td><td data-v-a91e74d9>${ssrInterpolate(doc.name || "-")}</td><td data-v-a91e74d9>${ssrInterpolate(doc.categorisation || "-")}</td><td data-v-a91e74d9>${ssrInterpolate(doc.loaded || "-")}</td><td data-v-a91e74d9>${ssrInterpolate(doc.source || "-")}</td></tr>`);
              });
              _push2(`<!--]--></tbody></table></div><div class="pagination" data-v-a91e74d9><div class="pagination-info" data-v-a91e74d9><span data-v-a91e74d9>Page Size: ${ssrInterpolate(unref(store).pageSize)}</span><span data-v-a91e74d9>${ssrInterpolate(unref(store).startIndex + 1)} to ${ssrInterpolate(unref(store).endIndex)} of ${ssrInterpolate(unref(store).totalDocuments)}</span><span data-v-a91e74d9>Page ${ssrInterpolate(unref(store).currentPage)} of ${ssrInterpolate(unref(store).totalPages)}</span></div><div class="pagination-controls" data-v-a91e74d9><button${ssrIncludeBooleanAttr(unref(store).currentPage === 1) ? " disabled" : ""} class="pagination-btn" data-v-a91e74d9> Previous </button><button${ssrIncludeBooleanAttr(unref(store).currentPage === unref(store).totalPages) ? " disabled" : ""} class="pagination-btn" data-v-a91e74d9> Next </button></div></div></div>`);
            } else if (Array.isArray(unref(store).popoverData)) {
              _push2(`<div class="prompt-container" data-v-a91e74d9><div class="prompt-header" data-v-a91e74d9><div class="prompt-info" data-v-a91e74d9><h3 class="prompt-title" data-v-a91e74d9>Bookmark</h3></div><button class="close-button" data-v-a91e74d9><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-a91e74d9><line x1="18" y1="6" x2="6" y2="18" data-v-a91e74d9></line><line x1="6" y1="6" x2="18" y2="18" data-v-a91e74d9></line></svg></button></div><div class="prompt-content" data-v-a91e74d9>`);
              if (unref(store).popoverData && unref(store).popoverData.length > 0) {
                _push2(`<div class="prompt-items" data-v-a91e74d9><!--[-->`);
                ssrRenderList(unref(store).popoverData, (item, idx) => {
                  _push2(`<div class="prompt-item" data-v-a91e74d9><div class="prompt-item-content" data-v-a91e74d9><span class="prompt-text" data-v-a91e74d9>${ssrInterpolate(item)}</span></div></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<div class="no-bookmarks" data-v-a91e74d9><p class="no-bookmarks-text" data-v-a91e74d9>No bookmarks saved yet. Start by bookmarking a question!</p></div>`);
              }
              _push2(`</div></div>`);
            } else if (unref(store).popoverData) {
              _push2(`<div class="error-container" data-v-a91e74d9><div class="error-header" data-v-a91e74d9><div class="error-icon" data-v-a91e74d9><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" data-v-a91e74d9><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" data-v-a91e74d9></path></svg></div><div class="error-info" data-v-a91e74d9><h3 class="error-title" data-v-a91e74d9>Response Data</h3><p class="error-subtitle" data-v-a91e74d9>Raw API response</p></div><button class="close-button" data-v-a91e74d9><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-a91e74d9><line x1="18" y1="6" x2="6" y2="18" data-v-a91e74d9></line><line x1="6" y1="6" x2="18" y2="18" data-v-a91e74d9></line></svg></button></div><div class="error-content" data-v-a91e74d9><pre class="json-preview" data-v-a91e74d9>${ssrInterpolate(formatted.value)}</pre></div></div>`);
            } else {
              _push2(`<!---->`);
            }
          }, _push2, _parent);
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Popover.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-a91e74d9"]]), { __name: "Popover" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "PromptContextModel",
  __ssrInlineRender: true,
  setup(__props) {
    const store = usePromptListStore();
    useAuthStore();
    const searchQuery = ref("");
    const selectedDataRoom = ref("");
    const selectedClassification = ref("");
    ref("");
    ref("");
    const sortField = ref("name");
    const sortDirection = ref("asc");
    const columnFilters = ref({
      dataroom: "",
      classification: "",
      name: "",
      categorisation: "",
      loaded: "",
      source: ""
    });
    const uniqueDataRooms = computed(() => {
      const rooms = store.documents.map((doc) => doc.dataroom || doc.data_room || "").filter(Boolean);
      return [...new Set(rooms)].sort();
    });
    const uniqueClassifications = computed(() => {
      const classifications = store.documents.map((doc) => doc.classification || "").filter(Boolean);
      return [...new Set(classifications)].sort();
    });
    computed(() => {
      const sources = store.documents.map((doc) => doc.source || doc.document_source || "").filter(Boolean);
      return [...new Set(sources)].sort();
    });
    computed(() => {
      const categories = store.documents.map((doc) => doc.categorisation || "").filter(Boolean);
      return [...new Set(categories)].sort();
    });
    const filteredDocuments = computed(() => {
      let docs = [...store.documents];
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        docs = docs.filter(
          (doc) => (doc.name || "").toLowerCase().includes(query) || (doc.dataroom || doc.data_room || "").toLowerCase().includes(query) || (doc.classification || "").toLowerCase().includes(query) || (doc.categorisation || "").toLowerCase().includes(query) || (doc.source || doc.document_source || "").toLowerCase().includes(query)
        );
      }
      if (selectedDataRoom.value) {
        docs = docs.filter(
          (doc) => (doc.dataroom || doc.data_room || "") === selectedDataRoom.value
        );
      }
      if (selectedClassification.value) {
        docs = docs.filter(
          (doc) => (doc.classification || "") === selectedClassification.value
        );
      }
      Object.entries(columnFilters.value).forEach(([field, value]) => {
        if (value) {
          const filterValue = value.toLowerCase();
          docs = docs.filter((doc) => {
            const fieldValue = getFieldValue(doc, field).toLowerCase();
            return fieldValue.includes(filterValue);
          });
        }
      });
      if (sortField.value) {
        docs.sort((a, b) => {
          const aVal = getFieldValue(a, sortField.value);
          const bVal = getFieldValue(b, sortField.value);
          const comparison = aVal.localeCompare(bVal);
          return sortDirection.value === "asc" ? comparison : -comparison;
        });
      }
      return docs;
    });
    const getFieldValue = (doc, field) => {
      switch (field) {
        case "dataroom":
          return doc.dataroom || doc.data_room || "-";
        case "classification":
          return doc.classification || "-";
        case "name":
          return doc.name || doc.document_id || "-";
        case "categorisation":
          return doc.categorisation || "-";
        case "loaded":
          return doc.loaded || doc.pit || doc.email_when || "-";
        case "source":
          return doc.source || doc.document_source || "-";
        default:
          return doc[field] || "-";
      }
    };
    const currentPage = ref(1);
    const pageSize = ref(10);
    const paginatedDocuments = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize.value;
      const endIndex = startIndex + pageSize.value;
      return filteredDocuments.value.slice(startIndex, endIndex);
    });
    const totalPages = computed(() => {
      return Math.ceil(filteredDocuments.value.length / pageSize.value);
    });
    const totalFilteredDocuments = computed(() => filteredDocuments.value.length);
    const hasActiveFilters = computed(() => {
      return searchQuery.value || selectedDataRoom.value || selectedClassification.value || Object.values(columnFilters.value).some((filter) => filter);
    });
    const visiblePageNumbers = computed(() => {
      const pages = [];
      const maxVisible = 5;
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, currentPage.value - half);
      let end = Math.min(totalPages.value, start + maxVisible - 1);
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    });
    watch(() => store.documents, () => {
      currentPage.value = 1;
    });
    const formatted = computed(() => {
      try {
        return JSON.stringify(store.promptContentData, null, 2);
      } catch {
        return String(store.promptContentData ?? "");
      }
    });
    computed(() => {
      if (!store.promptContentData || typeof store.promptContentData !== "object") return {};
      const data = store.promptContentData;
      if (data.result && Array.isArray(data.result) && data.result.length > 1) {
        return data.result[1] || {};
      }
      return data;
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(store).showPromptContentModel) {
          _push2(`<div class="prompt-modal-overlay" data-v-e5028db2><div class="prompt-modal-container" data-v-e5028db2>`);
          if (unref(store).isDocumentsData) {
            _push2(`<div class="documents-modal" data-v-e5028db2><div class="modal-header" data-v-e5028db2><div class="header-content" data-v-e5028db2><div class="header-icon" data-v-e5028db2><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" data-v-e5028db2><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-e5028db2></path><polyline points="14,2 14,8 20,8" fill="none" stroke="white" stroke-width="2" data-v-e5028db2></polyline></svg></div><div class="header-info" data-v-e5028db2><h3 class="modal-title" data-v-e5028db2>Document Sources</h3><p class="modal-subtitle" data-v-e5028db2>${ssrInterpolate(unref(store).selectedCount)} of ${ssrInterpolate(unref(store).totalDocuments)} documents selected</p></div></div><button class="close-button" data-v-e5028db2><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><line x1="18" y1="6" x2="6" y2="18" data-v-e5028db2></line><line x1="6" y1="6" x2="18" y2="18" data-v-e5028db2></line></svg></button></div>`);
            if (unref(store).totalDocuments === 0) {
              _push2(`<div class="no-data" data-v-e5028db2><p data-v-e5028db2>No documents found. Raw API response:</p><pre data-v-e5028db2>${ssrInterpolate(formatted.value)}</pre></div>`);
            } else {
              _push2(`<div class="table-container" data-v-e5028db2><table class="documents-table" data-v-e5028db2><thead data-v-e5028db2><tr data-v-e5028db2><th class="select-col" data-v-e5028db2><input type="checkbox"${ssrIncludeBooleanAttr(unref(store).allSelected) ? " checked" : ""} class="select-all-checkbox" data-v-e5028db2></th><th class="sortable" data-v-e5028db2><div class="column-header" data-v-e5028db2><span data-v-e5028db2>Data Room</span><div class="sort-indicator" data-v-e5028db2>`);
              if (sortField.value === "dataroom") {
                _push2(`<svg class="${ssrRenderClass({ "rotated": sortDirection.value === "desc" })}" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" data-v-e5028db2><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" data-v-e5028db2></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="filter-header" data-v-e5028db2><input${ssrRenderAttr("value", columnFilters.value.dataroom)} type="text" placeholder="Filter data room..." class="filter-input" data-v-e5028db2></div></th><th class="sortable" data-v-e5028db2><div class="column-header" data-v-e5028db2><span data-v-e5028db2>Classification</span><div class="sort-indicator" data-v-e5028db2>`);
              if (sortField.value === "classification") {
                _push2(`<svg class="${ssrRenderClass({ "rotated": sortDirection.value === "desc" })}" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" data-v-e5028db2><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" data-v-e5028db2></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="filter-header" data-v-e5028db2><input${ssrRenderAttr("value", columnFilters.value.classification)} type="text" placeholder="Filter classification..." class="filter-input" data-v-e5028db2></div></th><th class="sortable" data-v-e5028db2><div class="column-header" data-v-e5028db2><span data-v-e5028db2>Name</span><div class="sort-indicator" data-v-e5028db2>`);
              if (sortField.value === "name") {
                _push2(`<svg class="${ssrRenderClass({ "rotated": sortDirection.value === "desc" })}" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" data-v-e5028db2><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" data-v-e5028db2></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="filter-header" data-v-e5028db2><input${ssrRenderAttr("value", columnFilters.value.name)} type="text" placeholder="Filter name..." class="filter-input" data-v-e5028db2></div></th><th class="sortable" data-v-e5028db2><div class="column-header" data-v-e5028db2><span data-v-e5028db2>Category</span><div class="sort-indicator" data-v-e5028db2>`);
              if (sortField.value === "categorisation") {
                _push2(`<svg class="${ssrRenderClass({ "rotated": sortDirection.value === "desc" })}" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" data-v-e5028db2><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" data-v-e5028db2></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="filter-header" data-v-e5028db2><input${ssrRenderAttr("value", columnFilters.value.categorisation)} type="text" placeholder="Filter category..." class="filter-input" data-v-e5028db2></div></th><th class="sortable" data-v-e5028db2><div class="column-header" data-v-e5028db2><span data-v-e5028db2>Loaded</span><div class="sort-indicator" data-v-e5028db2>`);
              if (sortField.value === "loaded") {
                _push2(`<svg class="${ssrRenderClass({ "rotated": sortDirection.value === "desc" })}" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" data-v-e5028db2><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" data-v-e5028db2></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="filter-header" data-v-e5028db2><input${ssrRenderAttr("value", columnFilters.value.loaded)} type="text" placeholder="Filter loaded..." class="filter-input" data-v-e5028db2></div></th><th class="sortable" data-v-e5028db2><div class="column-header" data-v-e5028db2><span data-v-e5028db2>Source</span><div class="sort-indicator" data-v-e5028db2>`);
              if (sortField.value === "source") {
                _push2(`<svg class="${ssrRenderClass({ "rotated": sortDirection.value === "desc" })}" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" data-v-e5028db2><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" data-v-e5028db2></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="filter-header" data-v-e5028db2><input${ssrRenderAttr("value", columnFilters.value.source)} type="text" placeholder="Filter source..." class="filter-input" data-v-e5028db2></div></th><th data-v-e5028db2><div class="column-header" data-v-e5028db2><span data-v-e5028db2>Actions</span></div></th></tr></thead><tbody data-v-e5028db2><!--[-->`);
              ssrRenderList(paginatedDocuments.value, (doc, index2) => {
                _push2(`<tr data-v-e5028db2><td data-v-e5028db2><input type="checkbox"${ssrIncludeBooleanAttr(unref(store).selectedDocuments.includes(doc.document_id || index2)) ? " checked" : ""} class="document-checkbox" data-v-e5028db2></td><td data-v-e5028db2>${ssrInterpolate(doc.dataroom || doc.data_room || "-")}</td><td data-v-e5028db2>${ssrInterpolate(doc.classification || "-")}</td><td data-v-e5028db2>${ssrInterpolate(doc.name || doc.document_id || "-")}</td><td data-v-e5028db2>${ssrInterpolate(doc.categorisation || "-")}</td><td data-v-e5028db2>${ssrInterpolate(doc.loaded || doc.pit || doc.email_when || "-")}</td><td data-v-e5028db2>${ssrInterpolate(doc.source || doc.document_source || "-")}</td><td data-v-e5028db2><div class="action-buttons" data-v-e5028db2><button class="action-btn view-btn" title="View Document" data-v-e5028db2><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" data-v-e5028db2></path><circle cx="12" cy="12" r="3" data-v-e5028db2></circle></svg></button><button class="action-btn delete-btn" title="Delete" data-v-e5028db2><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><polyline points="3,6 5,6 21,6" data-v-e5028db2></polyline><path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" data-v-e5028db2></path><line x1="10" y1="11" x2="10" y2="17" data-v-e5028db2></line><line x1="14" y1="11" x2="14" y2="17" data-v-e5028db2></line></svg></button><button class="action-btn more-btn" title="More options" data-v-e5028db2><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><circle cx="12" cy="12" r="1" data-v-e5028db2></circle><circle cx="12" cy="5" r="1" data-v-e5028db2></circle><circle cx="12" cy="19" r="1" data-v-e5028db2></circle></svg></button></div></td></tr>`);
              });
              _push2(`<!--]-->`);
              if (paginatedDocuments.value.length === 0) {
                _push2(`<tr class="no-results" data-v-e5028db2><td colspan="8" class="no-results-cell" data-v-e5028db2><div class="no-results-content" data-v-e5028db2><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><circle cx="11" cy="11" r="8" data-v-e5028db2></circle><path d="m21 21-4.35-4.35" data-v-e5028db2></path></svg><p data-v-e5028db2>No documents found matching your filters</p><button class="clear-filters-link" data-v-e5028db2>Clear all filters</button></div></td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table></div>`);
            }
            _push2(`<div class="filter-controls-bar" data-v-e5028db2><div class="filter-controls-left" data-v-e5028db2><div class="global-search" data-v-e5028db2><svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><circle cx="11" cy="11" r="8" data-v-e5028db2></circle><path d="m21 21-4.35-4.35" data-v-e5028db2></path></svg><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Search all documents..." class="global-search-input" data-v-e5028db2>`);
            if (searchQuery.value) {
              _push2(`<button class="clear-search" data-v-e5028db2><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><line x1="18" y1="6" x2="6" y2="18" data-v-e5028db2></line><line x1="6" y1="6" x2="18" y2="18" data-v-e5028db2></line></svg></button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="quick-filters" data-v-e5028db2><select class="quick-filter-select" data-v-e5028db2><option value="" data-v-e5028db2${ssrIncludeBooleanAttr(Array.isArray(selectedDataRoom.value) ? ssrLooseContain(selectedDataRoom.value, "") : ssrLooseEqual(selectedDataRoom.value, "")) ? " selected" : ""}>All Data Rooms</option><!--[-->`);
            ssrRenderList(uniqueDataRooms.value, (room) => {
              _push2(`<option${ssrRenderAttr("value", room)} data-v-e5028db2${ssrIncludeBooleanAttr(Array.isArray(selectedDataRoom.value) ? ssrLooseContain(selectedDataRoom.value, room) : ssrLooseEqual(selectedDataRoom.value, room)) ? " selected" : ""}>${ssrInterpolate(room)}</option>`);
            });
            _push2(`<!--]--></select><select class="quick-filter-select" data-v-e5028db2><option value="" data-v-e5028db2${ssrIncludeBooleanAttr(Array.isArray(selectedClassification.value) ? ssrLooseContain(selectedClassification.value, "") : ssrLooseEqual(selectedClassification.value, "")) ? " selected" : ""}>All Classifications</option><!--[-->`);
            ssrRenderList(uniqueClassifications.value, (classification) => {
              _push2(`<option${ssrRenderAttr("value", classification)} data-v-e5028db2${ssrIncludeBooleanAttr(Array.isArray(selectedClassification.value) ? ssrLooseContain(selectedClassification.value, classification) : ssrLooseEqual(selectedClassification.value, classification)) ? " selected" : ""}>${ssrInterpolate(classification)}</option>`);
            });
            _push2(`<!--]--></select></div></div><div class="filter-controls-right" data-v-e5028db2>`);
            if (hasActiveFilters.value) {
              _push2(`<button class="clear-all-btn" data-v-e5028db2><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-v-e5028db2></path><line x1="10" y1="11" x2="10" y2="17" data-v-e5028db2></line><line x1="14" y1="11" x2="14" y2="17" data-v-e5028db2></line></svg> Clear Filters </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="results-info" data-v-e5028db2><span class="results-count" data-v-e5028db2>${ssrInterpolate(totalFilteredDocuments.value)} results</span>`);
            if (totalFilteredDocuments.value !== unref(store).documents.length) {
              _push2(`<span class="filter-info" data-v-e5028db2> (filtered from ${ssrInterpolate(unref(store).documents.length)}) </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div>`);
            if (totalFilteredDocuments.value > 0) {
              _push2(`<div class="pagination" data-v-e5028db2><div class="pagination-info" data-v-e5028db2><span data-v-e5028db2>Page Size: <select class="page-size-select" data-v-e5028db2><option value="10" data-v-e5028db2${ssrIncludeBooleanAttr(Array.isArray(pageSize.value) ? ssrLooseContain(pageSize.value, "10") : ssrLooseEqual(pageSize.value, "10")) ? " selected" : ""}>10</option><option value="25" data-v-e5028db2${ssrIncludeBooleanAttr(Array.isArray(pageSize.value) ? ssrLooseContain(pageSize.value, "25") : ssrLooseEqual(pageSize.value, "25")) ? " selected" : ""}>25</option><option value="50" data-v-e5028db2${ssrIncludeBooleanAttr(Array.isArray(pageSize.value) ? ssrLooseContain(pageSize.value, "50") : ssrLooseEqual(pageSize.value, "50")) ? " selected" : ""}>50</option></select></span><span data-v-e5028db2>${ssrInterpolate((currentPage.value - 1) * pageSize.value + 1)} to ${ssrInterpolate(Math.min(currentPage.value * pageSize.value, totalFilteredDocuments.value))} of ${ssrInterpolate(totalFilteredDocuments.value)}</span><span data-v-e5028db2>Page ${ssrInterpolate(currentPage.value)} of ${ssrInterpolate(totalPages.value)}</span></div><div class="pagination-controls" data-v-e5028db2><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="pagination-btn" title="First page" data-v-e5028db2><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><polyline points="11,17 6,12 11,7" data-v-e5028db2></polyline><polyline points="18,17 13,12 18,7" data-v-e5028db2></polyline></svg></button><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="pagination-btn" title="Previous page" data-v-e5028db2><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><polyline points="15,18 9,12 15,6" data-v-e5028db2></polyline></svg></button><div class="page-numbers" data-v-e5028db2><!--[-->`);
              ssrRenderList(visiblePageNumbers.value, (page) => {
                _push2(`<button class="${ssrRenderClass(["page-number", { active: page === currentPage.value }])}" data-v-e5028db2>${ssrInterpolate(page)}</button>`);
              });
              _push2(`<!--]--></div><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="pagination-btn" title="Next page" data-v-e5028db2><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><polyline points="9,18 15,12 9,6" data-v-e5028db2></polyline></svg></button><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="pagination-btn" title="Last page" data-v-e5028db2><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><polyline points="13,17 18,12 13,7" data-v-e5028db2></polyline><polyline points="6,17 11,12 6,7" data-v-e5028db2></polyline></svg></button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else if (unref(store).promptContentData) {
            _push2(`<div class="error-display" data-v-e5028db2><div class="modal-header" data-v-e5028db2><div class="header-content" data-v-e5028db2><div class="header-icon error" data-v-e5028db2><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" data-v-e5028db2><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" data-v-e5028db2></path></svg></div><div class="header-info" data-v-e5028db2><h3 class="modal-title" data-v-e5028db2>Response Data</h3><p class="modal-subtitle" data-v-e5028db2>Raw API response data</p></div></div><button class="close-button" data-v-e5028db2><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-e5028db2><line x1="18" y1="6" x2="6" y2="18" data-v-e5028db2></line><line x1="6" y1="6" x2="18" y2="18" data-v-e5028db2></line></svg></button></div><div class="error-content" data-v-e5028db2><pre class="json-output" data-v-e5028db2>${ssrInterpolate(formatted.value)}</pre></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PromptContextModel.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-e5028db2"]]), { __name: "PromptContextModel" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ModelSelectionPopover",
  __ssrInlineRender: true,
  setup(__props) {
    const store = usePromptListStore();
    const externalModels = [
      {
        name: "ChatGPT",
        description: "OpenAI's advanced model GPT-4o"
      },
      {
        name: "Claude",
        description: "Anthropic's advanced model Sonnet 3.5"
      },
      {
        name: "Gemini",
        description: "Google's latest Model 2.5 Pro"
      }
    ];
    const internalModels = [
      {
        name: "llama3",
        description: "Meta's Solid General Purpose Model"
      },
      {
        name: "Mistral",
        description: "Mistral AI Model"
      },
      {
        name: "Phi4",
        description: "Microsoft Reasoning Model"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="model-selection-overlay" data-v-ac4e60c8><div class="model-selection-modal" data-v-ac4e60c8><div class="modal-header" data-v-ac4e60c8><div class="header-content" data-v-ac4e60c8><h2 class="modal-title" data-v-ac4e60c8>Choose AI Model</h2><p class="modal-subtitle" data-v-ac4e60c8>Select the best model for your task</p></div><button class="close-button" data-v-ac4e60c8><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-ac4e60c8><line x1="18" y1="6" x2="6" y2="18" data-v-ac4e60c8></line><line x1="6" y1="6" x2="18" y2="18" data-v-ac4e60c8></line></svg></button></div><div class="modal-body" data-v-ac4e60c8><div class="models-section" data-v-ac4e60c8><div class="section-header" data-v-ac4e60c8><div class="section-icon external" data-v-ac4e60c8><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-v-ac4e60c8><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" data-v-ac4e60c8></path></svg></div><h3 class="section-title" data-v-ac4e60c8>External Models</h3><div class="section-badge" data-v-ac4e60c8>Premium</div></div><div class="models-grid" data-v-ac4e60c8><!--[-->`);
        ssrRenderList(externalModels, (model) => {
          _push2(`<div class="${ssrRenderClass([{ "selected": unref(store).selectedModel === model.name }, "model-card"])}" data-v-ac4e60c8><div class="model-header" data-v-ac4e60c8><div class="model-avatar" data-v-ac4e60c8><span class="model-initial" data-v-ac4e60c8>${ssrInterpolate(model.name.charAt(0))}</span></div><div class="model-info" data-v-ac4e60c8><h4 class="model-name" data-v-ac4e60c8>${ssrInterpolate(model.name)}</h4><p class="model-description" data-v-ac4e60c8>${ssrInterpolate(model.description)}</p></div></div><div class="model-features" data-v-ac4e60c8><span class="feature-tag" data-v-ac4e60c8>Advanced</span><span class="feature-tag" data-v-ac4e60c8>Fast</span></div>`);
          if (unref(store).selectedModel === model.name) {
            _push2(`<div class="selection-indicator" data-v-ac4e60c8><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-v-ac4e60c8><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-ac4e60c8></path></svg></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        });
        _push2(`<!--]--></div></div><div class="models-section" data-v-ac4e60c8><div class="section-header" data-v-ac4e60c8><div class="section-icon internal" data-v-ac4e60c8><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-v-ac4e60c8><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" data-v-ac4e60c8></path></svg></div><h3 class="section-title" data-v-ac4e60c8>Internal Models</h3><div class="section-badge internal" data-v-ac4e60c8>Local</div></div><div class="models-grid" data-v-ac4e60c8><!--[-->`);
        ssrRenderList(internalModels, (model) => {
          _push2(`<div class="${ssrRenderClass([{ "selected": unref(store).selectedModel === model.name }, "model-card"])}" data-v-ac4e60c8><div class="model-header" data-v-ac4e60c8><div class="model-avatar internal" data-v-ac4e60c8><span class="model-initial" data-v-ac4e60c8>${ssrInterpolate(model.name.charAt(0))}</span></div><div class="model-info" data-v-ac4e60c8><h4 class="model-name" data-v-ac4e60c8>${ssrInterpolate(model.name)}</h4><p class="model-description" data-v-ac4e60c8>${ssrInterpolate(model.description)}</p></div></div><div class="model-features" data-v-ac4e60c8><span class="feature-tag internal" data-v-ac4e60c8>Private</span><span class="feature-tag internal" data-v-ac4e60c8>Secure</span></div>`);
          if (unref(store).selectedModel === model.name) {
            _push2(`<div class="selection-indicator" data-v-ac4e60c8><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-v-ac4e60c8><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-ac4e60c8></path></svg></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        });
        _push2(`<!--]--></div></div></div></div></div>`);
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModelSelectionPopover.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-ac4e60c8"]]), { __name: "ModelSelectionPopover" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UploadDocument",
  __ssrInlineRender: true,
  props: {
    isVisible: { type: Boolean }
  },
  emits: ["close", "fileUploaded"],
  setup(__props, { emit: __emit }) {
    const activeTab = ref("upload");
    const isDragOver = ref(false);
    const selectedFile = ref(null);
    const isUploading = ref(false);
    ref(null);
    const acceptedFileTypes = computed(() => {
      return ".csv,.xls,.xlsx,.pdf,.doc,.docx,.ppt,.pptx,.txt";
    });
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (_ctx.isVisible) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "upload-modal-overlay" }, _attrs))} data-v-228598b8><div class="upload-modal" data-v-228598b8><div class="modal-header" data-v-228598b8><h2 class="modal-title" data-v-228598b8>Add New Source</h2><button class="close-btn" data-v-228598b8><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-228598b8><line x1="18" y1="6" x2="6" y2="18" data-v-228598b8></line><line x1="6" y1="6" x2="18" y2="18" data-v-228598b8></line></svg></button></div><div class="tabs" data-v-228598b8><button class="${ssrRenderClass([{ active: activeTab.value === "upload" }, "tab"])}" data-v-228598b8> File Upload </button><button class="${ssrRenderClass([{ active: activeTab.value === "connections" }, "tab"])}" data-v-228598b8> Connections </button></div><div class="tab-content" data-v-228598b8>`);
        if (activeTab.value === "upload") {
          _push(`<div class="upload-tab" data-v-228598b8><div class="upload-section" data-v-228598b8><div class="upload-icon" data-v-228598b8><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-228598b8><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-228598b8></path><polyline points="14,2 14,8 20,8" data-v-228598b8></polyline><line x1="16" y1="13" x2="8" y2="13" data-v-228598b8></line><line x1="16" y1="17" x2="8" y2="17" data-v-228598b8></line><polyline points="10,9 9,9 8,9" data-v-228598b8></polyline></svg></div><h3 class="upload-title" data-v-228598b8>Upload &amp; Connect File</h3><div class="${ssrRenderClass([{ "drag-over": isDragOver.value }, "drop-zone"])}" data-v-228598b8><div class="drop-content" data-v-228598b8><p class="drop-text" data-v-228598b8>Drop a file here, or select a file</p><div class="file-types" data-v-228598b8><p class="file-type-label" data-v-228598b8>Supported Data file types: <span class="file-extensions" data-v-228598b8>.csv, .xls, .xlsx</span></p><p class="file-type-label" data-v-228598b8>Document types: <span class="file-extensions" data-v-228598b8>.csv, .xls, .xlsx, .pdf, .doc, .docx, .ppt, .pptx, .txt</span></p></div><p class="file-limit" data-v-228598b8>1 file per upload, up to 500K rows or 10 MB</p><button class="select-file-btn" data-v-228598b8><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-228598b8><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-228598b8></path><polyline points="17,8 12,3 7,8" data-v-228598b8></polyline><line x1="12" y1="3" x2="12" y2="15" data-v-228598b8></line></svg> Drop a file here, or select a file </button></div></div><input type="file" class="hidden-file-input"${ssrRenderAttr("accept", acceptedFileTypes.value)} data-v-228598b8>`);
          if (selectedFile.value) {
            _push(`<div class="selected-file" data-v-228598b8><div class="file-info" data-v-228598b8><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-228598b8><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-v-228598b8></path><polyline points="14,2 14,8 20,8" data-v-228598b8></polyline></svg><span class="file-name" data-v-228598b8>${ssrInterpolate(selectedFile.value.name)}</span><span class="file-size" data-v-228598b8>(${ssrInterpolate(formatFileSize(selectedFile.value.size))})</span></div><button class="remove-file-btn" data-v-228598b8><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-228598b8><line x1="18" y1="6" x2="6" y2="18" data-v-228598b8></line><line x1="6" y1="6" x2="18" y2="18" data-v-228598b8></line></svg></button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="upload-actions" data-v-228598b8><button class="upload-btn"${ssrIncludeBooleanAttr(!selectedFile.value || isUploading.value) ? " disabled" : ""} data-v-228598b8>`);
          if (!isUploading.value) {
            _push(`<span data-v-228598b8>Upload File</span>`);
          } else {
            _push(`<span data-v-228598b8>Uploading...</span>`);
          }
          _push(`</button></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (activeTab.value === "connections") {
          _push(`<div class="connections-tab" data-v-228598b8><p class="coming-soon" data-v-228598b8>Connections feature coming soon...</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UploadDocument.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_5 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-228598b8"]]), { __name: "UploadDocument" });
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = () => {
  console.error(intervalError);
};
const useChatStore = defineStore("chat", () => {
  const messages = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const currentPollInterval = ref(null);
  const statusPollInterval = ref(null);
  const taskResultInterval = ref(null);
  const isRequestCompleted = ref(false);
  const lastResultText = ref(null);
  const streamingStatus = ref("");
  const showStreamingStatus = ref(false);
  const getSelectedDocumentIds = () => {
    const promptListStore = usePromptListStore();
    return promptListStore.getDocumentContextIds();
  };
  const getSelectedConnectionIds = () => {
    const promptListStore = usePromptListStore();
    return promptListStore.getConnectionIds();
  };
  const getSelectedModel = () => {
    const promptListStore = usePromptListStore();
    return promptListStore.selectedModel.toLowerCase();
  };
  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  };
  const addUserMessage = (content) => {
    const messageId = generateMessageId();
    messages.value.push({
      id: messageId,
      type: "user",
      content,
      timestamp: /* @__PURE__ */ new Date()
    });
    return messageId;
  };
  const addAIMessage = (content, loading = false) => {
    const messageId = generateMessageId();
    messages.value.push({
      id: messageId,
      type: "ai",
      content,
      loading,
      timestamp: /* @__PURE__ */ new Date()
    });
    return messageId;
  };
  const updateMessage = (messageId, content, loading = false) => {
    const messageIndex = messages.value.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      messages.value[messageIndex].content = content;
      messages.value[messageIndex].loading = loading;
    }
  };
  const removeMessage = (messageId) => {
    const messageIndex = messages.value.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      messages.value.splice(messageIndex, 1);
    }
  };
  const clearMessages = () => {
    messages.value = [];
    error.value = null;
    isRequestCompleted.value = false;
    lastResultText.value = null;
    streamingStatus.value = "";
    showStreamingStatus.value = false;
    stopPolling();
  };
  const stopPolling = () => {
    console.log("Stopping all polling intervals...");
    if (currentPollInterval.value) {
      clearInterval(currentPollInterval.value);
      currentPollInterval.value = null;
      console.log("Cleared currentPollInterval");
    }
    if (statusPollInterval.value) {
      clearInterval(statusPollInterval.value);
      statusPollInterval.value = null;
      console.log("Cleared statusPollInterval");
    }
    if (taskResultInterval.value) {
      clearInterval(taskResultInterval.value);
      taskResultInterval.value = null;
      console.log("Cleared taskResultInterval");
    }
    isLoading.value = false;
    isRequestCompleted.value = true;
    messages.value.forEach((msg) => {
      if (msg.loading) {
        msg.loading = false;
      }
    });
    console.log("All polling stopped and cleanup completed");
  };
  const handleHelpRequest = async () => {
    isLoading.value = true;
    error.value = null;
    const loadingMessageId = addAIMessage("", true);
    try {
      const response = await fetch("http://34.69.208.233:8040/proxy/get_ai_help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      removeMessage(loadingMessageId);
      addAIMessage(data);
    } catch (err) {
      removeMessage(loadingMessageId);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      addAIMessage("Sorry, I encountered an error while fetching help information. Please try again.");
      error.value = errorMessage;
    } finally {
      isLoading.value = false;
    }
  };
  const handleChatMessage = async (userInput) => {
    addUserMessage(userInput);
    if (userInput.toLowerCase().trim() === "help") {
      await handleHelpRequest();
    } else {
      await handleAsyncQuery(userInput);
    }
  };
  const extractText = (data) => {
    if (data && data.result && typeof data.result === "object" && "text" in data.result) {
      return data.result.text;
    }
    return typeof data.result === "string" ? data.result : "";
  };
  const handleAsyncQuery = async (question) => {
    console.log("Starting async query for question:", question);
    isLoading.value = true;
    error.value = null;
    lastResultText.value = null;
    streamingStatus.value = "";
    showStreamingStatus.value = true;
    const loadingMessageId = addAIMessage("", true);
    try {
      const authStore = useAuthStore();
      const userToken = authStore.getToken();
      if (!userToken) {
        throw new Error("No authentication token available. Please log in again.");
      }
      console.log("Sending start_async_query request...");
      const selectedDocumentIds = getSelectedDocumentIds();
      const selectedConnectionIds = getSelectedConnectionIds();
      const promptListStore = usePromptListStore();
      const selectedDocDetails = promptListStore.getSelectedDocumentDetails();
      console.log("=== SELECTED DOCUMENTS DEBUG ===");
      console.log("Selected document details:", selectedDocDetails);
      selectedDocDetails.forEach((doc) => {
        console.log(`Document: ${doc.name}, Dataroom: "${doc.dataroom}", Data_room: "${doc.data_room}"`);
      });
      console.log("Database documents:", promptListStore.getSelectedDatabaseDocuments());
      console.log("Non-database documents:", promptListStore.getSelectedNonDatabaseDocuments());
      console.log("Connection IDs (database names):", selectedConnectionIds);
      console.log("Document context IDs (non-database):", selectedDocumentIds);
      console.log("================================");
      const selectedModel = getSelectedModel();
      const hasDatabase = selectedConnectionIds.length > 0;
      const hasDocuments = selectedDocumentIds.length > 0;
      const apiPayload = {
        model_id: selectedModel,
        question,
        connection_id: hasDatabase ? selectedConnectionIds.join(",") : "",
        document_context: hasDatabase ? [] : selectedDocumentIds,
        token: userToken
      };
      console.log("API PAYLOAD LOGIC:");
      console.log("Has database documents:", hasDatabase);
      console.log("Has non-database documents:", hasDocuments);
      console.log("Final connection_id:", apiPayload.connection_id);
      console.log("Final document_context:", apiPayload.document_context);
      console.log("DEBUG - API payload:", apiPayload);
      const startQueryResponse = await fetch("http://34.69.208.233:8040/proxy/start_async_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiPayload)
      });
      if (!startQueryResponse.ok) {
        throw new Error(`Failed to start async query: ${startQueryResponse.status}`);
      }
      console.log("start_async_query successful, starting React-style polling...");
      stopPolling();
      isRequestCompleted.value = false;
      startReactStylePolling(loadingMessageId);
      setTimeout(() => {
        if (!isRequestCompleted.value) {
          console.log("Request timed out after 2 minutes");
          isRequestCompleted.value = true;
          stopPolling();
          removeMessage(loadingMessageId);
          addAIMessage("Request timed out. Please try again.");
        }
      }, 12e4);
    } catch (error2) {
      console.error("Async query error:", error2);
      stopPolling();
      removeMessage(loadingMessageId);
      const errorMessage = error2 instanceof Error ? error2.message : "Unknown error occurred";
      addAIMessage("Sorry, I encountered an error processing your request. Please try again.");
      error2.value = errorMessage;
    }
  };
  const startReactStylePolling = (loadingMessageId) => {
    console.log("Starting React-style polling (1 second intervals)...");
    if (currentPollInterval.value) {
      clearInterval(currentPollInterval.value);
      currentPollInterval.value = null;
    }
    if (statusPollInterval.value) {
      clearInterval(statusPollInterval.value);
      statusPollInterval.value = null;
    }
    if (taskResultInterval.value) {
      clearInterval(taskResultInterval.value);
      taskResultInterval.value = null;
    }
    const poll = async () => {
      if (isRequestCompleted.value) {
        console.log("Request completed, stopping polling");
        return;
      }
      try {
        const authStore = useAuthStore();
        const userToken = authStore.getToken();
        if (!userToken) {
          console.error("No token available for polling");
          stopPolling();
          return;
        }
        const statusRes = await fetch("http://34.69.208.233:8040/proxy/get_streaming_status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: userToken
          })
        });
        const statusData = await statusRes.json();
        const statusString = statusData?.result?.toLowerCase() || "";
        console.log("Streaming status:", statusData?.result || "");
        if (statusData?.result) {
          streamingStatus.value = statusData.result;
        }
        let anvilText = "";
        try {
          const blobRes = await fetch("http://34.69.208.233:8040/proxy/get_streaming_status_data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              token: userToken
            })
          });
          if (blobRes.ok) {
            const blobData = await blobRes.json();
            if (blobData && typeof blobData === "object") {
              if (typeof blobData.text === "string") {
                anvilText = blobData.text;
              } else if (blobData.result && typeof blobData.result.text === "string") {
                anvilText = blobData.result.text;
              }
            }
          }
        } catch (e) {
          console.log("No Anvil blob data available");
        }
        if (statusString.includes("request completed")) {
          console.log("Request completed detected, getting final result and stopping all polling...");
          streamingStatus.value = "Request completed - finalizing response...";
          isRequestCompleted.value = true;
          isLoading.value = false;
          stopPolling();
          const res = await fetch("http://34.69.208.233:8040/proxy/get_task_result", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({})
          });
          const data = await res.json();
          let resultText = extractText(data);
          if (anvilText && !resultText.includes(anvilText)) {
            resultText = resultText ? resultText + "\n" + anvilText : anvilText;
          }
          if (resultText && resultText.trim()) {
            console.log("Displaying final result in ChatResponse:", resultText);
            updateMessage(loadingMessageId, resultText, false);
          } else {
            const currentMessage = messages.value.find((msg) => msg.id === loadingMessageId);
            if (currentMessage && currentMessage.content) {
              updateMessage(loadingMessageId, currentMessage.content, false);
            } else {
              updateMessage(loadingMessageId, "Response completed", false);
            }
          }
          setTimeout(() => {
            showStreamingStatus.value = false;
            streamingStatus.value = "";
          }, 5e3);
          return;
        } else {
          try {
            const res = await fetch("http://34.69.208.233:8040/proxy/get_task_result", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({})
            });
            const data = await res.json();
            let resultText = extractText(data);
            if (anvilText && !resultText.includes(anvilText)) {
              resultText = resultText ? resultText + "\n" + anvilText : anvilText;
            }
            if (resultText && resultText.trim() && resultText !== lastResultText.value) {
              lastResultText.value = resultText;
              console.log("Fast updating ChatResponse with result:", resultText);
              updateMessage(loadingMessageId, resultText, true);
            }
          } catch (error2) {
            console.error("Error fetching task result:", error2);
          }
        }
      } catch (error2) {
        console.error("React-style polling error:", error2);
      }
    };
    poll();
    currentPollInterval.value = setInterval();
  };
  const isChatMode = computed(() => messages.value.length > 0);
  return {
    // State
    messages: readonly(messages),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isChatMode,
    isRequestCompleted: readonly(isRequestCompleted),
    streamingStatus: readonly(streamingStatus),
    showStreamingStatus: readonly(showStreamingStatus),
    // Actions
    addUserMessage,
    addAIMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    stopPolling,
    handleHelpRequest,
    handleChatMessage,
    handleAsyncQuery
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const inputText = ref("");
    const showSidebar = ref(false);
    const showUploadModal = ref(false);
    const tags = ["Addepar", "Email", "Finoptiq", "General"];
    ref(null);
    useRouter();
    const store = usePromptListStore();
    const chatStore = useChatStore();
    useAuthStore();
    const { public: publicConfig } = useRuntimeConfig();
    publicConfig.baseURL || "http://34.69.208.233:8040/proxy";
    function handlePromptSelected(prompt) {
      inputText.value = prompt;
      console.log("Prompt selected and inserted:", prompt);
    }
    function handleFileUploaded(file) {
      console.log("File uploaded:", file.name);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Sidebar = __nuxt_component_0;
      const _component_ChatResponse = __nuxt_component_1;
      const _component_Popover = __nuxt_component_2;
      const _component_PromptContextModel = __nuxt_component_3;
      const _component_ModelSelectionPopover = __nuxt_component_4;
      const _component_UploadDocument = __nuxt_component_5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-layout" }, _attrs))} data-v-b063002f>`);
      if (showSidebar.value) {
        _push(ssrRenderComponent(_component_Sidebar, {
          onClose: ($event) => showSidebar.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([{ "sidebar-open": showSidebar.value }, "main-content"])}" data-v-b063002f>`);
      if (!showSidebar.value) {
        _push(`<button class="menu-toggle" data-v-b063002f><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-b063002f><line x1="3" y1="6" x2="21" y2="6" data-v-b063002f></line><line x1="3" y1="12" x2="21" y2="12" data-v-b063002f></line><line x1="3" y1="18" x2="21" y2="18" data-v-b063002f></line></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([{ "chat-mode": unref(chatStore).isChatMode }, "container"])}" data-v-b063002f>`);
      if (!unref(chatStore).isChatMode) {
        _push(`<div class="header" data-v-b063002f><div class="ai-icon" data-v-b063002f><img${ssrRenderAttr("src", _imports_0)} alt="AI Icon" width="24" height="24" data-v-b063002f></div><h3 class="title" data-v-b063002f>Where should we begin?</h3></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(chatStore).isChatMode) {
        _push(`<div class="tags" data-v-b063002f><!--[-->`);
        ssrRenderList(tags, (tag) => {
          _push(`<button class="${ssrRenderClass(["tag", `tag-${tag.toLowerCase()}`])}" type="button" data-v-b063002f>${ssrInterpolate(tag)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(chatStore).isChatMode) {
        _push(`<div class="chat-container" data-v-b063002f><!--[-->`);
        ssrRenderList(unref(chatStore).messages, (message) => {
          _push(`<div class="${ssrRenderClass([message.type, "message"])}" data-v-b063002f><div class="message-content" data-v-b063002f>`);
          if (message.type === "user") {
            _push(`<div class="user-message" data-v-b063002f><span class="user-text" data-v-b063002f>${ssrInterpolate(message.content)}</span><button class="${ssrRenderClass([{ "bookmarked": message.bookmarked }, "bookmark-btn"])}" title="Bookmark question" data-v-b063002f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-b063002f><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" data-v-b063002f></path></svg></button></div>`);
          } else {
            _push(ssrRenderComponent(_component_ChatResponse, {
              content: message.content,
              loading: message.loading
            }, null, _parent));
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="input-container" data-v-b063002f><div class="input-box" data-v-b063002f><input${ssrRenderAttr("value", inputText.value)} placeholder="Ask Anything" data-v-b063002f></div>`);
      if (unref(chatStore).showStreamingStatus) {
        _push(`<div class="streaming-status-inside-input" data-v-b063002f><div class="streaming-status-content" data-v-b063002f><div class="streaming-indicator" data-v-b063002f><div class="streaming-dots" data-v-b063002f><span data-v-b063002f></span><span data-v-b063002f></span><span data-v-b063002f></span></div></div><span class="streaming-text" data-v-b063002f>${ssrInterpolate(unref(chatStore).streamingStatus || "Processing your request...")}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="toolbar" data-v-b063002f><div class="toolbar-left" data-v-b063002f><button class="toolbar-btn" aria-label="Bookmark" data-v-b063002f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-b063002f><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" data-v-b063002f></path></svg></button><button class="toolbar-btn" title="Search" data-v-b063002f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-b063002f><circle cx="11" cy="11" r="8" data-v-b063002f></circle><path d="m21 21-4.35-4.35" data-v-b063002f></path></svg></button><button class="toolbar-btn" title="Undo" data-v-b063002f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-b063002f><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" data-v-b063002f></path><path d="M21 3v5h-5" data-v-b063002f></path></svg></button></div><div class="toolbar-right" data-v-b063002f><div class="sources-dropdown" data-v-b063002f><button class="sources-btn" data-v-b063002f><span data-v-b063002f>Sources</span>`);
      if (unref(store).selectedCount > 0) {
        _push(`<span class="source-count" data-v-b063002f>${ssrInterpolate(unref(store).selectedCount)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-b063002f><polyline points="6,9 12,15 18,9" data-v-b063002f></polyline></svg></button></div><button class="toolbar-btn" title="Add" data-v-b063002f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-b063002f><path d="M5 12h14" data-v-b063002f></path><path d="M12 5v14" data-v-b063002f></path></svg></button><button class="toolbar-btn" title="Book" data-v-b063002f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-b063002f><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" data-v-b063002f></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" data-v-b063002f></path></svg></button><button class="toolbar-btn" title="Model Selection" data-v-b063002f><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-b063002f><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" data-v-b063002f></path><polyline points="3.27,6.96 12,12.01 20.73,6.96" data-v-b063002f></polyline><line x1="12" y1="22.08" x2="12" y2="12" data-v-b063002f></line></svg></button><button class="send-btn" title="Send" data-v-b063002f><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" data-v-b063002f><path d="M22 2L11 13" data-v-b063002f></path><polygon points="22 2 15 22 11 13 2 9 22 2" data-v-b063002f></polygon></svg></button></div></div></div>`);
      if (unref(store).showPopover) {
        _push(ssrRenderComponent(_component_Popover, {
          placement: "top",
          onPromptSelected: handlePromptSelected
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(store).showPromptContentModel) {
        _push(ssrRenderComponent(_component_PromptContextModel, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(store).showModelSelection) {
        _push(ssrRenderComponent(_component_ModelSelectionPopover, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_UploadDocument, {
        isVisible: showUploadModal.value,
        onClose: ($event) => showUploadModal.value = false,
        onFileUploaded: handleFileUploaded
      }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b063002f"]]);

export { index as default };
//# sourceMappingURL=index-Y8Cwi2N2.mjs.map
