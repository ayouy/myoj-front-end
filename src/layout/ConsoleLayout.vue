<template>
    <a-layout class="console-layout">
        <!-- Header -->
        <a-layout-header class="header">
            <div class="left">
                <a-button
                    type="text"
                    @click="router.push('/')"
                    class="back-btn"
                >
                    <icon-left :size="20" />
                </a-button>
                <router-link to="/" class="logo-link">
                    <img class="logo" src="@/assets/logo.png" />
                    <span>MyOj</span>
                </router-link>
            </div>
            <div class="right">
                <a-dropdown trigger="hover" position="bottom">
                    <a-space>
                        <a-avatar
                            :image-url="userAvatar"
                            :size="40"
                            class="user-avatar"
                        />
                        <span>{{ user.username }}</span>
                    </a-space>

                    <template #content>
                        <a-doption
                            v-for="item in menuOptions"
                            :key="item.key"
                            @click="router.push(item.path)"
                            class="dropdown-item"
                        >
                            <component :is="item.icon" class="dropdown-icon" />
                            <span>{{ item.label }}</span>
                        </a-doption>
                    </template>
                </a-dropdown>
            </div>
        </a-layout-header>

        <!-- Main Layout -->
        <a-layout>
            <!-- Sider -->
            <a-layout-sider
                v-model:collapsed="collapsed"
                :width="siderWidth"
                :collapsedWidth="64"
                collapsible
                breakpoint="lg"
                class="sider"
                :style="{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                }"
            >
                <div class="sider-resizer" @mousedown="startResize"></div>
                <a-menu
                    v-model:selectedKeys="selectedKeys"
                    @click="handleMenuClick"
                    class="menu"
                    :inline-collapsed="collapsed"
                >
                    <a-menu-item
                        v-for="item in menuOptions"
                        :key="item.key"
                        class="menu-item"
                    >
                        <template #icon>
                            <component :is="item.icon" />
                        </template>
                        {{ item.label }}
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>

            <!-- Content -->
            <a-layout-content
                class="content"
                :style="{ marginLeft: collapsed ? '64px' : `${siderWidth}px` }"
            >
                <router-view v-slot="{ Component, route }">
                    <transition name="page-slide" mode="out-in" appear>
                        <component :is="Component" :key="route.path" />
                    </transition>
                </router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import {
    IconLeft,
    IconUser,
    IconLock,
    IconTeam,
    IconList,
} from "@arco-design/web-vue/es/icon";

const router = useRouter();
const route = useRoute();
const store = useStore();
const user = store.state?.user.loginUser;
const collapsed = ref(false);
const selectedKeys = ref([route.path]);
const siderWidth = ref(220); // 初始宽度
const isResizing = ref(false);

const userAvatar = computed(
    () =>
        user.userAvatar ??
        "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9123.png~tplv-uwbnlip3yd-webp.webp",
);

const menuOptions = [
    {
        key: "/console/profile",
        path: "/console/profile",
        label: "个人资料",
        icon: IconUser,
    },
    {
        key: "/console/chpasswd",
        path: "/console/chpasswd",
        label: "安全设置",
        icon: IconLock,
    },
    {
        key: "/console/organization",
        path: "/console/organization",
        label: "组织绑定",
        icon: IconTeam,
    },
    {
        key: "/console/questions",
        path: "/console/questions",
        label: "我的题目",
        icon: IconList,
    },
];

const handleMenuClick = async () => {
    router.push(selectedKeys.value.toString());
};

// Sider 拖动调整宽度
const startResize = (e) => {
    isResizing.value = true;
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
};

const handleResize = (e) => {
    if (isResizing.value) {
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 400) {
            siderWidth.value = newWidth;
        }
    }
};

const stopResize = () => {
    isResizing.value = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
};
</script>

<style scoped lang="less">
.console-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--color-bg-1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 64px;
    background: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border-2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: all 0.3s ease;

    &:hover {
        background: var(--color-bg-3);
    }
}

.left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.back-btn {
    color: var(--color-text-1);
    transition: all 0.2s ease;

    &:hover {
        color: var(--color-primary);
        transform: translateX(-2px);
    }
}

.logo-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: inherit;
}

.logo {
    height: 40px;
    transition: transform 0.3s ease;
}

.logo:hover {
    transform: scale(1.05);
}

.right {
    display: flex;
    align-items: center;
}

.user-avatar {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
}

.content {
    flex: 1;
    padding: 24px;
    min-height: 280px;
    background: var(--color-bg-1);
    margin: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: margin-left 0.2s ease;
}

.sider {
    background: var(--color-bg-2);
    border-right: 1px solid var(--color-border-2);
    transition:
        width 0.2s ease,
        opacity 0.2s ease;
    will-change: width;

    .sider-resizer {
        width: 4px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        cursor: ew-resize;
        z-index: 1;
        background: transparent;
        transition: background 0.2s ease;

        &:hover {
            background: var(--color-primary);
        }
    }

    .menu {
        border-right: none;
        padding: 12px;
        margin-top: 8px;

        .menu-item {
            margin: 8px 0;
            border-radius: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;

            &:hover {
                background: var(--color-fill-2);
                transform: translateX(4px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

                &::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 3px;
                    background: var(--color-primary);
                    animation: menuItemHover 0.3s ease;
                }
            }

            &.arco-menu-selected {
                background: var(--color-primary-light-1);
                color: var(--color-primary);
                font-weight: 500;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

                &::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 3px;
                    background: var(--color-primary);
                    animation: menuItemActive 0.3s ease;
                }
            }
        }
    }
}

.page-slide-enter-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, opacity;
}

.page-slide-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, opacity;
}

.page-slide-enter-from {
    opacity: 0;
    transform: translateX(30px) scale(0.98);
    filter: blur(2px);
}

.page-slide-leave-to {
    opacity: 0;
    transform: translateX(-30px) scale(0.98);
    filter: blur(2px);
}

.page-slide-enter-to,
.page-slide-leave-from {
    opacity: 1;
    transform: translateX(0) scale(1);
    filter: blur(0);
}

.page-slide-move {
    transition: transform 0.4s ease;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    transition: all 0.2s ease;

    &:hover {
        background: var(--color-fill-2);
        transform: translateX(4px);
    }
}

.dropdown-icon {
    font-size: 16px;
}

@media (max-width: 768px) {
    .header {
        padding: 0 16px;
    }

    .content {
        margin: 16px;
        padding: 16px;
    }
}
</style>
