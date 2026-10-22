const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class PackageManager {
  async getInstalledPackages() {
    try {
      const { stdout } = await execAsync('npm list -g --depth=0 --json');
      const data = JSON.parse(stdout);
      return Object.keys(data.dependencies || {});
    } catch (error) {
      return [];
    }
  }

  async getPackageVersion(packageName) {
    try {
      const cleanPackageName = this.extractPackageName(packageName);
      const { stdout } = await execAsync(`npm list -g ${cleanPackageName} --depth=0 --json`);
      const data = JSON.parse(stdout);
      return data.dependencies && data.dependencies[cleanPackageName]
        ? data.dependencies[cleanPackageName].version
        : null;
    } catch (error) {
      return null;
    }
  }

  async getLatestVersion(packageName) {
    try {
      const cleanPackageName = this.extractPackageName(packageName);
      const { stdout } = await execAsync(`npm view ${cleanPackageName} version`);
      return stdout.trim();
    } catch (error) {
      return null;
    }
  }

  async installPackage(packageName) {
    try {
      // --no-audit --no-fund 跳过联网审计/元数据请求，弱网环境下会无限卡住安装
      const { stdout, stderr } = await execAsync(
        `npm install -g ${packageName} --no-audit --no-fund`,
        { timeout: 600000 }
      );
      return { success: true, output: stdout + stderr };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updatePackage(packageName) {
    try {
      const { stdout, stderr } = await execAsync(
        `npm update -g ${packageName} --no-audit --no-fund`,
        { timeout: 600000 }
      );
      return { success: true, output: stdout + stderr };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async uninstallPackage(packageName) {
    try {
      const cleanPackageName = this.extractPackageName(packageName);
      const { stdout, stderr } = await execAsync(`npm uninstall -g ${cleanPackageName}`, {
        timeout: 300000
      });
      return { success: true, output: stdout + stderr };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  extractPackageName(packageWithVersion) {
    // Handle scoped packages like @scope/package or @scope/package@version
    if (packageWithVersion.startsWith('@')) {
      const parts = packageWithVersion.split('@');
      if (parts.length === 2) {
        // @scope/package (no version)
        return packageWithVersion;
      } else if (parts.length === 3) {
        // @scope/package@version
        return `@${parts[1]}`;
      }
    } else {
      // Handle regular packages like package or package@version
      return packageWithVersion.split('@')[0];
    }
    return packageWithVersion;
  }

  async isPackageInstalled(packageName) {
    const installedPackages = await this.getInstalledPackages();
    const cleanPackageName = this.extractPackageName(packageName);
    return installedPackages.includes(cleanPackageName);
  }

  // ---- command-type tools (non-npm, managed via shell commands) ----

  async runShellCommand(command, timeoutMs = 300000) {
    try {
      const { stdout, stderr } = await execAsync(command, { timeout: timeoutMs });
      return { success: true, output: `${stdout || ''}${stderr || ''}` };
    } catch (error) {
      return { success: false, error: error.message, output: `${error.stdout || ''}${error.stderr || ''}` };
    }
  }

  // 通过版本命令是否成功执行来判断命令型工具是否已安装
  async isCommandInstalled(versionCommand) {
    const result = await this.runShellCommand(versionCommand, 15000);
    return result.success;
  }

  // 从版本命令输出中提取语义化版本号（如 "agy version 1.3.1" -> "1.3.1"）
  async getCommandVersion(versionCommand) {
    const result = await this.runShellCommand(versionCommand, 15000);
    if (!result.success) {
      return null;
    }
    const match = result.output.match(/(\d+\.\d+(?:\.\d+)?(?:[-+][0-9A-Za-z.-]+)?)/);
    return match ? match[1] : null;
  }

  async installCommandTool(installCommand) {
    const result = await this.runShellCommand(installCommand, 600000);
    return result.success
      ? { success: true, output: result.output }
      : { success: false, error: result.error };
  }

  async updateCommandTool(updateCommand) {
    const result = await this.runShellCommand(updateCommand, 600000);
    return result.success
      ? { success: true, output: result.output }
      : { success: false, error: result.error };
  }

  async uninstallCommandTool(uninstallCommand) {
    const result = await this.runShellCommand(uninstallCommand, 300000);
    return result.success
      ? { success: true, output: result.output }
      : { success: false, error: result.error };
  }
}

module.exports = { PackageManager };