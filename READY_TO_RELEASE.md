# ✅ Release v0.2.0 准备完成！

所有本地准备工作已完成。现在需要推送到 GitHub 并创建 Release。

## 📦 已完成的工作

- ✅ 项目构建成功 (main.js 35KB)
- ✅ ZIP 压缩包已创建 (11KB)
- ✅ Release Notes 已生成
- ✅ Git 仓库已初始化
- ✅ 初始提交已完成
- ✅ Git 标签 v0.2.0 已创建

## 📂 生成的文件

```
release/
├── opencode2obsidian-v0.2.0.zip     # 插件包 (11KB)
└── RELEASE_NOTES_v0.2.0.md          # Release 说明
```

---

## 🚀 下一步操作（需要手动完成）

### 步骤 1: 在 GitHub 创建仓库

1. 访问: https://github.com/new
2. 仓库名称: `opencode2obsidian`
3. 描述: `Embed OpenCode AI assistant in Obsidian`
4. 选择 **Public**
5. **不要**勾选 "Initialize with README"（我们已经有了）
6. 点击 **Create repository**

### 步骤 2: 关联远程仓库并推送

在项目目录运行：

```powershell
# 添加远程仓库
git remote add origin https://github.com/Changan-Su/opencode2obsidian.git

# 推送代码和标签
git push -u origin master
git push origin v0.2.0
```

### 步骤 3: 创建 GitHub Release

#### 方式 A - 使用 GitHub CLI (推荐)

```powershell
# 确保已登录
gh auth login

# 创建 Release
gh release create v0.2.0 release/opencode2obsidian-v0.2.0.zip --title "v0.2.0" --notes-file release/RELEASE_NOTES_v0.2.0.md
```

#### 方式 B - 使用 GitHub 网页

1. 推送后访问: https://github.com/Changan-Su/opencode2obsidian/releases/new
2. 选择标签: `v0.2.0`
3. Release 标题: `v0.2.0`
4. 复制 `release/RELEASE_NOTES_v0.2.0.md` 的内容到说明框
5. 上传文件: 拖拽 `release/opencode2obsidian-v0.2.0.zip`
6. 点击 **Publish release**

---

## 📝 Release Notes 预览

```markdown
# Release v0.2.0

## ✨ What's New

### Major Features
- 🌐 i18n Support: Full bilingual support for English and Chinese
- 🎨 Theme Adaptation: Automatically adapts to Obsidian's theme
- 📦 Easy Installation: One-click install scripts

## 🚀 Installation

1. Download opencode2obsidian-v0.2.0.zip
2. Extract to <vault>/.obsidian/plugins/opencode2obsidian/
3. Enable plugin in Obsidian Settings

## 📋 Requirements
- Obsidian Desktop v1.4.0+
- OpenCode CLI v1.1.0+
```

---

## ✅ 验证检查清单

发布后请确认：

- [ ] 代码已成功推送到 GitHub
- [ ] 标签 v0.2.0 在 GitHub 上可见
- [ ] Release 页面显示正常
- [ ] ZIP 文件可以下载
- [ ] Release Notes 格式正确
- [ ] 下载并测试 ZIP 包能正常安装

---

## 🔧 如果遇到问题

### 问题: GitHub 仓库名称不同

如果你的 GitHub 用户名不是 `Changan-Su`，修改远程地址：

```powershell
git remote add origin https://github.com/你的用户名/opencode2obsidian.git
```

### 问题: 推送失败

确保你有仓库的写权限，可能需要配置 SSH 密钥或使用 Personal Access Token。

### 问题: GitHub CLI 未安装

```powershell
winget install GitHub.cli
gh auth login
```

---

## 📚 相关文档

- Release 发布指南: `docs/RELEASE.md`
- 简易发布指南: `RELEASE-SIMPLE.md`
- 项目 README: `README.md`

---

**准备完成时间**: 2026-01-18 15:39  
**下一步**: 推送到 GitHub 并创建 Release
