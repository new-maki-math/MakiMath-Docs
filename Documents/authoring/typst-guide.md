# Typst 与 MM 宏

直接写正文、标题和公式即可。平台在浏览器中解析已适配的 Typst 语法，再映射成网页组件；它不是完整 Typst 编译器。后端只保存和返回源码，不编译、不执行宏，也不替你验证引用目标。

## 从一段正文开始

```typst
= 数列极限
设数列为 $a_n$。

#mm-box-definition(title: [收敛])[
  这里写定义，可以包含 $ epsilon > 0 $ 等公式。
]

#mm-box-custom(title: [想一想])[
  你能举出一个满足定义的数列吗？
]
```

普通文本、段落、标题、强调、有序/无序/术语列表、原始文本和公式已有适配。`$x^2$` 是行内公式，`$ x^2 $` 是独立公式。数学写法可查 [Typst 数学参考](https://typst.app/docs/reference/math/)，但本站实际能力仍以 Typlet 和预览诊断为准。

部分静态 `text` / `set text` 参数、链接、高亮、对齐、间距、box、block 和 table 也能使用。参数不能任意照搬官方列表：正文不执行变量、函数定义、循环、import/include、包加载、show 规则或页面排版。未适配片段会保留源码并显示行列诊断。

## 内容框和标签

当前共有 **14 个 MM 宏**。下面八种框都接受一个正文内容块，唯一可选参数是 `title: [补充标题]`；不能把它写成字符串标题或另传颜色参数。

| 宏 | 标题 |
| --- | --- |
| `mm-box-definition` | 定义 |
| `mm-box-theorem` | 定理 / 公式 |
| `mm-box-example` | 例题 |
| `mm-box-warn` | 提醒 / 易错 |
| `mm-box-conclusion` | 结论 / 推论 |
| `mm-box-frequency` | 真题考频 |
| `mm-box-homework` | 作业 |
| `mm-box-custom` | 自定义；省略或空标题时不显示标题栏 |

标题只能放行内内容，如文字、行内公式或标签。不要在标题中放表格、独立公式或另一个框。旧 `defbox/thmbox/zt/makitag` 不在当前渲染链路中。

标签写成 `#mm-tag(color: "blue")[重点]`。color 可省略，默认 blue；预设只有 blue、cyan、green、orange、rose、purple，也可用 `rgb("B22234")`。不支持的颜色会提示并回退蓝色，标签正文只接受行内内容。

## 题目、选项和填空

```typst
#mm-question(source: "练习", title: [选择题], difficulty: 2, id: "limit-01")[
  选择正确的结论。
  #mm-question-options(columns: 2, [$a_n$ 收敛], [$a_n$ 发散])
  说明：#mm-question-blank(width: 6em)
]
```

| 宏 | 参数规则 |
| --- | --- |
| `mm-question` | source、id 为可选字符串；title 为可选行内内容块；difficulty 为可选整数 1–5；正文最多一个块，也可省略 |
| `mm-question-options` | 至少一个选项内容块；columns 可省略，或为 1、2、4；自动编号 A、B…，窄屏会减少列数 |
| `mm-question-blank` | 不接受正文；width 可省略，默认 4em，须为支持的静态非负长度 |

这些宏只负责显示，不提供答题提交、自动评分或答案记录。`#mm-test` 是不带括号的测试宏，显示 MM TEST。

## 引用公共知识点

```typst
#mm-knowledge(slug: "sequence-limit")
```

知识点引用宏只接受一个有效 slug 字符串。在讲义小节编辑器输入 `#mm-knowledge` 或其左括号时，会在受支持位置弹出搜索选择框。选择结果会填入完整代码；注释、字符串和原始文本中的同名文字不会自动触发，选择期间内容变化则需重新选位置。

知识点详情提供复制引用代码和“添加到我的讲义”：选择已有的本地讲义或可编辑在线草稿，再选章节、小节，引用会追加到小节末尾并保存。它不会自动新建缺少的章/节，也不会修改公共知识点正文。

引用读取当前 active 知识点。归档或删除显示缺失占位，其他读取错误可重试；知识点正文中的嵌套引用暂不展开。源码里可以重复引用，服务器不为每处引用生成实例 ID，也不在保存时检查目标。

## 细排版的边界

静态长度支持 0 或非负 pt/mm/cm/in/em/%，tracking 另支持负值；不支持 fr 和计算长度。`text` 支持已适配的字号、颜色、字体、字重、语言、方向及部分 OpenType 参数，实际效果还取决于浏览器和字体。

table 支持静态列数或列宽数组、开头单次表头、单元格跨行跨列及显式位置线条。最多 1000 列、20000 个网格位置，线条不能穿过合并单元格内部；不支持自动定位的 hline/vline。遇到诊断先简化参数，而不是假设整份官方 Typst 项目都能导入运行。
