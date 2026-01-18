#!/bin/bash

# ============================================
# OpenCode2Obsidian Quick Installer for macOS
# Double-click to run / 双击运行
# Author: Changan Su (https://github.com/Changan-Su)
# ============================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

clear
echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}  OpenCode2Obsidian Installer${NC}"
echo -e "${CYAN}  OpenCode2Obsidian 安装程序${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# Check if required files exist
if [ ! -f "$SCRIPT_DIR/main.js" ]; then
    echo -e "${YELLOW}[!] main.js not found. Building project...${NC}"
    echo -e "${YELLOW}[!] 未找到 main.js，正在构建项目...${NC}"
    
    if ! command -v bun &> /dev/null; then
        echo -e "${RED}[X] Bun is not installed.${NC}"
        echo -e "${RED}[X] Bun 未安装${NC}"
        echo ""
        echo "Install with / 安装命令:"
        echo "  curl -fsSL https://bun.sh/install | bash"
        echo ""
        read -p "Press Enter to exit / 按回车退出..."
        exit 1
    fi
    
    cd "$SCRIPT_DIR"
    bun install
    bun run build
    
    if [ ! -f "$SCRIPT_DIR/main.js" ]; then
        echo -e "${RED}[X] Build failed!${NC}"
        echo -e "${RED}[X] 构建失败！${NC}"
        read -p "Press Enter to exit / 按回车退出..."
        exit 1
    fi
fi

echo -e "${GREEN}[OK] Build files ready${NC}"
echo -e "${GREEN}[OK] 构建文件已就绪${NC}"
echo ""

# Try to find Obsidian vaults automatically
echo -e "${CYAN}Searching for Obsidian vaults... / 搜索 Obsidian Vault...${NC}"
echo ""

FOUND_VAULTS=()
# Common locations for Obsidian vaults
SEARCH_PATHS=(
    "$HOME/Documents"
    "$HOME/Desktop"
    "$HOME/Obsidian"
    "$HOME"
)

for search_path in "${SEARCH_PATHS[@]}"; do
    if [ -d "$search_path" ]; then
        while IFS= read -r -d '' vault; do
            vault_dir=$(dirname "$vault")
            FOUND_VAULTS+=("$vault_dir")
        done < <(find "$search_path" -maxdepth 3 -name ".obsidian" -type d -print0 2>/dev/null)
    fi
done

# Remove duplicates
UNIQUE_VAULTS=($(printf "%s\n" "${FOUND_VAULTS[@]}" | sort -u))

