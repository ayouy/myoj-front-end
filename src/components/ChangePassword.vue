<template>
  <div class="auth-container">
    <div class="auth-background"></div>
    <a-card class="auth-card">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="logo" class="logo" />
        <h2 class="title">修改密码</h2>
      </div>
      <a-form
        class="auth-form"
        :model="form"
        @submit="handleSubmit"
        auto-label-width
      >
        <a-form-item
          field="oldPassword"
          label="原密码"
          :rules="[{ required: true, message: '请输入原密码' }]"
        >
          <a-input-password
            v-model="form.oldPassword"
            placeholder="请输入原密码"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          field="newPassword"
          label="新密码"
          :rules="[{ required: true, message: '请输入新密码' }]"
        >
          <a-input-password
            v-model="form.newPassword"
            placeholder="请输入新密码"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          field="confirmPassword"
          label="确认密码"
          :rules="[{ required: true, message: '请再次输入新密码' }]"
        >
          <a-input-password
            v-model="form.confirmPassword"
            placeholder="请再次输入新密码"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-space :size="16">
            <a-button
              type="primary"
              html-type="submit"
              long
              :loading="loading"
            >
              确认修改
            </a-button>
            <a-button
              type="outline"
              long
              @click="goBack"
            >
              返回
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
import { IconLock } from "@arco-design/web-vue/es/icon";

const router = useRouter();
const loading = ref(false);

const form = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const handleSubmit = async () => {
  try {
    loading.value = true;
    // TODO: 实现修改密码逻辑
    Message.success("密码修改成功");
    router.push("/user/profile");
  } catch (error) {
    Message.error("密码修改失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="less">
@import "@/views/User/UserLoginView.vue";
</style>
