import { createI18n } from 'vue-i18n';

import ivenUS from '@arco-design/web-react/es/locale/en-US';
import ivzhCN from '@arco-design/web-react/es/locale/zh-CN';

import elenUS from 'element-plus/es/locale/lang/en';
import elzhCN from 'element-plus/es/locale/lang/zh-cn';

import enUSOj from './oj/en-US';
import zhCNOj from './oj/zh-CN';

import enUSAdmin from './admin/en-US';
import zhCNAdmin from './admin/zh-CN';

// 定义消息对象
const messages = {};

// 语言配置数组
const languages = [
  { value: 'en-US', label: 'English', iv: ivenUS, el: elenUS },
  { value: 'zh-CN', label: '简体中文', iv: ivzhCN, el: elzhCN },
];

languages.forEach(lang => {
  const locale = lang.value;

  // 获取并合并 OJ 翻译
  const ojMessages = require(`./oj/${locale}`).m;
  const adminMessages = require(`./admin/${locale}`).m;
  const m = { ...ojMessages, ...adminMessages };

  // 合并 UI 翻译
  const ui = { ...lang.iv, ...lang.el };

  // 确保每个语言包都包含 Language 和 Theme 键
  m.Language = m.Language || 'Language';  // 如果没有，默认值为 'Language'
  m.Theme = m.Theme || 'Theme';  // 如果没有，默认值为 'Theme'

  // 将合并后的翻译内容赋给 messages
  messages[locale] = { m, ...ui };
});

// 导出 vue-i18n 配置
export default createI18n({
  locale: 'zh-CN', // 默认语言
  messages: messages, // 所有合并后的语言包
});
