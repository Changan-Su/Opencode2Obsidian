# 发布 Release 指南

本文档说明如何发布 OpenCode2Obsidian 的新版本到 GitHub Release。

## 📋 准备工作

### 1. 安装必需工具

```powershell
# GitHub CLI（用于自动发布）
winget install GitHub.cli

# 验证安装
gh --version
```

### 2. 登录 GitHub

```powershell
gh auth login
```

## 🚀 发布流程

### 方式 1: 完全自动化（推荐）⭐

一条命令完成所有操作：

```powershell
# 发布新版本 (例如 0.3.0)
.\scripts\publish-release.ps1 -Version 0.3.0
```

这个脚本会自动：
1. 构建项目
2. 创建 ZIP 压缩包
3. 生成 Release Notes
4. 创建 Git 标签
5. 推送到 GitHub
6. 创建 GitHub Release

**可选参数**:
```powershell
# 创建草稿 Release
.\scripts\publish-release.ps1 -Version 0.3.0 -Draft

# 标记为预发布版本
.\scripts\publish-release.ps1 -Version 0.3.0 -Prerelease
```

---

### 方式 2: 分步操作

#### 步骤 1: 更新版本号

```powershell
# 更新所有文件中的版本号
.\scripts\update-version.ps1 -NewVersion 0.3.0

# 或先 DryRun 查看会修改什么
.\scripts\update-version.ps1 -NewVersion 0.3.0 -DryRun
```

这会更新：
- `manifest.json`
- `package.json`
- `README.md` 中的版本徽章

#### 步骤 2: 更新 CHANGELOG

手动编辑 `CHANGELOG.md`，添加新版本的更新内容：

```markdown
## [0.3.0] - 2026-01-18

### Added
- 新功能 1
- 新功能 2

### Fixed
- 修复 bug 1
- 修复 bug 2

### Changed
- 改进 1
```

#### 步骤 3: 提交更改

```powershell
git add .
git commit -m "chore: bump version to 0.3.0"
git push origin main
```

#### 步骤 4: 构建 Release

```powershell
# 构建并打包
.\scripts\build-release.ps1 -Version 0.3.0

# 或者不指定版本（使用 manifest.json 中的版本）
.\scripts\build-release.ps1
```

这会生成：
- `release/opencode2obsidian-v0.3.0.zip` - ZIP 压缩包
- `release/opencode2obsidian-v0.3.0.zip.sha256` - SHA256 校验和
- `release/RELEASE_NOTES_v0.3.0.md` - Release Notes 模板

#### 步骤 5: 编辑 Release Notes

编辑生成的 `release/RELEASE_NOTES_v0.3.0.md`，完善发布说明。

#### 步骤 6: 创建 GitHub Release

```powershell
# 使用脚本自动创建
.\scripts\publish-release.ps1 -Version 0.3.0

# 或手动创建
git tag -a v0.3.0 -m "Release v0.3.0"
git push origin v0.3.0

gh release create v0.3.0 \
  release/opencode2obsidian-v0.3.0.zip \
  --title "OpenCode2Obsidian v0.3.0" \
  --notes-file release/RELEASE_NOTES_v0.3.0.md
```

---

### 方式 3: GitHub Actions 自动化（推荐用于正式发布）

推送标签后自动触发构建和发布：

```powershell
# 1. 确保代码已提交
git add .
git commit -m "chore: release v0.3.0"
git push origin main

# 2. 创建并推送标签
git tag v0.3.0
git push origin v0.3.0

# 3. GitHub Actions 会自动：
#    - 构建项目
#    - 创建 ZIP 压缩包
#    - 生成校验和
#    - 创建 GitHub Release
#    - 上传构建产物
```

查看构建状态：
- 访问: https://github.com/Changan-Su/opencode2obsidian/actions
- 或使用: `gh run list`

---

## 📦 Release 包含内容

每个 Release 应包含：

### 必需文件
- `opencode2obsidian-vX.Y.Z.zip` - 插件压缩包
  - `main.js` - 构建后的插件代码
  - `manifest.json` - 插件清单
  - `styles.css` - 样式文件

### 可选文件
- `opencode2obsidian-vX.Y.Z.zip.sha256` - SHA256 校验和
- Release Notes（在 GitHub Release 页面）

---

## 📝 版本号规范

