<template>
  <div class="user-layout">
    <a-layout class="layout">
      <a-layout-header class="header">
        <div class="header-content">
          <img src="@/assets/logo.png" alt="logo" class="logo" />
          <h1 class="title">在线编程平台</h1>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <a-layout-footer class="footer">
        <div class="footer-content">
          <div class="links">
            <a-link href="/about">关于我们</a-link>
            <a-link href="/privacy">隐私政策</a-link>
            <a-link href="/terms">服务条款</a-link>
          </div>
          <div class="copyright">
            © 2025 在线编程平台. All rights reserved.
          </div>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
</script>

<style scoped lang="less">
.user-layout {
  min-height: 100vh;
  background: url('@/assets/oj-bg.jpg') no-repeat center center fixed;
  background-size: cover;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.2) 100%
    );
    z-index: 1;
  }

  .layout {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    background: transparent;
  }

  .header {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;

    .header-content {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 16px;

      .logo {
        height: 40px;
      }

      .title {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: #1d2129;
      }
    }
  }

  .content {
    padding: 24px;
    margin: 0 auto;
    max-width: 1200px;
  }

  .footer {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding: 24px;
    text-align: center;

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;

      .links {
        margin-bottom: 8px;

        .arco-link {
          margin: 0 12px;
          color: #1d2129;
          font-size: 14px;

          &:hover {
            color: #165dff;
          }
        }
      }

      .copyright {
        color: #86909c;
        font-size: 12px;
      }
    }
  }
}
</style>
