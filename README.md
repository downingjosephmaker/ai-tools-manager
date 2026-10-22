[English](README.md) | [中文](README_zh.md)

# ATM - AI Tools Manager

🔧 A command-line interface for managing npm-installed AI development tools.

## Features

- **Install Tools**: Install AI development tools that aren't currently installed
- **Query Tools**: Check installed tools, their versions, and available updates
- **Update Tools**: Update installed tools to their latest versions
- **Uninstall Tools**: Remove installed tools from your system
- **Multi-language Support**: Automatically detects system language (Chinese/English)
- **Auto Update Check**: Checks for newer versions on startup and offers to open the repository

## Installation

### From Git Repository

1. Clone the repository:
   ```bash
   git clone https://github.com/1e0n/ai-tools-manager.git
   cd ai-tools-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install globally:
   ```bash
   npm install -g .
   ```

   > **Tip**: On modern npm this installs a **symlink** to the source folder — if the folder is later moved or deleted, the global `atm` command breaks. For a standalone copy, see *Local Offline Installation* under Advanced Usage below.

4. Verify installation:
   ```bash
   atm
   ```

## Usage

Run the ATM tool:
```bash
atm
```

The application will present an interactive menu where you can:
- Install new AI tools
- Query installed tools and check for updates
- Update existing tools to latest versions
- Uninstall tools you no longer need

## Supported Tools

The following AI development tools are supported:

- **Claude Code** - Anthropic's official CLI for Claude AI
- **Codex** - OpenAI Codex CLI tool
- **Gemini CLI** - Google Gemini AI command line interface
- **Antigravity ACP** - ACP server for Google Antigravity's `agy` CLI
- **Antigravity CLI** - Google Antigravity CLI (`agy`), managed via command type (official installer + `agy update`, not npm)
- **GLM Coding Agent** - Z.ai (Zhipu) GLM Coding Plan ACP coding agent
- **Grok Build** - xAI's official Grok coding agent CLI
- **Copilot CLI** - GitHub Copilot CLI brings the power of Copilot coding agent directly to your terminal
- **OpenCode** - AI coding agent, built for the terminal
- **Qwen Code** - Qwen AI development tools

## Configuration

Tools are configured in `src/tools-config.json`. Each tool entry contains:

- `name`: Display name for the tool
- `package`: NPM package name for installation
- `description`: Brief description of the tool

To add new tools, edit the configuration file and add new entries to the `tools` array.

Tools are npm packages by default. For tools that are **not distributed via npm** (e.g. the Antigravity CLI), use the `command` type with these optional fields:

- `type`: `"command"` — enables non-npm management
- `versionCommand`: run to detect the tool (exit code 0 = installed) and read its version
- `installCommand`: (optional) installs the tool; without it the tool is not offered for installation
- `updateCommand`: (optional) updates the tool; shown in the Update menu as "check & update" since the latest version cannot be known in advance
- `uninstallCommand`: (optional) uninstalls the tool; without it the tool is not offered for uninstallation

## Localization

ATM supports multiple languages and automatically detects your system language:

- **Chinese (zh)**: 中文界面，自动检测中文系统环境
- **English (en)**: English interface, default fallback language

### Language Detection

The application automatically detects your system language from environment variables:
- `LANG`
- `LC_ALL`
- `LC_MESSAGES`

If your system language is not supported, it defaults to English.

### Supported Languages

Currently supported languages:
- `zh` - 简体中文 (Simplified Chinese)
- `en` - English

### Manual Language Override

You can manually set the language by modifying the environment variable:

```bash
# Force English
LANG=en_US.UTF-8 atm

# Force Chinese
LANG=zh_CN.UTF-8 atm
```

## Advanced Usage

### Disable Version Check

If you want to disable the automatic version check on startup:

```bash
ATM_SKIP_VERSION_CHECK=true atm
```

This can be useful for automated scripts or if you're experiencing network issues.

### Local Offline Installation (Windows / PowerShell)

`npm install -g .` on modern npm installs a **symlink** to the source folder — once the folder is moved or deleted, the global `atm` command breaks. Installing from a packed tarball always produces a real, standalone copy, and `--offline` resolves everything from the local npm cache so the install never stalls on network requests (audit, registry metadata).

The bundled script does everything for you — it removes the previous global install (including stale symlinks), packs the source, installs fully offline (falling back to online automatically if the local cache is incomplete), verifies, and cleans up:

```powershell
cd I:\ProjectSynthesis\ai-tools-manager
.\install-offline.ps1

# If blocked by execution policy:
powershell -ExecutionPolicy Bypass -File .\install-offline.ps1
```

Manual equivalent (what the script does step by step):

```powershell
npm uninstall -g ai-tools-manager
cd I:\ProjectSynthesis\ai-tools-manager
npm pack --pack-destination .
$tgz = (Get-ChildItem .\ai-tools-manager-*.tgz | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
npm install -g $tgz --no-audit --no-fund --offline   # drop --offline to allow network
npm ls -g ai-tools-manager
Remove-Item .\ai-tools-manager-*.tgz
```

Git Bash / Linux / macOS equivalent (replace `<version>` with the packed version, e.g. `1.3.0`):

```bash
cd /path/to/ai-tools-manager
npm pack --pack-destination .
npm install -g ./ai-tools-manager-<version>.tgz --no-audit --no-fund --offline
npm ls -g ai-tools-manager
rm ./ai-tools-manager-*.tgz
```

> **Note**: `--offline` requires the dependencies (chalk, inquirer, ora) to already be in the local npm cache. If npm reports missing cache entries, simply drop the `--offline` flag and let it reach the registry — the bundled script does this fallback automatically.

## Requirements

- Node.js >= 14.0.0
- npm (for package management)
- Git (for cloning the repository)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT