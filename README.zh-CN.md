# TXDownloader 法律页面

TXDownloader 的静态法律与隐私政策页面，托管于 GitHub Pages。

## 项目内容

- 多语言隐私政策页面，支持简体中文、英文、日文、韩文、泰文、越南文
- 基于 JSON 数据源通过脚本构建静态 HTML 页面
- GitHub Actions 自动部署

## 页面地址

- `https://sharkmabin.github.io/txdownload-legal/privacy/zh-CN/`
- `https://sharkmabin.github.io/txdownload-legal/privacy/en-US/`
- `https://sharkmabin.github.io/txdownload-legal/privacy/ja-JP/`
- `https://sharkmabin.github.io/txdownload-legal/privacy/ko-KR/`
- `https://sharkmabin.github.io/txdownload-legal/privacy/th-TH/`
- `https://sharkmabin.github.io/txdownload-legal/privacy/vi-VN/`

## 技术栈

- HTML / CSS
- Node.js 构建脚本
- GitHub Pages + GitHub Actions

## 说明

运行 `node scripts/build-site.mjs` 构建静态页面。生成的 HTML 直接提交到仓库，以便 GitHub Pages 无需额外构建流程即可提供服务。
