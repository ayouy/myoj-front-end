<template>
    <div id="UserRegister">
        <h2 style="margin-bottom: 16px">用户注册</h2>
        <a-form
            style="max-width: 480px; margin: 0 auto"
            label-align="left"
            auto-label-width
            :model="form"
            @submit="handleSubmit"
        >
            <a-form-item field="userAccount" label="账号">
                <a-input v-model="form.userAccount" placeholder="请输入账号" />
            </a-form-item>
            <a-form-item
                field="userPassword"
                tooltip="密码不少于8位,且包含字母和数字"
                label="密码"
            >
                <a-input-password
                    v-model="form.userPassword"
                    placeholder="请输入密码"
                />
            </a-form-item>
            <a-form-item
                field="checkPassword"
                label="确认密码"
            >
                <a-input-password
                    v-model="form.checkPassword"
                    placeholder="请再次输入密码"
                />
            </a-form-item>
            <a-form-item>
                <a-button html-type="submit" type="primary" style="width: 120px"
                    >注册</a-button
                >
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { UserRegisterRequest, UserControllerService } from "../../../generated";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { Message } from '@arco-design/web-vue';

const router = useRouter();
const form = reactive({
    userAccount: "",
    userPassword: "",
    checkPassword: "",
} as UserRegisterRequest);

const validatePassword = () => {
    if (form.userPassword !== form.checkPassword) {
        Message.error("两次输入的密码不一致");
        return false;
    }
    // 可添加更多密码规则验证
    return true;
};

const handleSubmit = async () => {
    if (!validatePassword()) return;
    
    try {
        const res = await UserControllerService.userRegisterUsingPost(form);
        if (res.code === 0) {
            Message.success("注册成功");
            router.push({
                path: "/user/login",
                replace: true,
            });
        } else {
            Message.error("注册失败：" + res.message);
        }
    } catch (error) {
        Message.error("请求失败，请检查网络连接");
    }
};
</script>

<style>
#UserRegister {
    min-height: 300px;
}
</style>