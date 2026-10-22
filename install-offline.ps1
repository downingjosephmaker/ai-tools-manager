# ============================================================
# ai-tools-manager 本地离线部署脚本 (Windows PowerShell 5.1+)
#
# 用法:
#   .\install-offline.ps1
#   （如被执行策略拦截: powershell -ExecutionPolicy Bypass -File .\install-offline.ps1）
#
# 流程: 卸载旧全局包(含失效符号链接) -> npm pack 打包
#       -> 离线全局安装(本地缓存不全时自动回退联网) -> 验证 -> 清理
# ============================================================

$root = $PSScriptRoot

function Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }

# npm 必须可用
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host '错误: 未找到 npm，请先安装 Node.js' -ForegroundColor Red
    exit 1
}

# 必须在项目根目录（有 package.json）运行
if (-not (Test-Path (Join-Path $root 'package.json'))) {
    Write-Host '错误: 请把脚本放在 ai-tools-manager 项目根目录下运行' -ForegroundColor Red
    exit 1
}

Set-Location $root

# 1. 卸载旧安装 —— 之前如果是 npm link / npm install -g . 装出的符号链接，必须先清掉
Step '卸载旧的全局安装（如有）'
npm uninstall -g ai-tools-manager 2>&1 | Out-Null
Write-Host '  完成' -ForegroundColor DarkGray

# 2. 打包当前源码（按 package.json 的 "files" 字段）
Step '打包 tarball (npm pack)'
npm pack --pack-destination . 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'npm pack 失败' }

$tgz = (Get-ChildItem .\ai-tools-manager-*.tgz | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName
if (-not $tgz) { throw '未找到打包产物 ai-tools-manager-*.tgz' }
Write-Host "  产物: $tgz"

# 3. 全局安装：优先完全离线（走本地 npm 缓存，不卡审计/元数据等联网请求）
Step '全局安装（优先离线）'
$mode = '离线'
npm install -g $tgz --no-audit --no-fund --offline 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    $mode = '联网'
    Write-Host '  本地缓存不全，回退联网安装...' -ForegroundColor Yellow
    npm install -g $tgz --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw 'npm install 失败' }
}

# 4. 验证
Step '验证安装'
$installed = npm ls -g ai-tools-manager 2>&1 | Select-String 'ai-tools-manager@'
if ($installed) {
    Write-Host "  $installed" -ForegroundColor Green
} else {
    throw '安装后未能检测到 ai-tools-manager'
}

# 5. 清理
Step '清理 tarball'
Remove-Item .\ai-tools-manager-*.tgz -ErrorAction SilentlyContinue

Write-Host ''
Write-Host "部署完成（${mode}模式）。运行 atm 开始使用。" -ForegroundColor Green
