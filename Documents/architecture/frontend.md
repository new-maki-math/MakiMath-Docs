# 前端渲染与编辑

当前前端以64cc122为基线。Renderer/TypstDoc.vue通过Typlet解析源码，typst/parse-document.js将支持的语法映射为Vue节点，公式单独调用Typlet渲染。MM扩展与正文解析分开维护。后端不返回旧doc AST，不再使用课程preset适配器。本站不是完整Typst编译环境，能力及参数边界见[Typst与MM宏](../authoring/typst-guide.md)。

知识点由管理员直接维护；讲义小节保存完整source。前端识别mm-knowledge的slug，从知识点公开接口读取当前active正文，挂载首框标题与本地掌握按钮。请求404与普通失败分别处理，知识点内嵌套引用不展开。详见[知识点引用](../authoring/knowledge-reference.md)。

TypstEditorPreview组合Monaco编辑、知识点搜索插入、预览和可选双向同步滚动。同步滚动默认关闭，通过源码区间和渲染锚点近似定位，不保证逐行像素一致。错误片段显示原文，诊断有行列号。

在线讲义的保存使用edit_version和章/节occurrence_id；源码内引用不再有后端实例标识。审核快照与工作草稿分开；审核通过会改变草稿并发号，前端恢复可见时检查更新，遇到本地脏内容先保留输入并提示冲突。不能把服务器新数据直接覆盖未保存编辑。

本地讲义、掌握状态、更新日志已读状态分别在浏览器IndexedDB保存，不按登录账号隔离，也无跨设备同步。更多操作见[工作台](../authoring/workbench.md)。本轮仅静态审阅，未运行渲染或联调测试。
