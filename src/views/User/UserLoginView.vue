<template>
  <div class="auth-container">
    <a-card class="auth-card">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="logo" class="logo" />
        <h2 class="title">用户登录</h2>
      </div>
      <a-form
        class="auth-form"
        :model="form"
        :rules="rules"
        @submit="handleSubmit"
        auto-label-width
      >
        <a-form-item field="userAccount" label="账号" required>
          <a-input
            v-model="form.userAccount"
            placeholder="请输入账号"
            allow-clear
            :max-length="20"
          />
        </a-form-item>

        <a-form-item field="userPassword" label="密码" required>
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
            :max-length="32"
          />
        </a-form-item>

        <div class="extra-options">
          <a-checkbox v-model="rememberMe">记住我</a-checkbox>
          <a-link @click="goToForgotPassword">忘记密码？</a-link>
        </div>

        <a-form-item>
          <div class="button-container">
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              class="login-btn"
              long
            >
              登录
            </a-button>
          </div>
          <div class="register-container">
            <span>没有账号？</span>
            <a-link @click="goToRegister">立即注册</a-link>
          </div>
        </a-form-item>

        <div class="social-login">
          <div class="divider">或使用以下方式登录</div>
          <div class="social-buttons">
            <a-button 
              class="social-btn wechat" 
              @click="handleWechatLogin"
              long
            >
              <icon-wechat />
              微信登录
            </a-button>
            <a-button 
              class="social-btn github" 
              @click="handleGithubLogin"
              long
            >
              <icon-github />
              GitHub登录
            </a-button>
          </div>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  UserLoginRequest, 
  UserControllerService 
} from '../../../generated'
import { Message } from '@arco-design/web-vue'
import { IconWechat, IconGithub } from '@arco-design/web-vue/es/icon'

const router = useRouter()
const form = reactive({
  userAccount: '',
  userPassword: '',
} as UserLoginRequest)

const rememberMe = ref(false)
const loading = ref(false)

const rules = {
  userAccount: [
    { required: true, message: '请输入账号' },
    { minLength: 4, message: '账号长度至少4位' },
    { maxLength: 20, message: '账号长度不能超过20位' }
  ],
  userPassword: [
    { required: true, message: '请输入密码' },
    { minLength: 8, message: '密码长度至少8位' },
    { maxLength: 32, message: '密码长度不能超过32位' }
  ]
}

const handleSubmit = async () => {
  try {
    loading.value = true
    const res = await UserControllerService.userLoginUsingPost(form)
    
    if (res.code === 0) {
      Message.success('登录成功')
      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
      }
      router.push({
        path: '/',
        replace: true,
      })
    } else {
      Message.error(`登录失败：${res.message}`)
    }
  } catch (error: any) {
    Message.error(error.message || '请求失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/user/register')
}

const goToForgotPassword = () => {
  router.push('/user/forgot-password')
}

const handleWechatLogin = () => {
  Message.info('微信登录功能开发中')
}

const handleGithubLogin = () => {
  Message.info('GitHub登录功能开发中')
}
</script>

<style scoped lang="less">
.auth-container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(145deg, #f0f5ff, #d6e4ff);
  animation: gradientAnimation 10s ease infinite;
}

@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.auth-card {
  width: 480px;
  max-width: 90vw;
  padding: 40px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 12px 24px rgba(22, 93, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(22, 93, 255, 0.15);
  }
}

.logo-container {
  text-align: center;
  margin-bottom: 32px;

  .logo {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
  }

  .title {
    color: #1d2129;
    font-weight: 500;
    font-size: 20px;
  }
}

.auth-form {
  .extra-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0;
  }

  .button-container {
    margin-top: 24px;
  }

  .register-container {
    margin-top: 16px;
    text-align: center;
    color: #86909c;

    span {
      margin-right: 8px;
    }
  }

  .social-login {
    margin-top: 32px;

    .divider {
      position: relative;
      text-align: center;
      color: #86909c;
      margin: 24px 0;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 45%;
        height: 1px;
        background: #e5e6eb;
      }

      &::before {
        left: 0;
      }

      &::after {
        right: 0;
      }
    }

    .social-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 16px;

      .social-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s;

        &.wechat {
          background: #07c160;
          color: #fff;
          border-color: #07c160;

          &:hover {
            background: #06ad56;
            border-color: #06ad56;
          }
        }

        &.github {
          background: #24292e;
          color: #fff;
          border-color: #24292e;

          &:hover {
            background: #1b1f23;
            border-color: #1b1f23;
          }
        }
      }
    }
  }

  :deep(.arco-form-item) {
    margin-bottom: 20px;
  }

  :deep(.arco-input),
  :deep(.arco-input-password) {
    border-radius: 8px;
    padding: 12px 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-width: 2px;

    &:hover {
      border-color: #4080ff;
      transform: translateY(-1px);
    }

    &:focus {
      border-color: #165dff;
      box-shadow: 0 0 0 4px rgba(22, 93, 255, 0.15);
      transform: translateY(-2px);
    }

    &::placeholder {
      color: #86909c;
      transition: opacity 0.2s ease;
    }

    &:focus::placeholder {
      opacity: 0.5;
    }
  }

  :deep(.arco-btn-primary) {
    background: #165dff;
    border: none;
    border-radius: 8px;
    height: 44px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &:hover {
      background: #4080ff;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(22, 93, 255, 0.2);
    }

    &:active {
      transform: translateY(0);
      box-shadow: none;
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300%;
      height: 300%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 10%, transparent 10.01%);
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.5s ease;
    }

    &:active::after {
      transform: translate(-50%, -50%) scale(1);
      transition: transform 0s;
    }

    &.arco-btn-loading {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        animation: loading 1.5s infinite;
      }
    }
  }

  @keyframes loading {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  :deep(.arco-btn-outline) {
    color: #165dff;
    border-color: #165dff;
    border-radius: 6px;
    height: 40px;
    font-size: 14px;
    transition: all 0.2s;

    &:hover {
      background: rgba(22, 93, 255, 0.05);
    }
  }
}
</style>
