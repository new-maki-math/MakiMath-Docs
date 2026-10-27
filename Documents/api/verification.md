# 本轮核对记录

## 依据与验证范围

后端基线：本地main `df87ca08ce1daa692e8127a70a57f6955e458762`。主要业务变更 `7ebd37f`，前置关系并发整理 `174743f`，日志整理 `df87ca0`。通过Git提交快照核对，不采用未提交工作区变更。

核对文件：`docs/api.md`；`src/app.js`；`src/routes/{auth,knowledge,lectures,review,search}.js`；对应services及access.js；`src/plugins/{auth,crypto}.js`；`src/lib/{validate,errors,crypto}.js`；`src/config.js`；`Database/schema.sql`；`test/{backend,integration,prerequisites.integration,logging}.test.js`。产品依据为团队角色说明中的知识点稳定身份、固定版本引用、完整讲义审核及本地掌握状态等规则。没有找到单独的产品决策记录，以下未决项不能视为已获批准。

本轮示例按实现静态核对，不是数据库响应录制。响应片段只展示接入所需字段，完整结构见接口页。后端集成测试文件是测试设计证据，未执行不能写成已验证；本轮实际检查结果见本页末尾。

## 差异与待确认事项

| 位置与证据 | 当前行为及影响 | 处理建议与责任 |
| --- | --- | --- |
| docs/api.md认证表；routes/auth.js的me处理 | 文档写“返回当前用户”，实现是`{ user }` | 本轮文档明确包裹结构；前端调整解包 |
| docs/api.md审核段；services/review.js的decide | “推荐默认关闭”只适用于初始值；新版审核不重置原true | 文档按实现说明；是否新版必须重新推荐，由总工确认 |
| services/auth.js的logout | 用所传刷新令牌删除，令牌不匹配仍204，未强制匹配Bearer会话 | 后端确认是否校验对应sid或撤销当前会话；前端先传最新令牌，文档不承诺204必然撤销当前会话 |
| services/review.js与schema的guard_content_review | 管理员可审核自己提交内容 | 总工确认是否禁止自审；不自行补权限限制 |
| services/review.js的decide、services/lectures.js的publication | 审核通过自动发布；所有者可直接下架/重新上架已审核公开版；archived也可重新published | 总工确认发布是否还需独立动作，以及归档是否可恢复；当前按实现写，不承诺归档终态 |
| services/lectures.js的snapshot；services/knowledge.js的getPublicRevision | 点disabled/archived时直接公开详情404，但已有公开讲义继续返回固定引用正文；保存引用只检查approved，不检查点active | 后端与总工确认停用含义，是否禁止新增引用/屏蔽已有引用；不能自行删改已审核讲义 |
| services/knowledge.js的createRevision/save/submit | 非active点不能创建新版本，但已有草稿仍可保存提交；审核通过只更新公开指针，不恢复active | 后端确认停用是否阻断编辑审核，补统一规则或明确保留现状 |
| src/lib/crypto.js的SERVER_PUB_B64/getServerPrivKey | 可用环境变量换私钥，但公开公钥固定；自定义密钥可能导致浏览器协商失败 | 后端确认公钥派生/配置方式并验证；文档不承诺可独立轮换私钥 |
| src/app.js注册路由；旧API/架构页面 | courses/chapters/sections、旧动画、旧推荐搜索接口已移除 | 本轮撤下旧契约，保留旧URL迁移指引；不是简单重命名映射 |
| schema脚本及旧开发/部署指南 | 新schema仅初始化空库，无默认管理员、不含旧模型迁移；旧说明不可继续当作升级步骤 | 本轮修正开发入口并标记部署页待复核；部署工程师另确认首管理员配置和部署脚本 |

## 本轮检查结果

2026-10-27：从df87ca0导出独立Git快照，复用已安装依赖，设置MAKIMATH_INTEGRATION=0后执行node --test：12项，10项通过、2项数据库集成跳过、0失败。通过项覆盖权限、参数、动画禁用键、讲义提交并发号/重复提交、前置替换事务及日志。未准备独立测试数据库，因此未运行真实数据库全流程、引用约束或并发集成验证，也未初始化/迁移业务数据库。

文档执行npm run docs:build通过；检查新增接口页中的JSON代码块均可解析，并核对路由覆盖。构建通过不等于前后端联调成功。

工作期间另发现后端工作区存在未提交的管理员初始化工具。首次在工作区运行的npm test包含这些未提交测试（15通过、2跳过），不作为本契约基线证据；上述10通过结果来自独立提交快照。未提交工具没有纳入接口能力说明。
