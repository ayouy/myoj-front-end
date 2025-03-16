<template>
    <a-card title="修改密码" :bordered="false">
        <a-form :model="form" layout="vertical">
            <a-form-item label="旧密码">
                <a-input-password v-model:value="form.oldPassword" placeholder="请输入旧密码" />
            </a-form-item>
            <a-form-item label="新密码">
                <a-input-password v-model:value="form.newPassword" placeholder="请输入新密码" />
            </a-form-item>
            <a-form-item label="确认新密码">
                <a-input-password v-model:value="form.confirmPassword" placeholder="确认新密码" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSubmit">修改密码</a-button>
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Message from "@arco-design/web-vue";

const form = ref({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
});

const handleSubmit = () => {
    if (form.value.newPassword !== form.value.confirmPassword) {
        Message.error("新密码和确认密码不一致");
        return;
    }
    Message.success("密码修改成功！");
};
</script>

<style scoped>
</style>
