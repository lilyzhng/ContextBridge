ContextBridge – Chrome Plugin (MVP)

## 概述

ContextBridge 是一个极简 Chrome 插件，用于把当前网页中的 AI 对话（ChatGPT / Gemini / Claude）原样抓取并导出为"原始对话文件（raw transcript）"，作为后续上下文整理和长期记忆构建的输入。

插件只做一件事：忠实、稳定地抓取当前打开的单个对话线程，不做任何总结、去噪或理解。

## 核心功能

当用户点击插件按钮时，插件从当前页面中提取该对话的所有轮次，按出现顺序记录每一轮的 role（user / assistant）和内容。内容需要完整保留段落结构、代码块、列表和链接，并统一导出为 Markdown 格式。插件不依赖视觉样式，只依赖页面中的对话语义结构。

导出的结果是一个 `raw.md` 文件，包含必要的元信息（页面 URL、抓取时间、平台标识），以及清晰分隔的对话轮次。文件通过浏览器下载，供 Obsidian 或其他工具直接使用。

## MVP 范围界定

ContextBridge MVP **不负责**：

- 去除噪音或修正语义
- 生成摘要、脑图或 memory
- 跨页面、跨会话合并内容
- 实时同步或自动备份

所有 raw → clean → memory 的处理都在插件之外完成。

这个插件的目标是成为"上下文采集层"，为后续的 ContextBridge memory compiler 提供稳定、可复现的输入。

## 技术架构

### 平台检测
- 通过 URL 模式匹配识别当前平台：
  - ChatGPT: `chatgpt.com/*`, `chat.openai.com/*`
  - Claude: `claude.ai/*`
  - Gemini: `gemini.google.com/*`

### DOM 提取策略
每个平台使用独立的提取器（extractor）模块：

- **ChatGPT**: 定位 `[data-message-id]` 或对话容器节点
- **Claude**: 定位消息内容区域（基于语义 class）
- **Gemini**: 定位对话卡片或消息块

每个提取器负责：
1. 识别 role（user/assistant）
2. 提取纯文本内容
3. 保留结构化内容（代码块、列表、链接）

### 内容保留规则

| 内容类型 | 处理方式 |
|---------|---------|
| 段落文本 | 保留原始换行和空格 |
| 代码块 | 保留为 Markdown fenced code blocks（含语言标识） |
| 列表 | 转换为 Markdown 列表格式 |
| 链接 | 保留为 `[text](url)` 格式 |
| 图片/附件 | 记录为 `[Image: alt_text]` 或 `[Attachment: filename]` |
| LaTeX | 保留为 `$...$` 或 `$$...$$` |
| 表格 | 尽量转换为 Markdown 表格，或保留为代码块 |

### 导出文件格式

```markdown
---
platform: chatgpt | claude | gemini
url: <完整对话 URL>
timestamp: <ISO 8601 格式，例如 2026-01-17T10:30:00Z>
conversation_id: <如果可提取>
extractor_version: 0.1.0
---

## User
<第一轮用户输入>

## Assistant
<第一轮助手回复>

## User
<第二轮用户输入>

...
```

**文件命名规则**: `contextbridge_<platform>_<timestamp>_raw.md`
例如: `contextbridge_chatgpt_20260117_103000_raw.md`

## 用户体验

### 交互流程
1. 用户打开 AI 对话页面
2. 点击浏览器工具栏中的 ContextBridge 图标
3. 插件显示简单状态提示（"提取中..." / "成功" / "失败"）
4. 自动下载生成的 Markdown 文件

### 权限需求
- `activeTab`: 访问当前标签页内容
- `downloads`: 下载生成的文件
- Host permissions: `chatgpt.com`, `claude.ai`, `gemini.google.com`

### 错误处理
- **不支持的页面**: 显示 "此页面不支持提取"
- **提取失败**: 显示 "提取失败，请刷新页面重试"
- **空对话**: 显示 "未检测到对话内容"
- **部分失败**: 仍然导出可用内容，在文件头部添加警告注释

## 成功标准（MVP）

1. **准确性**: 能够提取 95%+ 的文本内容，保留基本格式
2. **稳定性**: 在典型对话（10-50 条消息）中成功率 >90%
3. **性能**: 提取时间 <5 秒（对于 100 条消息以内的对话）
4. **兼容性**: 支持 ChatGPT、Claude、Gemini 的最新网页版本

## 边界情况处理

| 场景 | 处理方式 |
|------|---------|
| 流式响应中（助手仍在输出） | 提取当前已显示的内容 |
| 超长对话（>100 条消息） | 正常提取，可能需要更长时间 |
| 已编辑的消息 | 提取当前显示的版本 |
| 已删除的消息 | 不可见则不提取 |
| 分支对话（如 ChatGPT） | 仅提取当前分支 |
| 多模态内容（图片生成等） | 记录占位符，不下载实际文件 |

## 开发计划

### Phase 1: 单平台原型（ChatGPT）
- 实现基础提取逻辑
- 建立 Markdown 导出管道
- 测试文件格式

### Phase 2: 多平台支持
- 添加 Claude 提取器
- 添加 Gemini 提取器
- 统一接口设计

### Phase 3: 打磨与发布
- 错误处理完善
- 用户反馈机制
- 准备 Chrome Web Store 提交

## 未来扩展（Post-MVP）
- 自动检测页面变化，提示用户重新提取
- 本地文件夹自动保存（需要额外权限）
- 导出格式选项（JSON、纯文本等）
- 对话差异检测（增量更新）