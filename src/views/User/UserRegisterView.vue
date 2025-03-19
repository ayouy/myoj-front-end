<template>
  <div class="auth-container">
    <a-card class="auth-card">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="logo" class="logo" />
        <h2 class="title">用户注册</h2>
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

        <a-form-item field="nickname" label="昵称" required>
          <a-input
            v-model="form.nickname"
            placeholder="请输入昵称"
            allow-clear
            :max-length="20"
          />
        </a-form-item>

        <a-form-item field="email" label="邮箱" required>
          <a-input
            v-model="form.email"
            placeholder="请输入邮箱"
            allow-clear
          />
        </a-form-item>

        <a-form-item field="userPassword" label="密码" required>
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
            :max-length="32"
          />
        </a-form-item>

        <a-form-item field="checkPassword" label="确认密码" required>
          <a-input-password
            v-model="form.checkPassword"
            placeholder="请再次输入密码"
          />
        </a-form-item>

        <a-form-item field="captcha" label="验证码" required>
          <div class="captcha-container">
            <a-input
              v-model="form.captcha"
              placeholder="请输入验证码"
              :max-length="6"
            />
            <a-button
              type="outline"
              :disabled="captchaCountdown > 0"
              @click="sendCaptcha"
              class="captcha-btn"
            >
              {{ captchaCountdown > 0 ? `${captchaCountdown}s` : '获取验证码' }}
            </a-button>
          </div>
        </a-form-item>

        <a-form-item>
          <div class="button-container">
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              class="register-btn"
              long
            >
              注册
            </a-button>
          </div>
          <div class="login-container">
            <span>已有账号？</span>
            <a-link @click="goToLogin">立即登录</a-link>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  UserRegisterRequest, 
  UserControllerService 
} from '../../../generated'
import { Message } from '@arco-design/web-vue'

const router = useRouter()
const form = reactive({
  userAccount: '',
  nickname: '',
  email: '',
  userPassword: '',
  checkPassword: '',
  captcha: ''
} as UserRegisterRequest)

const loading = ref(false)
const captchaCountdown = ref(0)

const rules = {
  userAccount: [
    { required: true, message: '请输入账号' },
    { minLength: 4, message: '账号长度至少4位' },
    { maxLength: 20, message: '账号长度不能超过20位' }
  ],
  nickname: [
    { required: true, message: '请输入昵称' },
    { minLength: 2, message: '昵称长度至少2位' },
    { maxLength: 20, message: '昵称长度不能超过20位' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入有效的邮箱地址' }
  ],
  userPassword: [
    { required: true, message: '请输入密码' },
    { minLength: 8, message: '密码长度至少8位' },
    { maxLength: 32, message: '密码长度不能超过32位' },
    { 
      validator: (value: string) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value),
      message: '密码必须包含字母和数字'
    }
  ],
  checkPassword: [
    { required: true, message: '请再次输入密码' },
    { 
      validator: (value: string) => value === form.userPassword,
      message: '两次输入的密码不一致'
    }
  ],
  captcha: [
    { required: true, message: '请输入验证码' },
    { length: 6, message: '验证码长度为6位' }
  ]
}

const sendCaptcha = async () => {
  if (!form.email) {
    Message.error('请输入邮箱地址')
    return
  }

  try {
    await UserControllerService.sendCaptchaUsingPost({ email: form.email })
    Message.success('验证码已发送')
    captchaCountdown.value = 60
    const timer = setInterval(() => {
      captchaCountdown.value--
      if (captchaCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error: any) {
    Message.error(error.message || '验证码发送失败')
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    const res = await UserControllerService.userRegisterUsingPost(form)
    
    if (res.code === 0) {
      Message.success('注册成功')
      router.push({
        path: '/user/login',
        replace: true,
      })
    } else {
      Message.error(`注册失败：${res.message}`)
    }
  } catch (error: any) {
    Message.error(error.message || '请求失败，请检查网络连接')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/user/login')
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
  .captcha-container {
    display: flex;
    gap: 12px;

    .captcha-btn {
      width: 120px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(22, 93, 255, 0.1);
      }

      &:active {
        transform: translateY(0);
        box-shadow: none;
      }
    }
  }

  .button-container {
    margin-top: 24px;
  }

  .login-container {
    margin-top: 16px;
    text-align: center;
    color: #86909c;

    span {
      margin-right: 8px;
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
    border-radius: 8px;
    height: 44px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(22, 93, 255, 0.05);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(22, 93, 255, 0.1);
    }

    &:active {
      transform: translateY(0);
      box-shadow: none;
    }
  }
}
</style>
