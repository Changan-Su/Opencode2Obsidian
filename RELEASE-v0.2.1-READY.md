# v0.2.1 Release Ready ✅

**Release Date**: 2026-01-18  
**Release Type**: Critical Bugfix

---

## 📦 Release Package Contents

### Files Included
- ✅ `main.js` (35KB) - Compiled plugin with bugfixes
- ✅ `manifest.json` (371 bytes) - Version 0.2.1
- ✅ `styles.css` (11KB) - No changes from v0.2.0

### Release Artifacts
- ✅ `release/opencode2obsidian-v0.2.1.zip` (11KB) - **Ready for upload**
- ✅ `release/RELEASE_NOTES_v0.2.1.md` - Complete release notes

---

## 🐛 What Was Fixed

### Critical Issues Resolved
1. **Session Access Bug** 
   - Users reported: "session error" when trying to access other sessions
   - Cause: Incorrect URL encoding and isolated working directories
   - Fix: Root URL path + global working directory

2. **Settings Interface Bug**
   - Users reported: Settings interface not working properly
   - Cause: Same as above - isolated data storage
   - Fix: Global working directory ensures consistent settings

---

## 📋 Version Updates

### Updated Files
- [x] `manifest.json`: `0.2.0` → `0.2.1`
- [x] `package.json`: `0.2.0` → `0.2.1`
- [x] `CHANGELOG.md`: Added v0.2.1 entry
- [x] `src/ProcessManager.ts`: Applied bugfixes

### Build Status
- [x] TypeScript compilation: **SUCCESS**
- [x] ESBuild bundling: **SUCCESS**
- [x] ZIP package creation: **SUCCESS**

---

## 🚀 How to Install/Test

### For Testing (Before Publishing)
```powershell
# Extract and copy files to vault
Copy-Item main.js, manifest.json, styles.css -Destination "<vault-path>\.obsidian\plugins\opencode2obsidian\"

# OR use ZIP
Expand-Archive -Path release/opencode2obsidian-v0.2.1.zip -DestinationPath "<vault-path>\.obsidian\plugins\opencode2obsidian\" -Force
```

### After Publishing to GitHub
1. Users download `opencode2obsidian-v0.2.1.zip` from Releases page
2. Extract to their vault's plugin directory
3. Restart Obsidian
4. Enable plugin

---

## 📝 Documentation Created

### New Files
- ✅ `BUGFIX-SESSION.md` - Technical analysis of the bugfix
- ✅ `TEST-VERIFICATION.md` - Comprehensive test plan
- ✅ `release/RELEASE_NOTES_v0.2.1.md` - User-facing release notes

### Updated Files
- ✅ `CHANGELOG.md` - Added v0.2.1 section with detailed changes

---

## 🔄 Next Steps

### Option A: Local Testing First (Recommended)
1. Install v0.2.1 to a test vault
2. Verify session access works
3. Verify settings interface works
4. Confirm no regressions
5. **Then** proceed to GitHub release

### Option B: Direct GitHub Release
If you trust the fix and want to release immediately:

```bash
# 1. Commit changes
git add .
git commit -m "Release v0.2.1 - Critical bugfix for session access and settings"

# 2. Create and push tag
git tag v0.2.1
git push origin master
git push origin v0.2.1

# 3. Create GitHub Release (choose one method)

# Method A - GitHub CLI (if installed)
gh release create v0.2.1 \
  release/opencode2obsidian-v0.2.1.zip \
  --title "v0.2.1 - Critical Bugfix" \
  --notes-file release/RELEASE_NOTES_v0.2.1.md

# Method B - Web Interface
# Go to: https://github.com/Changan-Su/opencode2obsidian/releases/new
# - Tag: v0.2.1
# - Title: v0.2.1 - Critical Bugfix
# - Description: Copy from release/RELEASE_NOTES_v0.2.1.md
# - Upload: release/opencode2obsidian-v0.2.1.zip
```

---

## ⚠️ Important Notes

### Behavior Changes
Users should be aware of these changes from v0.2.0:

1. **No Auto-Project Switching**
   - OpenCode now starts in user home directory (not vault directory)
   - Users must manually select project in OpenCode UI

2. **Global Sessions/Settings**
   - All vaults now share the same OpenCode environment
   - This is actually the **desired behavior** based on bug reports

### Known Limitations
- Project auto-switching requires OpenCode CLI API support (not available yet)
- Consider implementing in future version when API is available

---

## 📊 Release Summary

| Item | Status |
|------|--------|
| Version bumped | ✅ 0.2.1 |
| Code fixed | ✅ ProcessManager.ts |
| Build successful | ✅ No errors |
| ZIP created | ✅ 11KB |
| Release notes | ✅ Complete |
| CHANGELOG updated | ✅ v0.2.1 entry |
| Documentation | ✅ 3 new files |
| Ready for release | ✅ **YES** |

---

## 🎯 Recommended Action

**I recommend**: Local testing first (Option A)

**Reason**: This is a critical bugfix affecting core functionality. A quick test (5-10 minutes) ensures:
- Session access actually works
- Settings interface functions properly
- No unexpected regressions

**If testing passes**: Proceed with GitHub release immediately.

**If testing fails**: We can fix issues before users are affected.

---

## 📞 Support

If issues arise after release:
- Users should report at: https://github.com/Changan-Su/opencode2obsidian/issues
- Check `TEST-VERIFICATION.md` for debugging steps
- Rollback to v0.2.0 if critical issues found

---

**Status**: ✅ **READY FOR RELEASE**  
**All tasks completed**: 5/5 ✅  
**Next action**: Your choice - Test first or release directly

---

**Prepared by**: Sisyphus AI  
**Date**: 2026-01-18 16:29
