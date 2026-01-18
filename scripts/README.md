# 🚀 快速发布指南

最简单的发布方式，3 种方法任选其一：

---

## ⚡ 方法 1: 一键发布（最快）

```powershell
# 一条命令完成所有操作
.\scripts\quick-release.bat 0.2.0
```

这会自动完成：
1. ✅ 更新版本号
2. ✅ 提交代码
3. ✅ 构建项目
4. ✅ 创建 ZIP 包
5. ✅ 发布到 GitHub

**完成后检查**: https://github.com/Changan-Su/opencode2obsidian/releases

---

## 🛠️ 方法 2: PowerShell 脚本（推荐）

```powershell
# 发布 v0.2.0 版本
.\scripts\publish-release.ps1 -Version 0.2.0

# 创建草稿（可以后续手动发布）
.\scripts\publish-release.ps1 -Version 0.2.0 -Draft

# 预发布版本
.\scripts\publish-release.ps1 -Version 0.2.0-beta -Prerelease
```

---

## 🏷️ 方法 3: GitHub Actions 自动化

```powershell
# 1. 提交代码
git add .
git commit -m "chore: release v0.2.0"
git push

# 2. 创建标签（自动触发构建）
git tag v0.2.0
git push origin v0.2.0

# ✨ GitHub Actions 会自动构建并发布
```

查看进度: https://github.com/Changan-Su/opencode2obsidian/actions

---

## 📦 发布当前版本 (v0.2.0)

立即发布当前版本：

```powershell
# 方式 1: 完整流程
.\scripts\build-release.ps1
.\scripts\publish-release.ps1 -Version 0.2.0

# 方式 2: 一键发布
.\scripts\quick-release.bat 0.2.0

# 方式 3: 只构建不发布
.\scripts\build-release.ps1
# 然后手动上传 release/opencode2obsidian-v0.2.0.zip 到 GitHub
```

---

## ✅ 发布前检查

- [ ] 代码已测试通过
- [ ] CHANGELOG.md 已更新
- [ ] 文档已更新
- [ ] 所有更改已提交

---

## 📁 生成的文件

发布后会在 `release/` 目录生成：

```
release/
├── opencode2obsidian-v0.2.0.zip       # 插件包
├── opencode2obsidian-v0.2.0.zip.sha256 # 校验和
├── RELEASE_NOTES_v0.2.0.md             # 发布说明
└── v0.2.0/                             # 临时文件
    ├── main.js
    ├── manifest.json
    └── styles.css
```

---

## 🔧 故障排除

### 问题: GitHub CLI 未安装

```powershell
winget install GitHub.cli
gh auth login
```

### 问题: 构建失败

```powershell
bun install
bun run build
```

### 问题: 标签已存在

```powershell
git tag -d v0.2.0
git push origin :refs/tags/v0.2.0
```

---

## 📚 完整文档

详细步骤和高级选项见: [docs/RELEASE.md](../docs/RELEASE.md)

---

**当前版本**: v0.2.0  
**下次发布**: 按需更新版本号
