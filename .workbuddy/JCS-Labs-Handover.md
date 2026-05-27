# JCS Labs 工具站矩阵 — 完整交接文档

> **最后更新**：2026-05-27
> **创建人**：陈哲舜（Jason Chan）
> **品牌**：JCS Labs（科技/工具产品）| JCS Studio（设计业务）
> **GitHub**：https://github.com/Jasonchan005
> **核心策略**：零成本、纯前端、不调用付费API、无法律风险、面向海外用户赚美元

---

## 一、项目总览

### 商业模式
- 做 20+ 个工具站，每个站覆盖一个长尾关键词领域
- 纯前端，所有处理在用户浏览器完成
- Vercel 免费部署，Google AdSense 变现
- 全英文界面，面向海外用户

### 四项评估标准（所有新项目必须满足）
1. **零成本** — 不花一分钱
2. **来钱快** — 搜索量大，容易 SEO
3. **无法律风险** — 不碰名人、版权、健康、法律建议等
4. **纯前端** — 不调用任何付费 API，不需要服务器

### 已有站队

| # | 站点 | 品牌名 | 域名 | GitHub 仓库 | 状态 |
|---|------|--------|------|------------|------|
| 1 | PDF 工具站 | **ToolLabs** | toollabs-phi.vercel.app | Jasonchan005/toollabs | ✅ 已上线，6个工具 |
| 2 | AI 软件推荐站 | **AIToolBox** | ai-toolbox-rouge.vercel.app | Jasonchan005/ai-toolbox | ✅ 已上线，42个软件 + 提示词库 |
| 3 | 免费翻译站 | **FreeTranslator** | free-translator-liart.vercel.app | Jasonchan005/free-translator | ✅ 已上线，20种语言 |
| 4 | 图片工具站 | **ImageToolLab** | 待部署 | Jasonchan005/image-toollab | 🔄 代码已完成，待推送+部署 |
| 5 | Chrome 翻译插件 | **Hover Translate** | — | Jasonchan005/free-translator-extension | 🔄 代码已完成，待上架（需$5注册费） |

---

## 二、各站详细说明

### 站点1：ToolLabs（PDF 工具站）

