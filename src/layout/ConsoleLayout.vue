<template>
    <a-layout class="console-layout">
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
                <a-dropdown>
                    <a-image
                        :src="userAvatar"
                        :preview-visible="false"
                        width="40px"
                        height="40px"
                        style="border-radius: 50%"
                    />
                    <template #content>
                        <a-doption @click="router.push('/console/profile')"
                            >个人中心</a-doption
                        >
                        <a-doption @click="router.push('/console/chpasswd')"
                            >安全设置</a-doption
                        >
                        <a-doption @click="router.push('/console/organization')"
                            >组织绑定</a-doption
                        >
                        <a-doption @click="router.push('/console/questions')"
                            >我的题目</a-doption
                        >
                        <a-doption @click="router.push('/')"
                            >返回主页</a-doption
                        >
                    </template>
                </a-dropdown>
            </div>
        </a-layout-header>

        <a-layout>
            <a-layout-sider :width="200">
                <a-menu
                    v-model:selectedKeys="selectedKeys"
                    @click="handleMenuClick"
                >
                    <a-menu-item key="/console/profile">
                        个人资料
                    </a-menu-item>
                    <a-menu-item key="/console/chpasswd">
                        安全设置
                    </a-menu-item>
                    <a-menu-item key="/console/organization">
                        组织绑定
                    </a-menu-item>
                    <a-menu-item key="/console/questions">
                        我的题目
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>

            <a-layout-content class="content">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { IconLeft } from "@arco-design/web-vue/es/icon";

const router = useRouter();
const route = useRoute();
const store = useStore();
const user = store.state?.user.loginUser;
const selectedKeys = ref([route.path]);

const userAvatar = computed(() => user.userAvatar);

const handleMenuClick = async () => {
    console.log(selectedKeys.value.toString());
    router.push(selectedKeys.value.toString());
};
</script>

<style scoped>
.console-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 24px;
    box-shadow: 0 2px 8px #f0f1f2;
}

.logo {
    height: 40px;
}

.content {
    flex: 1;
    padding: 24px;
    min-height: 280px;
    background: #fff;
    margin: 24px;
    border-radius: 8px;
}

.left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.back-btn {
    color: var(--color-text-1);
    margin-right: 8px;
}

.back-btn:hover {
    background-color: var(--color-fill-2);
    border-radius: 50%;
}

.logo-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: inherit;
}

.right {
    display: flex;
    align-items: center;
}

.right a-avatar {
    cursor: pointer;
}
</style>
