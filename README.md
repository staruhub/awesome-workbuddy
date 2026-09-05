<h1 align="center">
  <a href="https://www.workbuddy.cn/"><img src="./assets/banner.png" alt="Awesome WorkBuddy" width="800" /></a>
</h1>

<p align="center">
  <a href="https://awesome.re"><img src="https://awesome.re/badge.svg" alt="Awesome" /></a>
  <a href="https://github.com/staruhub/awesome-workbuddy/stargazers"><img src="https://img.shields.io/github/stars/staruhub/awesome-workbuddy?style=social" alt="GitHub Stars" /></a>
  <a href="https://github.com/staruhub/awesome-workbuddy/network/members"><img src="https://img.shields.io/github/forks/staruhub/awesome-workbuddy?style=social" alt="GitHub Forks" /></a>
  <a href="https://github.com/staruhub/awesome-workbuddy/blob/main/LICENSE"><img src="https://img.shields.io/github/license/staruhub/awesome-workbuddy" alt="License" /></a>
  <a href="https://github.com/staruhub/awesome-workbuddy/commits/main"><img src="https://img.shields.io/github/last-commit/staruhub/awesome-workbuddy" alt="Last Commit" /></a>
</p>

> 腾讯 WorkBuddy 生态资源精选清单：官方资源、技能插件、提示词工作流、教程、评测与对比，一站式收录。

**WorkBuddy** 是腾讯云 CodeBuddy 团队推出的全场景职场 AI 智能体桌面工作台：一句话描述需求，它自主规划、调用工具、多 Agent 并行执行，交付可验收的结果。支持 Skills 扩展、MCP 协议、本地文件处理、微信/企微远程指挥与定时任务。

*A curated list of awesome resources, skills, prompts, tutorials and best practices for Tencent WorkBuddy — the AI Agent desktop workbench from the Tencent Cloud CodeBuddy team. Chinese-first, contributions welcome.*

## Contents

