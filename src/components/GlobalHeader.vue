<template>
    <a-row id="globalHeader" align="center" :wrap="false">
        <a-col flex="auto">
            <a-menu
                mode="horizontal"
                :selected-keys="selectedKeys"
                @menu-item-click="doMenuClick"
            >
                <a-menu-item
                    key="0"
                    :style="{ padding: 0, marginRight: '38px' }"
                    disabled
                >
                    <div class="title-bar">
                        <img class="logo" src="../assets/logo.png" />
                        <div class="title">My Oj</div>
                    </div>
                </a-menu-item>
                <a-menu-item v-for="item in showRoutes" :key="item.path">
                    {{ item.name }}
                </a-menu-item>
            </a-menu>
        </a-col>
        <a-col flex="100px">
            <a-dropdown
                trigger="click"
                position="br"
                @select="handleUserAction"
            >
                <div class="user-info">
                    {{ store.state.user?.loginUser?.userName ?? "未登录" }}
                    <icon-down :style="{ marginLeft: '8px' }" />
                </div>
                <template #content>
                    <a-doption
                        v-if="
                            store.state.user?.loginUser?.userName !== '未登录'
                        "
                        value="profile"
                        :style="{ padding: '8px 12px' }"
                    >
                        <template #icon> <icon-user /></template>
                        个人信息
                    </a-doption>
                    <a-doption
                        v-if="
                            store.state.user?.loginUser?.userName !== '未登录'
                        "
                        value="password"
                        :style="{ padding: '8px 12px' }"
                    >
                        <template #icon><icon-lock /></template>
                        修改密码
                    </a-doption>
                    <a-doption
                        v-if="
                            store.state.user?.loginUser?.userName !== '未登录'
                        "
                        value="logout"
                        :style="{ padding: '8px 12px', color: '#F53F3F' }"
                    >
                        <template #icon><icon-export /></template>
                        退出登录
                    </a-doption>
                    <a-doption
                        v-if="store.state.user?.loginUser?.userName == '未登录'"
                        value="login"
                        :style="{ padding: '8px 12px' }"
                    >
                        <template #icon><icon-login /></template>
                        立即登录
                    </a-doption>
                </template>
            </a-dropdown>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { routes } from "../router/routes";
import { useStore } from "vuex";
import {
    IconDown,
    IconUser,
    IconLock,
    IconExport,
} from "@arco-design/web-vue/es/icon";
import { Message, Modal } from "@arco-design/web-vue";
import checkAccess from "@/access/checkAccess";
import accessEnum from "@/access/accessEnum";
import { UserControllerService } from "../../generated";
const router = useRouter();
const route = useRoute();
const store = useStore();
const loginUser = store.state.user.loginUser;

//显示路由
const showRoutes = computed(() => {
    return routes.filter((item, index) => {
        //meta过滤
        if (item.meta?.hideInMenu) {
            return false;
        }
        //权限过滤,false -->return false
        if (
            !checkAccess(
                store.state.user.loginUser,
                item.meta?.access as string,
            )
        ) {
            return false;
        }
        return true;
    });
});

router.afterEach((to, from, failure) => {
    selectedKeys.value = [to.path];
});

const selectedKeys = ref([route.path]);

//点击菜单
const doMenuClick = (key: string) => {
    router.push({
        path: key,
    });
};

const handleUserAction = async (value: string) => {
    switch (value) {
        case "profile":
            router.push("/console/profile");
            break;
        case "password":
            router.push("/console/chpasswd");
            break;
        case "logout":
            Modal.confirm({
                title: "确认退出登录",
                content: "退出登录后将无法继续操作，是否确认退出？",
                onText: "确认退出",
                cancelText: "取消",
                async onOk() {
                    try {
                        await UserControllerService.userLogoutUsingPost();
                        await store.dispatch("user/logout");
                        Message.success("退出登录成功");
                        router.push("/user/login");
                    } catch (error) {
                        Message.error("退出登录失败，请重试");
                        console.error("退出登录失败:", error);
                    }
                },
            });
            break;
        case "login":
            router.push("/user/login");
            break;
    }
};
</script>

<style scoped>
.title-bar {
    display: flex;
    align-items: center;
}

.logo {
    height: 48px;
}
.title {
    color: #444;
    margin-left: 16px;
}

.user-info {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 48px;
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-neutral-2);
    }
}

.arco-btn {
    transition: transform 0.2s;
    &:hover {
        transform: translateX(8px);
    }
}

:deep(.arco-dropdown-option) {
    min-width: 120px;

    .arco-icon {
        margin-right: 8px;
    }
}

:deep(.arco-dropdown-option-content) {
    display: flex;
    align-items: center;
}
</style>
