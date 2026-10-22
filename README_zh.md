[English](README.md) | [中文](README_zh.md)

# ATM - AI工具管理器

🔧 用于管理npm安装的AI开发工具的命令行界面。

## 功能特性

- **安装工具**: 安装当前未安装的AI开发工具
- **查询工具**: 检查已安装工具、版本信息和可用更新
- **更新工具**: 将已安装工具更新到最新版本
- **卸载工具**: 从系统中移除不需要的工具
- **多语言支持**: 自动检测系统语言（中文/英文）
- **自动更新检查**: 启动时检查新版本并提供打开仓库的选项

## 安装方法

### 从Git仓库安装

1. 克隆仓库：
   ```bash
   git clone https://github.com/1e0n/ai-tools-manager.git
   cd ai-tools-manager
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 全局安装：
   ```bash
   npm install -g .
   ```

4. 验证安装：
   ```bash
   atm
   ```

## 使用方法

运行ATM工具：
```bash
atm
```

应用程序将显示交互式菜单，您可以：
- 安装新的AI工具
- 查询已安装工具并检查更新
- 将现有工具更新到最新版本
- 卸载不再需要的工具

## 支持的工具

目前支持以下AI开发工具：

- **Claude Code** - Anthropic官方Claude AI命令行工具
- **Codex** - OpenAI Codex命令行工具
- **Gemini CLI** - Google Gemini AI命令行接口
- **Antigravity ACP** - Google Antigravity（agy CLI）的 ACP 服务器
- **GLM Coding Agent** - 智谱 Z.ai GLM Coding Plan ACP 编程代理
- **Grok Build** - xAI 官方 Grok 终端编程代理
- **Copilot CLI** - GitHub Copilot命令行工具，将Copilot编程代理的强大功能直接带到您的终端
- **OpenCode** - 为终端而生的AI编程代理
- **Qwen Code** - 通义千问AI开发工具

## 配置

工具配置在 `src/tools-config.json` 文件中。每个工具条目包含：

- `name`: 工具的显示名称
- `package`: 用于安装的NPM包名
- `description`: 工具的简要描述

要添加新工具，请编辑配置文件并在 `tools` 数组中添加新条目。

## 本地化

ATM支持多种语言并自动检测您的系统语言：

- **中文 (zh)**: 中文界面，自动检测中文系统环境
- **英文 (en)**: 英文界面，默认回退语言

### 语言检测

应用程序自动从环境变量检测您的系统语言：
- `LANG`
- `LC_ALL`
- `LC_MESSAGES`

如果您的系统语言不受支持，则默认使用英文。

### 支持的语言

目前支持的语言：
- `zh` - 简体中文
- `en` - English（英文）

### 手动语言覆盖

您可以通过修改环境变量手动设置语言：

```bash
# 强制英文
LANG=en_US.UTF-8 atm

# 强制中文
LANG=zh_CN.UTF-8 atm
```

## 高级用法

### 禁用版本检查

如果您想要禁用启动时的自动版本检查：

```bash
ATM_SKIP_VERSION_CHECK=true atm
```

这对于自动化脚本或网络问题时很有用。

## 系统要求

- Node.js >= 14.0.0
- npm（包管理）
- Git（用于克隆仓库）

## 贡献

1. Fork 仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

MIT