# 图片和视频压缩工具

## 项目说明
这是一个在线图片和视频压缩工具，支持多种格式的图片和视频文件压缩。采用苹果风格设计，简洁优雅。

## 在线体验
访问：[图片视频压缩工具](https://waagd.github.io/compress-tool/)

## 本地开发
1. 克隆项目
```bash
git clone https://github.com/waagd/compress-tool.git
cd compress-tool
```

2. 使用任意静态服务器运行，例如：
```bash
npx http-server
# 或
python -m http.server
```

3. 打开浏览器访问 `http://localhost:8080`

## 部署方式
本项目使用 Vercel 部署，自动跟随 main 分支更新：
1. Fork 本项目
2. 在 Vercel 中导入项目
3. 自动完成部署

## 已完成功能
- [x] 基础界面设计
- [x] 图片压缩功能
- [x] 文件拖放上传
- [x] 压缩质量调节
- [x] 实时预览
- [x] 文件下载

## 进行中的功能
- [ ] 视频压缩功能
- [ ] 批量处理
- [ ] 压缩进度显示
- [ ] 更多格式支持

## 功能特点
- 支持PNG、JPG等格式图片压缩
- 支持主流视频格式压缩
- 文件拖拽上传
- 实时预览压缩效果
- 显示压缩前后文件大小
- 可调节压缩比例
- 支持压缩文件下载

## 项目结构