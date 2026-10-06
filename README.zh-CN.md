<div align="center">

# HiAPI 品牌套件

**一句话说清你的生意 → 一个可编辑的 Logo、整套品牌识别、真实感样机和一页品牌手册。**

品牌定位 · SVG Logo 系统 · 配色 · 字体 · 语气 · 门头、包装、周边、社媒样机 · 品牌规范页<br>
适用于 Claude Code、Codex 等编程 Agent · 样机通过 [HiAPI](https://www.hiapi.ai/zh) 生成

[English](README.md) · 简体中文 · AI Agent？先读 [llms-install.md](llms-install.md)

<img src="assets/readme/mockups.jpg" width="100%" alt="Ember & Oat 样机">

<sub>Ember & Oat，一家虚构的柴火面包店：Agent 用 SVG 画出 Logo，再生成 8 张样机，每张用的都是<b>同一个</b> Logo，总共 $0.40。</sub>

</div>

## 为什么看起来对

多数 AI Logo 工具让图像模型去「发明」Logo，结果名字拼错、每张图里的标志都不一样。这里刻意分了工：

1. **Logo 由 Agent 用 SVG 画**：真正的几何图形和字体，可编辑，放多大都清晰。
2. **图像模型只负责「放」**：每张样机都以渲染好的 Logo 为参考生成（HiAPI 上的 GPT Image 2.5 图生图），所以杯子、纸袋、招牌、菜单上的标志和拼写都完全一致。
3. **一页收尾**：Logo 系统、带用途说明的配色、字体、语气，以及样机墙。

<img src="assets/readme/book-top.jpg" width="100%" alt="生成的品牌手册">

[完整品牌手册 →](assets/readme/book-full.jpg) · [Logo SVG](examples/ember-oat/logo/) · [样机计划](examples/ember-oat/plan.json)

## 安装

```bash
npx -y github:HiAPIAI/hiapi-brand-kit-skill -y
export HIAPI_API_KEY=你的key        # https://www.hiapi.ai/zh/dashboard/api-keys
```

然后对 Agent 说：

- 「给一家叫 Ember & Oat 的社区面包店做品牌：温暖、真诚、柴火烤。」
- 「给我的笔记 App 做 Logo 和发布套件：App 图标、应用商店页面、发布海报的样机。」
- 「这是我们现在的 Logo（logo.png），做门头、包装、社媒样机和一份品牌手册。」

## 交付内容

| 文件 | 内容 |
|---|---|
| `logo/mark.svg`、`primary.svg`、`stacked.svg`（及 PNG） | 可编辑的 Logo 系统 |
| `brand.json` | 名称、故事、受众、性格、配色及用途、字体、语气该做和不该做 |
| `mockups/` | 带原版 Logo 的真实感样机，`manifest.json` 记录实际花费 |
| `brand-book.html` | 一页品牌规范网站 |

费用：只有样机是 HiAPI 付费调用，1K 每张 $0.05（[定价](https://www.hiapi.ai/zh/pricing)），先用 `--dry-run` 看预估。

## 许可

MIT。示例品牌为虚构。
