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

   > **提示**：新版 npm 这样装出来的是一个指向源码目录的**符号链接**——目录一旦移动或删除，全局 `atm` 命令就会失效。想要独立拷贝，请看下文"高级用法"里的*本地离线安装*。

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
- **Antigravity ACP** - Google Antigravity（agy CLI）的 ACP 服务器（依赖 bun：`npm install -g bun`）
- **Antigravity CLI** - Google Antigravity 命令行（agy），command 类型管理（官方安装器 + `agy update`，非 npm）
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

工具默认按 npm 包管理。对于**不走 npm 分发**的工具（如 Antigravity CLI），使用 `command` 类型及以下可选字段：

- `type`：`"command"` —— 启用非 npm 方式管理
- `versionCommand`：用于检测工具是否安装（退出码 0 即已安装）并读取版本号
- `installCommand`：（可选）安装命令；未配置则不出现在安装列表
- `updateCommand`：（可选）更新命令；因无法预知最新版本号，更新菜单里显示为"检查并更新"
- `uninstallCommand`：（可选）卸载命令；未配置则不支持通过 ATM 卸载

## 本地化

ATM支持多种语言并自动检测您的系统语言：

- **中文 (zh)**: 中文界面，默认语言
- **英文 (en)**: 英文界面，可通过手动覆盖使用

### 语言检测

显示语言按以下顺序确定：

1. 环境变量（仅作为手动覆盖手段，日常使用无需设置）：
   - `LANG`
   - `LC_ALL`
   - `LC_MESSAGES`
2. 操作系统区域设置（如 `zh-CN`、`en-US`）——Windows 下同样有效，无需设置任何环境变量
3. 兜底：中文 (zh)

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

### 本地离线安装（Windows / PowerShell）

新版 npm 下 `npm install -g .` 装出来的是一个指向源码目录的**符号链接**——目录一旦移动或删除，全局 `atm` 命令就会失效。改用 tarball 安装则一定是真实、独立的拷贝；`--offline` 让安装完全走本地 npm 缓存，不会卡在联网请求（审计、registry 元数据）上。

项目自带一键脚本，会自动完成：卸载旧全局安装（含失效符号链接）→ 打包源码 → 离线安装（本地缓存不全时自动回退联网）→ 验证 → 清理：

```powershell
cd I:\ProjectSynthesis\ai-tools-manager
.\install-offline.ps1

# 如果被执行策略拦截：
powershell -ExecutionPolicy Bypass -File .\install-offline.ps1
```

手动等价步骤（即脚本逐行做的事）：

```powershell
npm uninstall -g ai-tools-manager
cd I:\ProjectSynthesis\ai-tools-manager
npm pack --pack-destination .
$tgz = (Get-ChildItem .\ai-tools-manager-*.tgz | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
npm install -g $tgz --no-audit --no-fund --offline   # 缓存不全可去掉 --offline 联网安装
npm ls -g ai-tools-manager
Remove-Item .\ai-tools-manager-*.tgz
```

Git Bash / Linux / macOS 等价命令（`<version>` 替换为实际版本号，如 `1.3.0`）：

```bash
cd /path/to/ai-tools-manager
npm pack --pack-destination .
npm install -g ./ai-tools-manager-<version>.tgz --no-audit --no-fund --offline
npm ls -g ai-tools-manager
rm ./ai-tools-manager-*.tgz
```

> **说明**：`--offline` 要求依赖（chalk、inquirer、ora）已存在于本地 npm 缓存。如果 npm 提示缓存缺失，去掉 `--offline` 参数联网安装即可——自带脚本会自动完成这个回退。

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