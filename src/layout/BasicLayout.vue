<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>

<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      
      <a-layout-content class="content">
        <div class="content-container">
          <router-view />
        </div>
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

<style scoped lang="less">
#basicLayout {
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 0;
  }

  .content {
    background: #f8f9fa;
    padding: 24px 0;
    
    .content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }
  }

  .footer {
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    padding: 24px 0;
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      
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

@media (max-width: 768px) {
  #basicLayout {
    .content {
      padding: 16px 0;
      
      .content-container {
        padding: 0 16px;
      }
    }
    
    .footer {
      padding: 16px 0;
      
      .footer-content {
        .links {
          flex-direction: column;
          gap: 8px;
        }
      }
    }
  }
}
</style>
