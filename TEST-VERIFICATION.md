# Test Verification for v0.2.1 Bugfix

## Build Verification ✅

### Files Built Successfully
- ✅ `main.js` (35KB) - Compiled successfully with bugfix
- ✅ `manifest.json` (371 bytes) - Still at v0.2.0 (update to v0.2.1 before release)
- ✅ `styles.css` (11KB) - No changes

### Code Verification

#### 1. URL Construction ✅
```javascript
// Verified in main.js line 658-660
getUrl() {
  return `http://${this.settings.hostname}:${this.settings.port}`;
}
```
**Expected**: Root path only, no base64 encoding
**Actual**: ✅ Correct implementation

#### 2. Working Directory ✅
```javascript
// Verified in main.js line 689, 702
const homedir2 = os.homedir();
// ...
cwd: homedir2,
```
**Expected**: User home directory instead of vault path
**Actual**: ✅ Correct implementation

#### 3. Health Check URL ✅
```javascript
// Verified in main.js line 793-794
const response = await fetch(`${this.getUrl()}/global/health`, {
  method: "GET",
```
**Expected**: Uses corrected getUrl() for health checks
**Actual**: ✅ Correct implementation

---

## Manual Testing Required

### Prerequisites
1. ✅ OpenCode CLI installed and accessible
2. ⏳ Obsidian installed
3. ⏳ Test vault prepared

### Test Plan

#### Test 1: Fresh Installation
**Objective**: Verify plugin loads correctly with new code

**Steps**:
1. Copy `main.js`, `manifest.json`, `styles.css` to vault plugins folder
2. Completely restart Obsidian
3. Enable "OpenCode2Obsidian" in Community Plugins
4. Check Developer Console (Ctrl+Shift+I) for errors

**Expected Results**:
- ✅ No console errors
- ✅ Plugin loads successfully
- ✅ OpenCode icon appears in ribbon

**Status**: ⏳ Pending user testing

---

#### Test 2: Server Startup
**Objective**: Verify server starts with correct working directory

**Steps**:
1. Click OpenCode ribbon icon
2. Wait for "Starting..." state
3. Check console logs for:
   ```
   [OpenCode2Obsidian] Configured with project directory: <vault-path>
   [OpenCode2Obsidian] Starting server: { ... cwd: <home-dir> }
   ```
4. Verify state changes to "Running"

**Expected Results**:
- ✅ Server starts successfully
- ✅ Console shows `cwd` is home directory (e.g., `C:\Users\<username>`)
- ✅ URL is `http://127.0.0.1:14096/` (no path suffix)
- ✅ iframe loads OpenCode UI

**Status**: ⏳ Pending user testing

---

#### Test 3: Session Access (CRITICAL)
**Objective**: Verify can access all sessions across directories

**Setup**:
1. Before testing, create sessions in standalone OpenCode:
   ```bash
   opencode serve --port 14097
   # Open http://127.0.0.1:14097 in browser
   # Create 2-3 test sessions in different directories
   ```

**Steps**:
1. In Obsidian, open OpenCode panel
2. Click Sessions icon (left sidebar)
3. Check session list

**Expected Results**:
- ✅ All sessions created in standalone OpenCode are visible
- ✅ Can switch to any session without errors
- ✅ Session data loads correctly
- ✅ No "session error" messages

**Status**: ⏳ Pending user testing

---

#### Test 4: Settings Interface (CRITICAL)
**Objective**: Verify settings interface works correctly

**Steps**:
1. In OpenCode panel, click Settings icon (gear icon)
2. Verify settings UI loads
3. Try changing a setting (e.g., theme, language)
4. Save settings
5. Reload OpenCode panel
6. Check if settings persisted

**Expected Results**:
- ✅ Settings interface opens without errors
- ✅ Can modify all settings
- ✅ Settings save successfully
- ✅ Settings persist after reload

**Status**: ⏳ Pending user testing

---

#### Test 5: Multi-Vault Behavior
**Objective**: Verify global session/settings across vaults

**Setup**:
1. Install plugin in two different vaults
2. Create a session in Vault A

**Steps**:
1. Open Vault A → OpenCode → Create test session
2. Close Obsidian
3. Open Vault B → OpenCode
4. Check session list

**Expected Results**:
- ✅ Session created in Vault A is visible in Vault B
- ✅ Both vaults share the same OpenCode environment
- ✅ Settings are synchronized across vaults

**Status**: ⏳ Pending user testing

---

#### Test 6: Comparison with Standalone OpenCode
**Objective**: Verify embedded OpenCode behaves identically to standalone

**Steps**:
1. Open standalone OpenCode:
   ```bash
   opencode serve --port 14097
   # Browser: http://127.0.0.1:14097
   ```
2. Open Obsidian → OpenCode panel
3. Compare:
   - Session lists
   - Settings
   - Available features

**Expected Results**:
- ✅ Session lists are identical
- ✅ Settings are synchronized
- ✅ No missing features in embedded version

**Status**: ⏳ Pending user testing

---

## Regression Testing

### Test 7: Original Features Still Work
**Objective**: Ensure bugfix didn't break existing functionality

**Checklist**:
- ✅ Start/Stop server controls work
- ✅ Reload button works
- ✅ Ribbon icon opens panel
- ✅ Command palette commands work
- ✅ Keyboard shortcut (Ctrl+Shift+O) works
- ✅ Settings tab in Obsidian settings works
- ✅ Auto-start feature works (if enabled)
- ✅ Error states display correctly
- ✅ Theme adaptation works (dark/light mode)

**Status**: ⏳ Pending user testing

---

## Performance Testing

### Test 8: Startup Performance
**Objective**: Verify startup time not significantly affected

**Steps**:
1. Measure time from "Starting..." to "Running"
2. Compare with v0.2.0 (if available)

**Expected Results**:
- ✅ Startup time < 5 seconds on average
- ✅ No significant regression from v0.2.0

**Status**: ⏳ Pending user testing

---

## Edge Cases

### Test 9: Port Already in Use
**Objective**: Verify graceful handling when port is occupied

**Steps**:
1. Start standalone OpenCode on port 14096:
   ```bash
   opencode serve --port 14096
   ```
2. Open Obsidian → OpenCode panel
3. Check behavior

**Expected Results**:
- ✅ Plugin detects existing server
- ✅ Connects to existing server instead of failing
- ✅ UI shows "Running" state

**Status**: ⏳ Pending user testing

---

### Test 10: Invalid Working Directory
**Objective**: Verify error handling if home directory is inaccessible

**Steps**:
1. This is difficult to simulate, but check console for:
   - Proper error messages
   - No crashes

**Expected Results**:
- ✅ Graceful error handling
- ✅ User-friendly error message

**Status**: ⏳ Low priority (edge case)

---

## Known Issues / Limitations

### Expected Behavior Changes

#### 1. No Auto-Project Switching
**Before v0.2.1**: Each vault automatically worked in that vault's directory
**After v0.2.1**: OpenCode always starts in home directory

**Workaround**: Users must manually select project directory in OpenCode UI

**Future Fix**: Implement API call to auto-switch project after server start (requires OpenCode CLI support)

#### 2. Shared Server State
**Before v0.2.1**: Each vault had isolated OpenCode instance
**After v0.2.1**: All vaults share same OpenCode instance (sessions, settings)

**Impact**: This is actually **desired behavior** based on user's bug report

---

## Documentation Verification

### Files Created/Updated ✅
- ✅ `BUGFIX-SESSION.md` - Detailed bugfix documentation
- ✅ `TEST-VERIFICATION.md` - This file
- ✅ `CHANGELOG.md` - Added v0.2.1 entry
- ⏳ `manifest.json` - Needs version bump to 0.2.1
- ⏳ `package.json` - Needs version bump to 0.2.1

---

## Release Checklist

### Before Release
- [ ] User confirms all critical tests pass (Test 3, 4, 5)
- [ ] Update `manifest.json` version to "0.2.1"
- [ ] Update `package.json` version to "0.2.1"
- [ ] Rebuild: `bun run build`
- [ ] Create release package: `.\scripts\build-release.ps1`
- [ ] Test installation from release package
- [ ] Verify CHANGELOG.md is complete

### GitHub Release
- [ ] Create git tag: `git tag v0.2.1`
- [ ] Push tag: `git push origin v0.2.1`
- [ ] Create GitHub Release with `RELEASE_NOTES_v0.2.1.md`
- [ ] Upload release ZIP

---

## Test Results Summary

**Build Verification**: ✅ PASSED
**Code Verification**: ✅ PASSED
**Manual Testing**: ⏳ PENDING USER FEEDBACK

**Blocker**: Cannot proceed with release until user confirms:
1. Session access works correctly
2. Settings interface works correctly
3. No regressions in existing features

---

## Next Steps

### Immediate (User Action Required)
1. **Install updated plugin** to test vault
2. **Run Test 3 (Session Access)** - CRITICAL
3. **Run Test 4 (Settings Interface)** - CRITICAL
4. **Report results** - Pass/Fail with details

### After Successful Testing
1. Update version numbers in manifest.json and package.json
2. Rebuild and create v0.2.1 release package
3. Push to GitHub and create release

### If Testing Fails
1. Collect error messages and console logs
2. Analyze failure mode
3. Apply additional fixes
4. Repeat testing cycle

---

**Document Status**: ✅ Complete
**Last Updated**: 2026-01-18 16:29
**Author**: Changan Su
