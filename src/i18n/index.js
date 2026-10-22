const fs = require('fs');
const path = require('path');

class I18n {
  constructor() {
    this.currentLocale = 'en';
    this.translations = {};
    this.init();
  }

  init() {
    // 检测系统语言
    this.detectLocale();

    // 加载语言文件
    this.loadTranslations();
  }

  detectLocale() {
    const supportedLanguages = ['zh', 'en'];
    let languageCode = null;

    // 1. 环境变量优先（仅作为手动覆盖手段，日常使用无需设置）
    const envLocale = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES;
    if (envLocale) {
      // 提取语言代码 (例如：zh_CN.UTF-8 -> zh, en_US.UTF-8 -> en)
      languageCode = envLocale.split('_')[0].split('.')[0].toLowerCase();
    } else {
      // 2. 无环境变量时直接读取系统区域设置（如 zh-CN、en-US），Windows 下也有效
      try {
        const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale || '';
        languageCode = systemLocale.split('-')[0].toLowerCase();
      } catch (error) {
        languageCode = null;
      }
    }

    // 3. 默认使用中文
    this.currentLocale = languageCode && supportedLanguages.includes(languageCode)
      ? languageCode
      : 'zh';
  }

  loadTranslations() {
    try {
      // 加载当前语言的翻译文件
      const translationPath = path.join(__dirname, `${this.currentLocale}.json`);
      const translationData = fs.readFileSync(translationPath, 'utf8');
      this.translations = JSON.parse(translationData);
    } catch (error) {
      // 如果加载失败，回退到英文
      console.warn(`Warning: Could not load translations for '${this.currentLocale}', falling back to English`);
      this.currentLocale = 'en';
      try {
        const englishPath = path.join(__dirname, 'en.json');
        const englishData = fs.readFileSync(englishPath, 'utf8');
        this.translations = JSON.parse(englishData);
      } catch (englishError) {
        console.error('Error: Could not load English translations either');
        this.translations = {};
      }
    }
  }

  // 获取翻译文本，支持嵌套键和参数替换
  t(key, ...args) {
    const keys = key.split('.');
    let value = this.translations;

    // 遍历嵌套键
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 如果找不到翻译，返回键本身
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
    }

    // 如果最终值不是字符串，返回键
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`);
      return key;
    }

    // 参数替换 (支持 %s 和 %d 格式)
    if (args.length > 0) {
      return this.formatString(value, ...args);
    }

    return value;
  }

  // 字符串格式化
  formatString(str, ...args) {
    let argIndex = 0;
    return str.replace(/%[sd]/g, (match) => {
      if (argIndex < args.length) {
        const arg = args[argIndex++];
        if (match === '%d') {
          return Number(arg).toString();
        } else {
          return String(arg);
        }
      }
      return match;
    });
  }

  // 获取当前语言
  getCurrentLocale() {
    return this.currentLocale;
  }

  // 手动设置语言
  setLocale(locale) {
    if (locale !== this.currentLocale) {
      this.currentLocale = locale;
      this.loadTranslations();
    }
  }

  // 获取可用语言列表
  getAvailableLocales() {
    const i18nDir = __dirname;
    const files = fs.readdirSync(i18nDir);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  }
}

// 创建全局实例
const i18n = new I18n();

module.exports = i18n;