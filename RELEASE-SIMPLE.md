# 📦 GitHub Release 发布指南

## 最简单的方法（手动打包）

### 步骤 1: 构建项目

```powershell
cd F:\MyFiles\Projects\Opencode2Obsidian
bun run build
```

确保生成了这 3 个文件：
- `main.js`
- `manifest.json`  
- `styles.css`

### 步骤 2: 创建 ZIP 压缩包

**方式 A - Windows 文件资源管理器：**

1. 在项目根目录创建文件夹 `release`
2. 选中这 3 个文件：`main.js`, `manifest.json`, `styles.css`
3. 右键 → 发送到 → 压缩(zipped)文件夹
4. 重命名为：`opencode2obsidian-v0.2.0.zip`
5. 移动到 `release/` 文件夹

**方式 B - PowerShell：**

```powershell
# 创建 release 目录
New-Item -ItemType Directory -Force release

# 压缩文件
Compress-Archive -Path main.js,manifest.json,styles.css -DestinationPath release/opencode2obsidian-v0.2.0.zip -Force
```

### 步骤 3: 创建 Git 标签

```powershell
git tag v0.2.0
git push origin v0.2.0
```

### 步骤 4: 在 GitHub 创建 Release

#### 使用 GitHub CLI (推荐)：

```powershell
# 安装 GitHub CLI（如果还没有）
winget install GitHub.cli

# 登录
gh auth login

# 创建 Release
gh release create v0.2.0 release/opencode2obsidian-v0.2.0.zip --title "v0.2.0" --notes "Release v0.2.0"
```

#### 使用 GitHub 网页：

1. 访问：https://github.com/Changan-Su/opencode2obsidian/releases/new
2. 选择标签：`v0.2.0`
3. 填写标题：`v0.2.0`
4. 填写说明：
   ```markdown
   ## What's New
   
   - i18n support (English/Chinese)
   - Theme adaptation (dark/light mode)
   - Installation scripts for Windows/macOS
   
   ## Installation
   
   1. Download `opencode2obsidian-v0.2.0.zip`
   2. Extract to `<vault>/.obsidian/plugins/opencode2obsidian/`
   3. Enable plugin in Obsidian
   ```
5. 上传文件：拖拽 `opencode2obsidian-v0.2.0.zip`
6. 点击 **Publish release**

---

## 自动化脚本（高级）

如果想使用自动化脚本，运行：

```powershell
# 使用提供的脚本
.\scripts\build-release.bat
```

但手动方式最可靠！

---

## Release 检查清单

发布前确保：

- [ ] 代码已测试
- [ ] 版本号已更新（manifest.json, package.json）
- [ ] CHANGELOG.md 已更新
- [ ] README.md 已更新
- [ ] 所有更改已提交到 main 分支
- [ ] `bun run build` 成功
- [ ] ZIP 包只包含 3 个文件（不是文件夹）

---

## 验证 Release

发布后：

1. 访问 Releases 页面查看
2. 下载 ZIP 测试安装
3. 在 Obsidian 中验证功能

---

## 下次发布

更新版本号（例如 v0.3.0）：

1. 编辑 `manifest.json`:
   ```json
   {
     "version": "0.3.0"
   }
   ```

2. 编辑 `package.json`:
   ```json
   {
     "version": "0.3.0"
   }
   ```

3. 更新 `README.md` 中的版本徽章

4. 然后重复上面的发布步骤

---

**当前版本**: v0.2.0  
**下次版本**: v0.3.0 (计划中)