- [Official Resources 官方资源](#official-resources-官方资源)
- [Skills & Plugins 技能与插件](#skills--plugins-技能与插件)
- [Prompts & Workflows 提示词与工作流](#prompts--workflows-提示词与工作流)
- [Tutorials & Guides 教程与上手指南](#tutorials--guides-教程与上手指南)
- [Deep Dives & Reviews 深度拆解与评测](#deep-dives--reviews-深度拆解与评测)
- [Comparisons 对比测评](#comparisons-对比测评)
- [Integrations 生态集成](#integrations-生态集成)
- [Community 社区与讨论](#community-社区与讨论)
- [Related Awesome Lists 相关列表](#related-awesome-lists-相关列表)

## Official Resources 官方资源

- [WorkBuddy 官网（国内版）](https://www.workbuddy.cn/) - 产品首页，下载入口、功能演示与最新活动都在这里.
- [WorkBuddy 官网（海外版）](https://www.workbuddy.ai/) - 国际版官网，面向海外用户，支持 Slack / Telegram / Discord 远程联动.
- [WorkBuddy 官方文档](https://www.workbuddy.ai/docs/workbuddy/) - 从快速上手、创建任务到平台集成的完整官方手册.
- [WorkBuddy 官方下载页](https://www.codebuddy.cn/work/) - 客户端下载入口，自动识别 Windows / macOS，新用户注册送 Credits.
- [官方技能市场说明](https://www.codebuddy.ai/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market) - 官方文档对 Skills 市场机制与安装方式的说明.
- [ClawHub 技能注册表](https://clawhub.ai/) - OpenClaw / WorkBuddy 通用的官方技能仓库，数千个 Skills 可检索安装.
- [Tencent/workbuddy-bench](https://github.com/Tencent/workbuddy-bench) - 腾讯官方开源的评测基准，用真实角色扮演工作任务衡量 Coding Agent 表现.
- [腾讯官方新闻稿：效率智能体工具集](https://www.tencent.com/zh-cn/articles/2202350.html) - 2026 腾讯云 AI 产业应用大会实录，含 WorkBuddy 企业版与 Agent Suite 发布细节.

## Skills & Plugins 技能与插件

- [awesome-workbuddy-skills](https://github.com/shuangying0001-beep/awesome-workbuddy-skills) - 22 个实战打磨的 SKILL.md 集合：RPA 自动化、浏览器采集、微信生态、Canvas 内容工厂等.
- [Ldxs001/workbuddy-skills](https://github.com/Ldxs001/workbuddy-skills) - 20+ 自研技能与智能体仓库：本地 RAG、技能规范审查、draw.io 做图、智能周历等，Gitee / GitHub 双平台同步.
- [workbuddy-wechat-publisher](https://github.com/cnproduct/workbuddy-wechat-publisher) - 公众号全自动发布技能包：写作 → 配图 → 排版 → 推送草稿箱，四个子技能可拆开单用.
- [awesome-website-prompts-and-skills](https://github.com/TencentEdgeOne/awesome-website-prompts-and-skills) - 「WorkBuddy × Tencent EdgeOne 挑战赛」官方作品池，116 个建站 Prompt + 50 个 Skill.
- [survey-scale-review](https://github.com/gtskevin/survey-scale-review) - 问卷量表审查 Skill，仓库内附专门的 WorkBuddy 安装指南，不会命令行也能装.
- [7q-decision-skill](https://github.com/reallysix/7q-decision-skill) - 孙子兵法「五事七计」决策框架 Skill，附 workbuddy-guide.md 演示如何装入 WorkBuddy 并发布到 ClawHub.
- [LinSkills](https://linskills.qiniu.com) - 七牛云维护的社区技能精选库，按下载量排行，ZIP 下载解压即用.
- [GitHub Topic: workbuddy](https://github.com/topics/workbuddy) - GitHub 上 80+ 个 workbuddy 相关仓库的总入口，找新项目先看这里.

## Prompts & Workflows 提示词与工作流

- [100 条工作提效 Prompts](https://github.com/staruhub/awesome-workbuddy/blob/main/prompts/100-work-efficiency-prompts.json) - 本仓库自带的提效指令库：10 大办公场景各 10 条，覆盖调研、报表、PPT、纪要、开发、运营、人事财务，每条含完整指令、预期交付物和使用技巧，可直接粘贴给 WorkBuddy 抄作业.
- [workbuddy-guidelines](https://github.com/pipixia-run/workbuddy-guidelines) - 给 AI Agent 的 6 条行为铁律（基于 Karpathy 编码哲学），中英双语，贴进 Custom Instructions 即用.
- [用 WorkBuddy 管理小红书内容生产全流程](https://cloud.tencent.com/developer/article/2674563) - 选题、文案、500 条配图 Prompt 库、排期与复盘的完整工作流实录，附踩坑总结.
- [公众号内容自动化案例拆解](https://llm-agent.cc/zh/blog/workbuddy-wechat-media-automation-cases-zh) - 拆解「搜索 → 改写 → 去 AI 味 → 排版 → 发布」的分层 Skill 栈怎么搭.

## Tutorials & Guides 教程与上手指南

- [WorkBuddy 实战蓝皮书](https://github.com/AlephAITech/WorkBuddyGuide) - 社区共创的开源实战读本：27 章覆盖安装、真实案例、Skill 开发与多 Agent 系统设计，并提供 [在线阅读版](https://workbuddy.homes).
- [WorkBuddy 下载安装使用全攻略](https://cloud.tencent.com/developer/article/2638618) - 腾讯云社区官方教程：安装 → 登录 → 权限 → 模型选择 → 远程控制全流程.
- [零基础入门到精通实操教程](https://cloud.tencent.com/developer/article/2676752) - 手把手带新手 10 分钟上手，附 Credits 积分领取与发文赚积分攻略.
- [WorkBuddy 从入门到精通（掘金）](https://juejin.cn/post/7620801241318506537) - 界面模块拆解、Craft / Auto / Skills 三种模式与「养虾记录」成就系统介绍.
- [海外版下载安装使用指南](https://www.tencentcloud.com/techpedia/144100?lang=zh) - TencentCloud 官方出品的海外版上手教程，中英双语.
- [Skills 完全上手指南](https://xmsumi.com/detail/2691) - 从 30+ 预设技能到外部技能市场，教你搭建个人 AI 工作流.

## Deep Dives & Reviews 深度拆解与评测

- [WorkBuddy 深度实战：把重复工作交给 AI](https://juejin.cn/post/7659759829781413897) - Java 架构师视角拆解工具层、知识库层、多 Agent 执行层、专家调度层四层架构，附真实提效数据.
- [WorkBuddy 深度实战：7 个效率翻倍玩法](https://juejin.cn/post/7662938943021776906) - 技能系统、多模态生成、三层记忆机制的实战心得，文章生成效率提升 95%.
- [WorkBuddy 技能与插件深度解析](https://www.cnblogs.com/dapenson/p/19718555) - 用 Arduino 类比讲透 Skills、Plugins、Automations 三个模块的区别与用法.
- [CodeBuddy + WorkBuddy：一个 AI 生态通吃全场景](https://www.cnblogs.com/informatics/p/19722426) - 从写代码到管周报，看腾讯「Buddy 家族」如何覆盖完整工作链路.
- [对标 OpenClaw，腾讯版「小龙虾」WorkBuddy 正式上线](https://www.cnblogs.com/jinjiangongzuoshi/p/19700342) - 首发解读：兼容 OpenClaw 技能、免部署、多模型切换与 5000 Credits 赠送.
- [中国经营报：WorkBuddy 藏着腾讯 AI Agent 时代的「野心」](https://finance.sina.com.cn/jjxw/2026-06-09/doc-iniauvas6499192.shtml) - 产品负责人刘毅访谈：2026 下半年企业级智能体将集中落地.
- [腾讯首发效率智能体工具集（China Daily）](https://cn.chinadaily.com.cn/a/202606/08/WS6a268857a310942cc49b09d2.html) - 英文官媒报道：WorkBuddy 个人版 3 个月迭代 43 个版本，DAU 居国内效率智能体首位.
- [WorkBuddy 企业版与 Agent Suite 发布快讯](https://www.sina.cn/news/detail/5306441142375635.html) - 7×24 专家数字员工、项目制人机协作、企业级管理后台三大能力.
- [报告：WorkBuddy 月访问量居 AI 原生办公智能体市场首位](https://www.citnews.com.cn/news/217114) - 易观《中国办公智能体平台市场研究报告 2026》核心数据解读.
- [把企业版做成 AI 全能秘书](https://www.gm7.org/archives/126714) - 一人公司实战：方案初稿、会议纪要、数据分析、邮件自动处理与多租户隔离.
- [直击 WAIC 2026：腾讯智能体矩阵集体亮相](https://www.10100.com/article/149183573) - WorkBuddy 发布独立 APP，现场观众用真实需求验证「从一句话到交付」.

## Comparisons 对比测评

- [WorkBuddy vs 钉钉悟空 vs 字节 Aily：桌面 Agent 提示词工程对比](https://www.woshipm.com/ai/6424317.html) - 人人都是产品经理：从系统提示词看三层记忆架构、Agent Loop 与 Skills 机制，技术含量最高的对比文.
- [Manus、Codex、WorkBuddy：AI Agent 三巨头功能对比](https://juejin.cn/post/7654481202876071999) - 云端 VM、本地桌面、沙箱执行三种技术路线的横向对比与未来趋势判断.
- [龙虾大战：OpenClaw vs WorkBuddy 深度测评](https://juejin.cn/post/7632469423668625450) - 定位、上手难度、功能深度、安全性、生态、适用人群六维横评，附评分表.
- [AutoGLM vs Manus vs WorkBuddy：通用智能体三条路线](https://www.yun88.com/news/9636.html) - 云端 Agent、云端通用 Agent、本地 Agent 的本质差异与选型指南.
- [CodeBuddy / WorkBuddy / QClaw 怎么选](https://www.leavescn.com/Forums/Detail/18339) - 腾讯「龙虾系」三兄弟的定位辨析：开发者、职场人、个人用户各选哪个.
- [腾讯拟 20 亿美金下注：WorkBuddy 不够，还要 Manus](https://stock.stockstar.com/SS2026071600013008.shtml) - 证券之星：从战略层面对比 WorkBuddy（企业内部协作）与 Manus（个人目标驱动）的场景差异.

## Integrations 生态集成

- [实操记录：WorkBuddy 企业微信接入](https://cloud.tencent.com/developer/article/2644091) - 腾讯云社区官方实操：智能机器人创建、长连接配置、URL 回调备选方案与排错.
- [用 WorkBuddy + 腾讯地图 Skills + MCP 做文旅管家](https://lbs.qq.com/article?id=1274) - 腾讯位置服务官方征文作品：mcp.json 配置腾讯地图 MCP Server，美食、酒店、路线一句话搞定.
- [WorkBuddy 接入微信、飞书、钉钉、企微与 QQ 指南](https://gitcode.csdn.net/69b3a7ec0a2f6a37c596f931.html) - 按平台分步介绍机器人、凭证与回调配置；提交密钥前请核对当前官方文档.
- [WorkBuddy 接入企业微信：内部与外部配置全流程](https://post.smzdm.com/p/aomlm489) - 腾讯内部免配置开箱即用 vs 外部企业 API 模式机器人配置，两种路径都讲透.
- [WorkBuddy 接入公众号教程](https://gptprozh.com/notes/workbuddy) - 通过 wechat_oa_api_mcp 实现一句话生成文章、自动排版、推送草稿箱.
- [WorkBuddy 企业微信玩龙虾实操](https://www.aixq.cc/9898.html) - 企微接入手把手教学，附 2026 年发帖领 Credits 活动攻略（最高 48000 Credits）.
- [WorkBuddy × 李未可 X-AI 记忆眼镜](https://view.inews.qq.com/a/20260718A057YA00) - WAIC 2026 发布的首款 WorkBuddy 硬件生态产品：会议记录自动同步为长期工作记忆.

## Community 社区与讨论

- [CocoLoop：CodeBuddy 和 WorkBuddy 什么关系？](https://www.cocoloop.cn/t/topic/2022) - 社区问答帖：两个产品的定位差异、官网入口与生态成熟度讨论.
- [AIHub 产品收录页](https://www.aihub.cn/agents/workbuddy/) - 第三方工具导航站的功能矩阵、权限机制与官网入口汇总.
- [B 站视频：龙虾类工具介绍](https://www.bilibili.com/video/BV1GCTk6bE5Q/) - OpenClaw、Hermes、WorkBuddy、QClaw 视频横评，含 WorkBuddy Skill 安装建议.

## Related Awesome Lists 相关列表

- [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) - 5400+ 个 OpenClaw 技能按 30+ 分类精选，WorkBuddy 完全兼容 OpenClaw 技能体系.
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) - Claude Code 生态精选；WorkBuddy 技能格式与 Claude Code Skill 互通，大量资源可复用.
- [awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) - MCP Server 大全，挑一个写进 WorkBuddy 的 mcp.json 即可扩展能力边界.
- [Awesome WorkBuddy（双语安全审查目录）](https://github.com/sandbaseai/awesome-workbuddy) - 独立收录经过来源、许可证、权限与数据流审查的 WorkBuddy/CodeBuddy/OpenClaw 资源、Skills、MCP、工作流与文档；不代表腾讯官方背书.

## Contributing

欢迎补充优质的 WorkBuddy 资源！提交前请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)：收录标准、条目格式与 PR 流程都在里面。简单来说——必须与 WorkBuddy 直接相关、链接真实有效、一句话说明、放对分类。
