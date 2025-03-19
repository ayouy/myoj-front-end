<template>
  <a-card class="security-card">
    <h2 class="security-title">账户安全</h2>
    <a-tabs type="rounded" class="security-tabs">
      <a-tab-pane key="1" title="修改密码">
        <a-form
          :model="form"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          @submit="handleSubmit"
          class="security-form"
        >
          <a-form-item
            field="email"
            label="邮箱"
            class="form-item"
          >
            <a-input
              v-model="form.email"
              placeholder="请输入邮箱"
              allow-clear
              class="email-input"
            />
          </a-form-item>

          <a-form-item
            field="captcha"
            label="验证码"
            class="form-item"
          >
            <div class="captcha-container">
              <a-input
                v-model="form.captcha"
                placeholder="请输入验证码"
                allow-clear
                class="captcha-input"
              />
              <a-button
                type="primary"
                :disabled="!form.email || isSending"
                @click="sendCaptcha"
                class="captcha-button"
              >
                {{ isSending ? `${countdown}s后重试` : '获取验证码' }}
              </a-button>
            </div>
          </a-form-item>

          <a-form-item
            field="newPassword"
            label="新密码"
            class="form-item"
            extra="密码需包含大小写字母和数字，长度8-16位"
          >
            <a-input-password
              v-model="form.newPassword"
              placeholder="请输入新密码"
              allow-clear
              class="password-input"
            />
          </a-form-item>

          <a-form-item 
            field="confirmPassword" 
            label="确认新密码"
            class="form-item"
            extra="请再次输入新密码以确认"
          >
            <a-input-password
              v-model="form.confirmPassword"
              placeholder="请再次输入新密码"
              allow-clear
              class="password-input"
            />
          </a-form-item>

          <a-form-item class="submit-item">
            <a-button
              html-type="submit"
              type="primary"
              class="submit-button"
            >
              提交修改
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="2" title="安全提示">
        <div class="tips-container">
          <div class="tip-item">
            <icon-lock class="tip-icon" />
            <div class="tip-content">
              <h3>定期修改密码</h3>
              <p>建议每90天修改一次密码</p>
            </div>
          </div>

          <div class="tip-item">
            <icon-shield class="tip-icon" />
            <div class="tip-content">
              <h3>使用强密码</h3>
              <p>密码应包含大小写字母和数字</p>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script setup lang="ts">
import { CaptchaControllerService, UserControllerService } from "../../../generated";
import { reactive, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { useStore } from "vuex";

const store = useStore();
const form = reactive({
  email: "",
  captcha: "",
  newPassword: "",
  confirmPassword: "",
});

const isSending = ref(false);
const countdown = ref(60);

const validateEmail = () => {
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailReg.test(form.email)) {
    Message.error("请输入有效的邮箱地址");
    return false;
  }
  return true;
};

const sendCaptcha = async () => {
  if (!validateEmail()) return;
  
  try {
    isSending.value = true;
    const res = await CaptchaControllerService.sendCaptchaUsingPost(form.email);
    
    if (res.code === 0) {
      Message.success("验证码已发送");
      startCountdown();
    } else {
      Message.error("发送失败：" + res.message);
      isSending.value = false;
    }
  } catch (error) {
    Message.error("请求失败，请检查网络连接");
    isSending.value = false;
  }
};

const startCountdown = () => {
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      isSending.value = false;
    }
  }, 1000);
};

const validateCaptcha = () => {
  if (!form.captcha) {
    Message.error("请输入验证码");
    return false;
  }
  if (form.captcha.length !== 6) {
    Message.error("验证码应为6位数字");
    return false;
  }
  return true;
};

const validatePassword = () => {
  if (form.newPassword !== form.confirmPassword) {
    Message.error("两次输入的密码不一致");
    return false;
  }
  if (form.newPassword?.length < 8) {
    Message.error("密码长度不得少于8位");
    return false;
  }
  const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
  if (!passwordReg.test(form.newPassword)) {
    Message.error("新密码必须包含字母和数字");
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (!validateEmail() || !validateCaptcha() || !validatePassword()) return;

  try {
    const res = await UserControllerService.updatePasswordUsingPost({
      email: form.email,
      captcha: form.captcha,
      newPassword: form.newPassword,
    });
    
    if (res.code === 0) {
      Message.success("密码修改成功");
      // 重置表单
      form.email = "";
      form.captcha = "";
      form.newPassword = "";
      form.confirmPassword = "";
    } else {
      Message.error("修改失败：" + res.message);
    }
  } catch (error) {
    Message.error("请求失败，请检查网络连接");
  }
};
</script>

<style scoped lang="less">
.security-card {
  width: 100%;
  max-width: 1000px;
  margin: 24px auto;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  background: var(--color-bg-1);
  transition: all 0.3s ease;
  animation: card-enter 0.5s ease-out;
}

@keyframes card-enter {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.security-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
  transform: translateY(-2px);
}

.security-title {
  text-align: center;
  margin-bottom: 24px;
  color: var(--color-text-1);
  font-size: 20px;
  font-weight: 500;
  animation: title-float 4s ease-in-out infinite;
}

@keyframes title-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.security-form {
  padding: 16px;
}

.form-item {
  margin-bottom: 20px;
}

.email-input,
.captcha-input,
.password-input {
  width: 75%;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.email-input:hover,
.captcha-input:hover,
.password-input:hover {
  border-color: var(--color-primary);
}

.captcha-container {
  display: flex;
  gap: 12px;
}

.captcha-button {
  white-space: nowrap;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 10%, transparent 10.01%);
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s ease;
  }
}

.captcha-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.captcha-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--color-primary-rgb), 0.2);
  
  &::after {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    transition: transform 0s, opacity 0s;
  }
}

.password-input:hover {
  border-color: var(--color-primary);
}

.tips-container {
  padding: 16px;
}

.tip-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: var(--color-bg-2);
  margin-bottom: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  .tip-icon {
    font-size: 20px;
    color: var(--color-primary);
    margin-right: 12px;
    animation: icon-float 3s ease-in-out infinite;
  }
  
  .tip-content {
    h3 {
      margin: 0;
      font-size: 14px;
      color: var(--color-text-1);
    }
    
    p {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--color-text-2);
    }
  }
}

@keyframes icon-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.submit-button {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  animation: button-glow 2s ease-in-out infinite;
}

@keyframes button-glow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(var(--color-primary-rgb), 0.3);
  }
  50% {
    box-shadow: 0 0 16px rgba(var(--color-primary-rgb), 0.5);
  }
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.2);
  animation-play-state: paused;
}

@media (max-width: 768px) {
  .security-card {
    margin: 16px;
    padding: 16px;
  }
  
  .security-title {
    font-size: 18px;
  }
}
</style>