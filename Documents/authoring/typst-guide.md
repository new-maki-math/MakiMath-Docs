# Typst 语法与 MM 宏

MakiMath 在浏览器中用 Typlet 解析 Typst 语法，把已适配的正文节点映射为网页组件，数学公式由 Typlet 渲染。**这不是完整 Typst 编译器**：官方支持的语法或函数，不代表本站已经适配。后端只保存、返回源码，不解析宏、不生成正文 AST，也不执行 Typst。

可查阅 [Typst 数学参考](https://typst.app/docs/reference/math/)、[text 参数](https://typst.app/docs/reference/text/text/)及[table 参数](https://typst.app/docs/reference/model/table/)。这些是语言参考；本站支持范围以本页和前端诊断为准。以下示例按当前解析代码静态核对，本轮未执行渲染测试。

## 已适配的正文语法

| 内容 | 当前可用形式与边界 |
| --- | --- |
| 正文与标题 | 普通文本、段落、`= 标题`、`== 二级标题`、换行、注释、转义；网页标题标签最高 h6 |
| 强调与列表 | `*粗体*`、`_强调_`、无序/有序/术语列表；不是印刷版分页排版 |
| 公式 | `$x^2$` 行内；`$ x^2 $` 独立公式；实际公式能力取决于 Typlet，异常显示原片段和诊断 |
| 文本函数 | `text` 的已适配静态参数；`strong/emph/underline/strike/overline/sub/super/smallcaps/hide` 正文形式；`raw` 的静态字符串及可选 `block` 布尔参数 |
| 链接与高亮 | `link` 的静态 http/https/mailto 地址与可选正文；`highlight` 可选静态 `fill`；不支持任意脚本地址 |
| 间距与对齐 | 无参数 `linebreak()/parbreak()`；单个静态长度的 `h()/v()`；`align(left/center/right)[正文]` |
| 容器 | `box` 支持静态 `inset/radius/stroke/fill`；`block[正文]` 无额外布局参数 |
| 表格 | `table`、开头单次 `table.header`、`table.cell`、显式位置的 `table.hline/vline`，见下文 |

`text` / `#set text(...)` 支持静态字号、颜色、字体名称/数组、字重、字形、tracking、stretch、lang/region、dir、kerning、hyphenate、连字、数字样式、features 和 variations 的已适配值。不能使用变量、计算表达式或条件规则代替静态值；region 需要同时有 lang。字体是否可用、OpenType 特性是否生效仍取决于浏览器与字体。`#set text(...)` 作用于当前解析内容范围后续节点，不等同于完整 Typst 样式系统。

表格列数为 1–1000 的静态整数，或由支持的静态长度、`auto`、`fr` 构成的列宽数组。适配 `align/inset/fill/stroke`，部分可用列样式数组；cell 可用正整数 colspan/rowspan、静态 x/y 和已适配样式。占位网格最多 20000 格，线条不能穿过被合并单元格的内部，不支持自动定位 hline/vline。不能据此推断所有官方 table 参数均可用。

```typst
= 极限
设数列为 $a_n$。

#text(weight: "bold", fill: rgb("1f5aa0"))[关注定义中的量词。]

#table(columns: 2,
  table.header([符号], [含义]),
  [$a_n$], [数列的第 $n$ 项],
)
```

未适配的语法保留原片段并给出带行列号的诊断，语法错误或参数不符可能只影响该片段。当前不提供任意 `let`、函数定义、循环、条件、`import/include`、包加载、`show`、页面设置、文件读写或完整布局执行能力。旧 `defbox/thmbox/zt/makitag` 及课程适配器不在当前渲染链路中，需改用下列宏。

## 13 个 MM 宏

MM 宏是站点扩展，不是 Typst 官方函数。`[正文]` 表示内容块，`"文字"` 表示字符串，参数类型不能互换。

| 宏 | 用法 | 参数与边界 |
| --- | --- | --- |
| `mm-box-definition` | `#mm-box-definition[正文]` | 定义框；蓝色 |
| `mm-box-theorem` | `#mm-box-theorem[正文]` | 定理/公式框；紫色 |
| `mm-box-example` | `#mm-box-example[正文]` | 例题框；青色 |
| `mm-box-warn` | `#mm-box-warn[正文]` | 提醒/易错框；琥珀色 |
| `mm-box-conclusion` | `#mm-box-conclusion[正文]` | 结论/推论框；绿色 |
| `mm-box-frequency` | `#mm-box-frequency[正文]` | 真题考频框；橙色 |
| `mm-box-homework` | `#mm-box-homework[正文]` | 作业框；青绿色 |
| `mm-tag` | `#mm-tag(color: "blue")[重点]` | 一个行内内容块；color 可选，默认 blue |
| `mm-question` | `#mm-question(source: "来源", title: [标题], difficulty: 3, id: "q-1")[题干]` | 四个命名参数及一个正文块均可省略；difficulty 仅整数 1–5，source/id 为字符串，title 为行内内容块 |
| `mm-question-options` | `#mm-question-options(columns: 2, [选项一], [选项二])` | 至少一个内容块；columns 可省略或为整数 1、2、4；自动标记 A、B… |
| `mm-question-blank` | `#mm-question-blank(width: 4em)` | 不接受正文；width 可省略，默认 4em，须为支持的静态非负长度 |
| `mm-knowledge` | `#mm-knowledge(slug: "sequence-limit")` | 只接受 slug 字符串；读取当前有效知识点，详见[知识点引用](./knowledge-reference.md) |
| `mm-test` | `#mm-test` | 无括号和参数，显示 MM TEST，用于检查渲染入口 |

七种 box 均要求且仅接受一个正文内容块，可选参数只有 `title: [补充标题]`。标题只支持行内内容，不能写 `title: "字符串"`、任意颜色参数或位置标题参数。示例：

```typst
#mm-box-definition(title: [数列极限])[
  设数列为 $a_n$，定义正文写在这里。
]

#mm-tag(color: rgb("B22234"))[重点]

#mm-question(source: "练习", title: [选择题], difficulty: 2, id: "limit-01")[
  选择正确的结论。
  #mm-question-options(columns: 2, [$a_n$ 收敛], [$a_n$ 发散])
  补充说明：#mm-question-blank(width: 6em)
]
```

`mm-tag` 的预设颜色仅 `blue/cyan/green/orange/rose/purple`；也接受静态 `rgb(...)` / `color.rgb(...)`，例如 `rgb("B22234")`。不支持的颜色或参数会提示并回退默认蓝色；缺少正文则无法按标签渲染。标签正文、box 标题和题目标题不接受独立公式、块级表格等内容。

选项列数会在窄容器下降为两列或一列，不保证任何屏幕都固定四列。填空只画留白，题目宏不提供自动判分、答案提交或题库记录。
