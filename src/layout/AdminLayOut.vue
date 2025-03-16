<template>
    <a-layout class="admin-layout">
        <a-layout-sider
            :width="240"
            breakpoint="xl"
            collapsible
            :collapsed="collapsed"
        >
            <div class="logo">
                <img src="@/assets/logo.png" />
                <span v-if="!collapsed">管理后台</span>
            </div>
            <a-menu
                :selected-keys="selectedKeys"
                @menu-item-click="handleMenuClick"
            >
                <a-menu-item
                    v-for="item in adminRoutes"
                    :key="item.path"
                    :title="item.meta?.title"
                >
                    <template #icon v-if="item.meta?.icon">
                        <component :is="item.meta.icon" />
                    </template>
                    {{ item.meta?.title }}
                </a-menu-item>
            </a-menu>
        </a-layout-sider>

        <a-layout>
            <a-layout-header class="header">
                <global-header />
            </a-layout-header>

            <a-layout-content class="content">
                <router-view v-slot="{ Component }">
                    <transition name="fade">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import GlobalHeader from "@/components/GlobalHeader.vue";

const router = useRouter();
const route = useRoute();

const adminRoutes = computed(() => {
    return router
        .getRoutes()
        .filter((r) => r.path.startsWith("/admin") && !r.meta?.hideInMenu);
});

const selectedKeys = computed(() => [route.path]);
</script>

<style scoped>
.admin-layout {
    min-height: 100vh;

    .logo {
        height: 64px;
        padding: 12px;
        display: flex;
        align-items: center;
        img {
            height: 32px;
            margin-right: 8px;
        }
        span {
            font-size: 18px;
            font-weight: 500;
        }
    }

    .header {
        padding: 0 24px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .content {
        padding: 24px;
        background: #f5f6f7;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
