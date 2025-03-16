<template>
    <div class="forgot-password-container">
        <a-card class="forgot-password-card" :bordered="false">
            <div class="logo-container">
                <img src="@/assets/logo.png" alt="logo" class="logo" />
                <h2 class="title">忘记密码</h2>
            </div>
            <a-form
                class="forgot-password-form"
                :model="form"
                @submit="handleSubmit"
                auto-label-width
            >
                <a-form-item
                    field="username"
                    label="用户名"
                    :rules="[{ required: true, message: '请输入用户名' }]"
                >
                    <a-input
                        v-model="form.username"
                        placeholder="请输入用户名"
                        allow-clear
                    >
                        <template #prefix>
                            <icon-user />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-input>
                        
                    </a-input>
                </a-form-item>

                <a-form-item>
                    <a-space :size="16">
                        <a-button
                            type="primary"
                            html-type="submit"
                            long
                            :loading="loading"
                        >
                            提交重置请求
                        </a-button>
                        <a-button type="outline" long @click="goToLogin">
                            返回登录
                        </a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { IconUser } from "@arco-design/web-vue/es/icon";

const router = useRouter();
const loading = ref(false);

const form = reactive({
    username: "",
});

const handleSubmit = async () => {
    try {
        loading.value = true;
        Message.success("重置请求已提交");
        router.push("/user/login");
    } catch (error) {
        Message.error("提交失败，请稍后重试");
    } finally {
        loading.value = false;
    }
};

const goToLogin = () => {
    router.push("/user/login");
};
</script>

<style scoped lang="less">
.forgot-password-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.forgot-password-card {
    width: 480px;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    .logo-container {
        text-align: center;
        margin-bottom: 32px;

        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 16px;
        }

        .title {
            color: var(--color-text-1);
            font-weight: 500;
        }
    }

    .forgot-password-form {
        .extra-options {
            display: flex;
            justify-content: space-between;
            margin-bottom: 24px;
        }
    }
}
</style>