**本地路径**：`C:\Users\JCS\WorkBuddy\2026-05-16-task-2\`（主目录）

**已上线工具（6个）**：
1. **PDF to Word** — 上传PDF → 提取文本 → 生成.docx（pdf.js + docx）
2. **Compress PDF** — 三级压缩，支持1GB，500MB+自动分片（pdf-lib）
3. **Word to PDF** — .docx → PDF，支持中文（jsPDF + Noto Sans SC）
4. **Image to PDF** — 图片合成PDF（jsPDF）
5. **Add Watermark** — PDF/图片文字水印，6种位置（pdf-lib + Canvas）
6. **Image to Text (OCR)** — Coming Soon，中文识别不成熟暂不上线

**技术栈**：纯 HTML/CSS/JS，pdf.js + docx + jsPDF + pdf-lib + mammoth.js + Tesseract.js，全部本地库（lib/文件夹）

**SEO**：Google Search Console ✅ | sitemap.xml ✅ | GA: G-503ZSLGF0W

**文件结构**：
```
toollabs/
├── index.html              # 首页
├── pdf-to-word.html        # PDF转Word
├── compress-pdf.html       # PDF压缩
├── word-to-pdf.html        # Word转PDF
├── image-to-pdf.html       # 图片转PDF
├── add-watermark.html      # 加水印
├── image-to-text.html      # OCR（Coming Soon）
├── css/style.css           # 全局样式
├── js/                     # 各工具的JS逻辑
├── lib/                    # 本地依赖库（全部离线）
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── vercel.json
```

---

### 站点2：AIToolBox（AI 软件推荐站）

**本地路径**：`C:\Users\JCS\WorkBuddy\2026-05-16-task-2\ai-toolbox\`

**内容**：
- 42 个免费可下载 AI 软件，8 个分类
- 分类：AI Painting, Local LLMs, Voice & Audio, Video Generation, Coding Assistants, Photo Processing, OCR & Translation, All-in-One Bundles
- AI 提示词模板库：44 个 ChatGPT/Claude/Gemini 提示词，8 个分类（/prompts）

**技术**：纯前端，Tailwind CSS CDN + Lucide Icons

**SEO**：robots.txt + sitemap.xml + GA: G-503ZSLGF0W

**待办**：Google Search Console 验证、AdSense 申请

**文件结构**：
```
ai-toolbox/
├── index.html          # 主页（42个AI软件展示）
├── data.js             # AI软件数据
├── prompts.html        # AI提示词模板库
├── prompts-data.js     # 提示词数据（44个）
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── vercel.json
```

---

### 站点3：FreeTranslator（免费翻译站）

**本地路径**：`C:\Users\JCS\WorkBuddy\2026-05-16-task-2\free-translator\`

**功能**：20种语言互译
**API**：MyMemory（5万字符/天免费，不绑卡，不支持自动检测）
**注意**：LibreTranslate 已需要 API Key，仅 MyMemory 可用

**文件结构**：
```
free-translator/
├── index.html      # 翻译界面
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── vercel.json
```

---

### 站点4：ImageToolLab（图片工具站）🆕

**本地路径**：`C:\Users\JCS\WorkBuddy\2026-05-16-task-2\image-toollab\`

**已完成工具（2个）**：
1. **Image Converter** — WebP/PNG/JPG/AVIF/GIF/BMP 互转，批量50张，质量调节，背景色
2. **Image Resizer** — 按百分比/精确尺寸/最大尺寸/固定宽高，锁定比例，批量50张，预设快捷按钮

**技术**：纯前端 Canvas API

**待办**：
- [ ] 创建 GitHub 仓库 image-toollab
- [ ] 推送代码
- [ ] 部署到 Vercel
- [ ] 提交 Google Search Console

**文件结构**：
```
image-toollab/
├── index.html              # 首页
├── image-converter.html    # 图片格式转换
├── image-resizer.html      # 图片缩放
├── css/style.css           # 样式
├── favicon.svg
├── sitemap.xml
├── robots.txt
└── vercel.json
```

---

### 站点5：Hover Translate（Chrome 翻译插件）

**本地路径**：`C:\Users\JCS\WorkBuddy\2026-05-16-task-2\free-translator-extension\`

**功能**：
- 悬停1秒自动翻译
- 右键翻译
- 笔记保存/浏览/导出CSV
- 引流到 FreeTranslator 网站

**注意**：MyMemory API 在国内需要 VPN 才能访问

**待办**：
- [ ] 上架 Chrome 商店（需 $5 注册费 + 银行卡安全码）
- [ ] 制作宣传图 440x280
- [ ] 制作截图 1280x800
- [ ] 写英文商店描述
- [ ] 隐私政策页面

**文件结构**：
```
free-translator-extension/
├── manifest.json    # Manifest V3
├── background.js    # 后台服务（翻译API + 笔记CRUD）
├── content.js       # 内容脚本（悬停检测 + 浮窗）
├── content.css      # 浮窗样式
├── popup.html       # 弹窗（翻译 + 笔记标签页）
└── icons/           # 图标 16/48/128px
```

---

## 三、新建站点标准流程（给同事的操作手册）

### 每个新站都要做这些：

#### Step 1: 创建本地项目
```bash
mkdir -p 新站名
cd 新站名
```

#### Step 2: 必备文件
每个站必须包含：
- `index.html` — 首页（工具卡片列表）
- `[工具名].html` — 工具页
- `css/style.css` — 样式
- `favicon.svg` — 图标
- `robots.txt` — SEO
- `sitemap.xml` — SEO
- `vercel.json` — 部署配置

#### Step 3: 品牌规范
- 所有页面底部写 `by JCS Labs`
- 首页标题用 `[品牌名]`，例如 `ImageToolLab`
- 全英文界面
- Google Analytics 代码：`G-503ZSLGF0W`（所有站统一）
- 配色参考 ToolLabs 的蓝白风格

#### Step 4: Google Analytics 代码模板（所有站通用）
```html
<!-- 放在 </head> 前 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-503ZSLGF0W"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-503ZSLGF0W');
</script>
```

#### Step 5: vercel.json 模板
```json
{
  "cleanUrls": true
}
```

#### Step 6: robots.txt 模板
```
User-agent: *
Allow: /
Sitemap: https://你的域名.vercel.app/sitemap.xml
```

#### Step 7: sitemap.xml 模板
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/sitemaps/0.9">
  <url>
    <loc>https://你的域名.vercel.app/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://你的域名.vercel.app/工具页.html</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

#### Step 8: Git 推送
```bash
git init
git config user.email "153247181@qq.com"
git config user.name "Jasonchan005"
git add -A
git commit -m "Initial commit"
# 先在 GitHub 网页创建仓库，然后：
git remote add origin https://github.com/Jasonchan005/仓库名.git
git branch -M main
git push -u origin main
```

#### Step 9: Vercel 部署
1. 打开 https://vercel.com/new
2. 导入 GitHub 仓库
3. 点 Deploy
4. 等待部署完成，拿到 .vercel.app 域名

#### Step 10: SEO 提交
1. 打开 https://search.google.com/search-console
2. 添加新站点（使用 .vercel.app 域名）
3. 验证方式：HTML 标签 或 DNS
4. 提交 sitemap.xml

---

## 四、下一批要做的工具站（优先级排序）

### 🔥 第一梯队（月搜索量 100万+，最先做）

| 工具 | 搜索量 | 建议站名 | 技术方案 | 代码量 |
|------|--------|---------|---------|--------|
| **QR Code Generator** | 500万+ | QRToolLab | qrcode.js | 小（1天） |
| **Image Converter** | 200万+ | ✅ 已在 ImageToolLab | Canvas API | 已完成 |
| **Image Resizer** | 150万+ | ✅ 已在 ImageToolLab | Canvas API | 已完成 |
| **Word Counter** | 100万+ | WordToolLab | 纯 JS 字符串操作 | 极小（半天） |

### 🔵 第二梯队（月搜索量 30-100万）

| 工具 | 搜索量 | 建议归属站 | 技术方案 |
|------|--------|-----------|---------|
| **Color Picker**（从图片取色） | 80万+ | ImageToolLab | Canvas getImageData |
| **Password Generator** | 80万+ | 新站 SecurityToolLab | 纯 JS crypto |
| **JSON Formatter**（格式化/验证） | 60万+ | 新站 DevToolLab | 纯 JS |
| **Base64 Encoder/Decoder** | 50万+ | DevToolLab | 纯 JS btoa/atob |
| **Image Cropper**（裁剪） | 40万+ | ImageToolLab | Cropper.js |
| **CSV to JSON Converter** | 30万+ | DevToolLab | 纯 JS |

### 🟢 第三梯队（月搜索量 10-30万）

| 工具 | 搜索量 | 技术方案 |
|------|--------|---------|
| **Unit Converter** | 25万+ | 纯 JS |
| **SVG Optimizer** | 20万+ | SVGO |
| **Diff Checker**（文本对比） | 20万+ | diff 库 |
| **Age Calculator** | 15万+ | 纯 JS |
| **Case Converter**（大小写转换） | 15万+ | 纯 JS |
| **HTML to Markdown** | 10万+ | Turndown.js |
| **Lorem Ipsum Generator** | 30万+ | 纯 JS |

### 建议建站规划

| 站名 | 包含工具 | 优先级 |
|------|---------|--------|
| **ImageToolLab** | Converter ✅, Resizer ✅, Color Picker, Cropper | ⭐ 继续 |
| **QRToolLab** | QR Code Generator | ⭐ 最先 |
| **WordToolLab** | Word Counter, Case Converter | ⭐ 高 |
| **DevToolLab** | JSON Formatter, Base64, CSV to JSON, HTML to Markdown | 🔵 高 |
| **SecurityToolLab** | Password Generator, Lorem Ipsum | 🔵 中 |

---

## 五、各站间互链策略

### 底部导航（所有站统一加）
```html
<footer>
  <div class="tools-by-jcs">
    <span>More free tools by JCS Labs:</span>
    <a href="https://toollabs-phi.vercel.app">PDF Tools</a>
    <a href="https://ai-toolbox-rouge.vercel.app">AI Software</a>
    <a href="https://free-translator-liart.vercel.app">Translator</a>
    <!-- 新站持续添加 -->
  </div>