遵循 [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR (主版本号)**: 不兼容的 API 变更
- **MINOR (次版本号)**: 向后兼容的新功能
- **PATCH (修订号)**: 向后兼容的 bug 修复

示例：
- `1.0.0` - 首个正式版本
- `1.1.0` - 添加新功能
- `1.1.1` - 修复 bug
- `2.0.0` - 破坏性更新

---

## 🔧 Release Notes 模板

```markdown
# Release vX.Y.Z

## 📦 下载 / Download

- **插件包**: `opencode2obsidian-vX.Y.Z.zip`
- **SHA256**: `xxxxxx`

## ✨ 新功能 / New Features

- 功能 1
- 功能 2

## 🐛 修复 / Bug Fixes

- 修复 1
- 修复 2

## 🔧 改进 / Improvements

- 改进 1
- 改进 2

## 📝 完整变更日志

查看: [CHANGELOG.md](CHANGELOG.md)

## 🚀 安装

### Obsidian 商店（推荐）
1. Settings → Community Plugins → Browse
2. 搜索 "OpenCode2Obsidian"
3. Install

### 手动安装
1. 下载 `opencode2obsidian-vX.Y.Z.zip`
2. 解压到 `<vault>/.obsidian/plugins/opencode2obsidian/`
3. 在 Obsidian 中启用插件
```

---

## ⚠️ 注意事项

### 发布前检查清单

- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] CHANGELOG.md 已更新
- [ ] 版本号已更新（manifest.json, package.json）
- [ ] 代码已提交到 main 分支
- [ ] Release Notes 已编写完整

### 不要做的事情

❌ **不要**删除已发布的 Release（除非有严重安全问题）  
❌ **不要**修改已推送的 Git 标签  
❌ **不要**跳过版本号  
❌ **不要**发布未经测试的代码

### 如果发布出错

如果发布后发现问题：

1. **小问题**：发布一个 PATCH 版本（例如 0.3.0 → 0.3.1）
2. **大问题**：
   - 在 GitHub 标记 Release 为 "This release is broken"
   - 立即发布修复版本
   - 更新 Release Notes 说明问题

---

## 📊 发布后操作

1. **验证安装**
   ```powershell
   # 在测试 vault 中验证
   .\install-plugin.ps1 -VaultPath "test-vault"
   ```

2. **更新文档**
   - 更新 README.md 的版本号
   - 更新社区论坛的插件信息（如有）

3. **宣传**
   - 在 GitHub Discussions 发布公告
   - 社交媒体分享（可选）

4. **监控反馈**
   - 关注 GitHub Issues
   - 收集用户反馈
   - 准备下个版本的改进

---

## 🛠️ 脚本说明

### build-release.ps1

构建 Release 包并生成相关文件。

```powershell
# 基本用法
.\scripts\build-release.ps1 -Version 0.3.0

# 跳过构建（文件已存在）
.\scripts\build-release.ps1 -SkipBuild

# 只构建不打包
.\scripts\build-release.ps1 -SkipZip
```

### update-version.ps1

更新项目中的版本号。

```powershell
# 更新版本号
.\scripts\update-version.ps1 -NewVersion 0.3.0

# 预览更改（不实际修改）
.\scripts\update-version.ps1 -NewVersion 0.3.0 -DryRun
```

### publish-release.ps1

自动发布到 GitHub Release。

```powershell
# 正式发布
.\scripts\publish-release.ps1 -Version 0.3.0

# 草稿发布（可以后续手动发布）
.\scripts\publish-release.ps1 -Version 0.3.0 -Draft

# 预发布版本
.\scripts\publish-release.ps1 -Version 0.3.0-beta.1 -Prerelease
```

---

## 📚 相关文档

- [CHANGELOG.md](../CHANGELOG.md) - 变更日志
- [CONTRIBUTING.md](../CONTRIBUTING.md) - 贡献指南（如有）
- [GitHub Releases](https://github.com/Changan-Su/opencode2obsidian/releases) - 所有版本
- [GitHub Actions](https://github.com/Changan-Su/opencode2obsidian/actions) - CI/CD 状态

---

## ❓ 常见问题

### Q: 如何撤销一个错误的 Release？

```powershell
# 1. 删除 GitHub Release
gh release delete v0.3.0

# 2. 删除 Git 标签
git tag -d v0.3.0
git push origin :refs/tags/v0.3.0

# 3. 重新发布正确的版本
```

### Q: 如何发布 Beta 版本？

```powershell
.\scripts\publish-release.ps1 -Version 0.3.0-beta.1 -Prerelease
```

### Q: GitHub Actions 构建失败怎么办？

1. 查看错误日志: `gh run view`
2. 修复问题后重新推送标签:
   ```powershell
   git tag -d v0.3.0
   git push origin :refs/tags/v0.3.0
   git tag v0.3.0
   git push origin v0.3.0
   ```

---

**最后更新**: 2026-01-18