if [ ${#UNIQUE_VAULTS[@]} -gt 0 ]; then
    echo -e "${GREEN}Found ${#UNIQUE_VAULTS[@]} vault(s): / 找到 ${#UNIQUE_VAULTS[@]} 个 Vault：${NC}"
    echo ""
    for i in "${!UNIQUE_VAULTS[@]}"; do
        echo "  [$((i+1))] ${UNIQUE_VAULTS[$i]}"
    done
    echo "  [0] Enter path manually / 手动输入路径"
    echo ""
    read -p "Select vault number / 选择 Vault 编号: " SELECTION
    
    if [ "$SELECTION" = "0" ]; then
        echo ""
        echo -e "${CYAN}Enter your Obsidian Vault path:${NC}"
        echo -e "${CYAN}请输入您的 Obsidian Vault 路径：${NC}"
        echo ""
        echo -e "${YELLOW}Tip: You can drag and drop the vault folder here${NC}"
        echo -e "${YELLOW}提示：您可以直接拖拽 Vault 文件夹到此处${NC}"
        echo ""
        read -p "Path / 路径: " VAULT_PATH
    elif [[ "$SELECTION" =~ ^[0-9]+$ ]] && [ "$SELECTION" -ge 1 ] && [ "$SELECTION" -le ${#UNIQUE_VAULTS[@]} ]; then
        VAULT_PATH="${UNIQUE_VAULTS[$((SELECTION-1))]}"
    else
        echo -e "${RED}Invalid selection / 无效选择${NC}"
        read -p "Press Enter to exit / 按回车退出..."
        exit 1
    fi
else
    echo -e "${YELLOW}No vaults found automatically.${NC}"
    echo -e "${YELLOW}未自动找到 Vault。${NC}"
    echo ""
    echo -e "${CYAN}Enter your Obsidian Vault path:${NC}"
    echo -e "${CYAN}请输入您的 Obsidian Vault 路径：${NC}"
    echo ""
    echo -e "${YELLOW}Tip: You can drag and drop the vault folder here${NC}"
    echo -e "${YELLOW}提示：您可以直接拖拽 Vault 文件夹到此处${NC}"
    echo ""
    read -p "Path / 路径: " VAULT_PATH
fi

# Remove trailing whitespace and quotes
VAULT_PATH=$(echo "$VAULT_PATH" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e "s/'//g" -e 's/"//g')

# Expand ~ to home directory
VAULT_PATH="${VAULT_PATH/#\~/$HOME}"

# Validate path
if [ ! -d "$VAULT_PATH" ]; then
    echo ""
    echo -e "${RED}[X] Path does not exist: $VAULT_PATH${NC}"
    echo -e "${RED}[X] 路径不存在：$VAULT_PATH${NC}"
    read -p "Press Enter to exit / 按回车退出..."
    exit 1
fi

# Check if it's likely an Obsidian vault
if [ ! -d "$VAULT_PATH/.obsidian" ]; then
    echo ""
    echo -e "${YELLOW}[?] Warning: .obsidian folder not found.${NC}"
    echo -e "${YELLOW}[?] 警告：未找到 .obsidian 文件夹${NC}"
    read -p "Continue anyway? (y/n) / 是否继续？(y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
        echo -e "${YELLOW}Installation cancelled. / 安装已取消。${NC}"
        exit 0
    fi
fi

# Create plugins directory if needed
PLUGINS_DIR="$VAULT_PATH/.obsidian/plugins"
if [ ! -d "$PLUGINS_DIR" ]; then
    echo -e "${YELLOW}[*] Creating plugins directory...${NC}"
    echo -e "${YELLOW}[*] 创建 plugins 目录...${NC}"
    mkdir -p "$PLUGINS_DIR"
fi

# Create plugin directory
PLUGIN_DIR="$PLUGINS_DIR/opencode2obsidian"
if [ -d "$PLUGIN_DIR" ]; then
    echo ""
    echo -e "${YELLOW}[?] Plugin already exists. Overwrite? (y/n)${NC}"
    echo -e "${YELLOW}[?] 插件已存在，是否覆盖？(y/n)${NC}"
    read -p ": " OVERWRITE
    if [ "$OVERWRITE" != "y" ] && [ "$OVERWRITE" != "Y" ]; then
        echo -e "${YELLOW}Installation cancelled. / 安装已取消。${NC}"
        exit 0
    fi
    rm -rf "$PLUGIN_DIR"
fi

mkdir -p "$PLUGIN_DIR"

# Copy files
echo ""
echo -e "${CYAN}[*] Installing plugin files...${NC}"
echo -e "${CYAN}[*] 正在安装插件文件...${NC}"

cp "$SCRIPT_DIR/main.js" "$PLUGIN_DIR/" || { echo -e "${RED}[X] Failed to copy main.js${NC}"; exit 1; }
echo -e "${GREEN}[OK] main.js${NC}"

cp "$SCRIPT_DIR/manifest.json" "$PLUGIN_DIR/" || { echo -e "${RED}[X] Failed to copy manifest.json${NC}"; exit 1; }
echo -e "${GREEN}[OK] manifest.json${NC}"

cp "$SCRIPT_DIR/styles.css" "$PLUGIN_DIR/" || { echo -e "${RED}[X] Failed to copy styles.css${NC}"; exit 1; }
echo -e "${GREEN}[OK] styles.css${NC}"

# Success
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Installation Complete! / 安装完成！${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${CYAN}Next steps / 接下来：${NC}"
echo ""
echo "  1. Open Obsidian / 打开 Obsidian"
echo "  2. Go to Settings > Community plugins"
echo "     进入 设置 > 第三方插件"
echo "  3. Disable \"Restricted mode\" if enabled"
echo "     如已启用，请关闭\"安全模式\""
echo "  4. Find and enable \"OpenCode2Obsidian\""
echo "     找到并启用 \"OpenCode2Obsidian\""
echo "  5. Click the OpenCode icon in the ribbon"
echo "     点击侧边栏的 OpenCode 图标"
echo ""
echo -e "${YELLOW}Note: Make sure OpenCode CLI is installed${NC}"
echo -e "${YELLOW}注意：请确保已安装 OpenCode CLI${NC}"
echo -e "${CYAN}  Install: npm install -g @anthropics/opencode${NC}"
echo ""

read -p "Press Enter to exit / 按回车退出..."