</footer>
```

### 目的
- 提升站群整体 SEO 权重
- 互相导流，增加页面停留时间
- 品牌统一，增加可信度

---

## 六、注意事项和踩坑经验

### 开发规范
1. **纯前端** — 不调用任何付费 API（MyMemory 翻译 API 是唯一例外，免费不绑卡）
2. **全英文** — 所有界面、描述、SEO 元数据都用英文
3. **响应式** — 必须适配手机端
4. **本地库** — 不依赖 CDN，所有 JS 库放到 lib/ 文件夹
5. **不用框架** — 纯 HTML/CSS/JS，SEO 更友好
6. **GA 统一** — 所有站都用 G-503ZSLGF0W

### 内容审核红线
- ❌ 不碰名人/品牌名（版权风险）
- ❌ 不碰健康/医疗/健身建议（法律风险）
- ❌ 不碰法律/税务/投资建议
- ❌ 不碰政治敏感内容
- ❌ 不允许用户上传内容（UGC 法律风险）
- ✅ 只做工具，不做内容生成
- ✅ AI 提示词只做风格/技术/场景类，不涉及人物

### 技术踩坑
- **MyMemory API** 在国内被墙，需要 VPN；不支持自动检测语言
- **LibreTranslate** 已需要 API Key，不再免费可用
- **Chrome 扩展** content script 无法注入 Chrome 内置 PDF 阅读器
- **jsPDF 中文** 需要嵌入 Noto Sans SC 字体（16MB），解决中文乱码
- **PDF 大文件** 超过 500MB 需要分片处理，避免浏览器内存溢出
- **OCR 中文** Tesseract.js 中文识别准确率不足，暂不上线
- **Vercel 免费版** 文件大小限制 50MB（包含部署产物）

### Git 操作
```bash
# 邮箱和用户名（所有仓库统一）
git config user.email "153247181@qq.com"
git config user.name "Jasonchan005"
```

---

## 七、AdSense 变现路径

### 当前状态
- 所有站流量为 0（刚上线，等待 SEO 收录）
- 需要每天 500+ 访客才能申请 AdSense
- 目标：20 个工具站，每个站每天 50-100 访客

### 申请条件
- 有用且原创的内容
- 独立的隐私政策页面
- 必要的关于我们/联系方式页面
- 符合 AdSense 政策

### 收入预期（参考）
- 每千次展示收入（RPM）：$1-5（工具类网站）
- 日均 1000 访客 → $1-5/天 → $30-150/月
- 20 个站 × 日均 100 访客 → $600-3000/月

### 提现方式
- 最低提现 $100
- 电汇到中国银行卡（支持）
- 需要提交税务信息（W-8BEN 表格）

---

## 八、下一步行动清单

### 立即执行
- [ ] ImageToolLab 推送代码到 GitHub + 部署 Vercel
- [ ] Hover Translate 上架 Chrome 商店（等银行卡）
- [ ] 给所有站添加底部互链导航

### 本周执行
- [ ] 建 QRToolLab（QR Code Generator）
- [ ] 建 WordToolLab（Word Counter）
- [ ] 给 ImageToolLab 加 Color Picker
- [ ] 给所有站提交 Google Search Console

### 本月执行
- [ ] 建 DevToolLab（JSON Formatter, Base64, CSV to JSON）
- [ ] 建 SecurityToolLab（Password Generator）
- [ ] 累计 10 个站上线
- [ ] 开始关注 AdSense 申请条件

---

## 九、关键账号信息

| 服务 | 账号 | 备注 |
|------|------|------|
| GitHub | Jasonchan005 | 邮箱: 153247181@qq.com |
| Vercel | 同 Gmail | 免费版 |
| Google Analytics | G-503ZSLGF0W | 所有站统一 |
| Google Search Console | 同 Gmail | 需要每个站单独添加 |
| Gmail | 用于海外业务 | — |
| QQ 邮箱 | 153247181@qq.com | 用于国内/GitHub |

---

*本文档由 JCS Labs 维护，每次新站上线后更新。*
