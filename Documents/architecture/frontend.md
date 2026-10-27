# 前端接入边界

本轮以新后端main df87ca0契约为依据，未检查或验收前端当前实现。以下是接入要求，不表示页面功能已经完成。原页面关于整篇源码WASM编译、旧课程接口和实时预览的描述不再作为当前接口依据。

请求层需处理access_token与refresh_token、me的user包裹、204空响应、加密2xx与明文错误。注册后单独登录，刷新轮换令牌，注销/改密清理本地会话状态。

编辑层区分知识点贡献和讲义编辑。讲义读取返回revision及chapters树，保存构造白名单DTO，保留每级occurrence_id并携带edit_version。引用块只保存固定版本ID，不回写公共正文；作者块编辑自己的source。读取树的数据库行ID和knowledge_*联查字段不能回传。

阅读层按block_type选择source或knowledge_source，不再依赖旧sections/:id/doc的AST响应；动画不得继续执行scenes_code。渲染器适配方式与允许的动画数据结构仍需前端和后端另行验证。

本地掌握记录以知识点永久ID为键，引用实例位置用occurrence_id。新版知识点不会自动替换讲义固定引用。完整步骤见[前端接入流程](../api/frontend-integration.md)，字段见[讲义 API](../api/lectures.md)。
