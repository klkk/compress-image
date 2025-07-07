# 图片 & PDF 压缩工具

可直接部署在 Vercel 的图片和 PDF 压缩 Web 工具，支持常见图片格式（jpg/png/webp/gif/tiff/avif）和 PDF 文件。

## 功能

- 支持前端上传图片和 PDF
- 图片压缩（sharp，支持自定义压缩比）
- PDF 简单瘦身压缩（pdf-lib）
- 压缩后可直接预览和下载

## 部署

1. clone 本仓库
2. `npm install`
3. 本地运行 `npm run dev`
4. 部署到 [Vercel](https://vercel.com/)，一键即可

## 技术栈

- Next.js
- React
- sharp
- pdf-lib
- formidable

## 说明

- 图片压缩采用 sharp，支持 jpg/png/webp/gif/tiff/avif。
- PDF 采用 pdf-lib，仅做对象流瘦身（高级压缩如图片降质请用专业工具）。
- 支持压缩质量设置，数值越低压缩越大，图片体积更小。