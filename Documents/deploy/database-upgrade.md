# 既有数据库的手工升级

本阶段后端基线ea63e51。`Database/schema.sql`用于初始化空库，不是既有库的升级入口。不要为了更新功能重建业务库；本地已应用某个脚本不代表远端库已经应用，更不代表部署会自动升级。

## 当前保留的手工脚本

| 脚本（后端仓库） | 适用前提与影响 |
| --- | --- |
| `Database/manual/archive-disabled-knowledge-points.sql` | 目标库已有当前知识点表、仍允许disabled状态；把disabled改为archived并调整约束，保留点和正文 |
| `Database/manual/enforce-single-lecture-draft.sql` | 已有source_draft_id的讲义版本模型；添加每讲义唯一工作草稿索引；若已有重复草稿会中止，需人工处理，不自动删除/合并 |
| `Database/manual/remove-lecture-knowledge-references.sql` | 已切换小节source引用模型；移除旧lecture_knowledge_references关系表，不删除讲义源码或知识点；旧关系表数据本身不保留 |
| `Database/manual/allow-archived-lecture-deletion.sql` | 已有当前讲义版本模型；调整来源外键为延迟检查并更新归档删除相关触发函数；脚本本身不删除业务数据，不等于已执行永久删除 |

这些是各自有前提的手工调整，不是从任意旧schema自动迁移的完整脚本集。特别是更早的知识点版本/blocks模型，不能假定执行这四个文件就完成转换。

## 执行前后

先确认实际连接的环境、数据库版本与表/列/约束，备份并制定恢复方式，再选择适用脚本。手工执行使用事务并在错误时停止；重复草稿等冲突应先报告并由管理员处理，不能把报错改成自动删数据。执行后核对相关约束、现有数据和后端接口结果，记录已执行版本；本轮没有代为执行SQL或验证部署库。

当前deploy.js和deploy.ACL.js的增量检查针对`Database/migrations`，**不会扫描或执行`Database/manual`**。源码已部署不表示这些约束已经变更；由部署负责人明确安排目标环境手工升级。不要在部署配置中以重建数据库代替保留数据升级。

`allow-archived-lecture-deletion.sql`放开的是受限删除路径：只有管理员DELETE归档讲义时，服务端设置事务内目标上下文并清理该讲义关联。它不会取消所有内容的编辑/审核保护。
