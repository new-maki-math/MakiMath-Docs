# 开发接入准备

当前前后端基线见[接入流程](../api/frontend-integration.md)。后端需Node.js22+、PostgreSQL及项目依赖，默认127.0.0.1:3000，/health检查数据库连接。前端由Vite开发服务代理/api，具体代理目标以环境配置为准。

Database/schema.sql仅初始化空库，没有默认管理员密码。新环境在完成结构初始化和后端.env配置后，在后端交互终端运行npm run admin:init；命令先显示实际目标库，确认后输入账号资料与两次隐藏密码，已有有效管理员时拒绝新增，不创建数据库或执行结构脚本。不要把密码放在提交或命令行参数中。

已有库使用[手工升级说明](../deploy/database-upgrade.md)，不能以重建库代替迁移。配置中的同名进程环境变量优先于.env，操作前以实际目标为准。

接口已不再提供knowledge-revisions、旧courses/sections、固定版本blocks或动画。知识点管理员直接维护；讲义单工作草稿保存带edit_version，提交生成独立快照，宏按slug读取当前知识点。当前文档轮次未运行构建、测试或浏览器，仅做静态核对。
