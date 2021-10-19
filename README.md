# Template-based-Generator-Template

TGT 是一个基于**模**板的文本**生**成器的**模**板，模生模，凤生凤，老鼠的儿子会打洞。

## 用处

天生我材必有用，模板生成更有用，本项目主要用于支持以下几种场景：

- 整活小作文
  - 模板可以指定需要保留原文中的哪些部分，挖空哪些部分，从而达到最大的模因性。
  - （神经网络写八股整活小作文受控程度应该很难比模板更好，就算更好，写出来也跟模板写的差不多。）
- 巴别塔图书馆

## 模板

生成器部分类似 [google/zx](https://github.com/google/zx)，可以用 js 写模板脚本，预注入类似[共产中文生成器](https://github.com/linonetwo/communism-report-generator/blob/0bfbf70829a02b650fb547933b4939f1ba6d85e3/%E6%8A%A5%E5%91%8A%E7%89%87%E6%AE%B5.ts#L6)里那样的全局函数和模板字符串标签，并通过 JSON 文件来保存同义词列表。

生成器打包成 npm 包后，可以在前端网页里列出模板脚本列表，打开一个脚本后可以填写参数然后生成文本。

### 模板语言设计

众所周知，模因分为不易改变的模因位点和不影响模因识别的随意区域，而且模因位点的序顺并不重要。

基于这两点我们的模板需要能快速录入作为模因位点的文本片段，并允许标注位点和顺序信息，也就是

1. 在哪能插入用户输入的参数和随机选取的同义词、插入语等
2. 在哪能把它剪切成更细碎的能来回打乱的片段

但是依然要能描述模因位点之间的潜在关系，不能把完全无关的两句话凑到一起。这在游戏行业就是拖表，而表做到字词粒度的多维潜在关系就成了神经网络，而我们不能做得这么复杂，但是也不能简单到一行或一个自然段，所以只能拍脑子想一个折中的粒度。

1. 用 Markdown 标题表示树状的 JSON 层级，让用户用简单的标记语言写出树状数据
2. 文本部分用一次换行隔开的文本行，每一行是一句随机素材，需要自带标点符号。用两次换行隔开的文本段落，每一段都将随机抽取出一两句内容贡献给文章。

这样能通过树状数据结构保证用户可以精确引用文案之间的相关性，~~在下方的图灵完备的脚本语言里~~在文档最上方的大纲区域里使用这些相关性比较轻松地凑出内容比较可控的文章。

然后文本内可以用`{{变量}}`语法来插入变量，这是模板语言对生成内容的基本控制能力。

### 标题

标题需要符合 Markdown 规范，在 `#` 后面加一个空格来表示标题。

`# ` 是大标题，作为生成器名字使用，最好和文件名一致，不过不一致也没事，以标题为准。

`## ` 等是二到四级标题，作为管理模板资源的树状结构来使用。例如：

```md
## 做得好的

### 项目·起

在项目发展早期
```

会形成

```json
{
  "做得好的": {
    "项目·起": ["在项目发展早期"]
  }
}
```

这样的树状结构。

### 模板文本

文本部分同样遵守 Markdown 规范，用一次换行隔开的文本行，每一行是一句随机素材，需要自带标点符号。
在常用的 Markdown 环境里，像这样只用一次换行隔开的文本，在实际展示时会被拼接到一起，变成同一段：

```md
像这样只用一次换行隔开的文本，
在实际展示时会被拼接到一起。
```

↓

```md
像这样只用一次换行隔开的文本，在实际展示时会被拼接到一起。
```

这些只用一次换行隔开的文本，将视为在一个自然段内。一个自然段内的文本会被程序认为是可以随机抽取的文本，不会同时出现在文中。

而用两次换行隔开的文本段落，将各自成为自然段。每一自然段都将随机抽取出一两句内容贡献给文章。自然段之间的顺序在生成时会保持住，这样可以写出比较有逻辑性的文案。

### 大纲

在大标题和第一个二级标题之间，是想实际生成的文本的大纲，可以使用中文冒号来使用树里深层级的内容：

```md
# 360 评估生成器

做得好的：项目·起

## 做得好的

### 项目·起

xxx
```

将会在文章中生成 `xxx`。

通过调整大纲，可以快速调整文本生成的顺序。

### 模板示例

```md
# 360 评估生成器

做得好的：项目·起
做得好的：项目·承
做得好的：项目·转
做得好的：项目·合

## 做得好的

### 项目·起

在项目发展早期，在没有明确安排和收益的情况下，{{这人}}就抱着试试看的心态做了这个项目，
记得有个双月，组内的需求早就已经排满，但是{{这人}}还是接手了这个{{叫啥项目的}}项目，
在刚开始没有{{叫啥项目的}}的时候，{{这人}}洞察到受众的需求一直没有被满足，
有次在讨论{{叫啥项目的}}的时候，{{这人}}主动请缨，
{{叫啥项目的}}一直是个被公认比较棘手的问题，

### 项目·承

{{这人}}在出色完成本职工作的同时，经常能基于个人成长和业务发展来定目标，
面对{{叫啥项目的}}时，{{这人}}对用户体验的追求到极致，

对于团队来说有的人刚接手时间短，基础不够，任务很重。但是我们把要求放在这儿，
当时这个工作是很困难的，{{这人}}克服阻碍，每天到前线，亲自站在用户的角度看问题，

### 项目·转

{{叫啥项目的}}需要解决的问题在业界属于一种老大难的问题，也是衡量能不能出成果的关键指标，
{{这人}}是负责与我们对接的{{叫啥项目的}}的同学，从{{叫啥项目的}}这个项目一开始就展现了十分良好的职业素养，

就像一鸣曾强调的那样：「不要把业务当作领地，要站上一个台阶思考问题，内部竞争的上限是乐于分享、乐于帮助，下限是要公平竞争」，{{这人}}在{{叫啥项目的}}项目上体现地是分明显，
即使在团队内，一开始对{{叫啥项目的}}的前景并不是完全看好的，甚至有同学直言这是一个重复造轮子的项目，但是{{这人}}有自己独到的看法，
在早期双月 OKR 中，这{{叫啥项目的}}一直是未能被很好解决的问题，大家对这个项目并不是完全持乐观的态度，

### 项目·合

一鸣曾提到：「对 HR 来说，在可以穷尽的比重里，找到最好的人才，而不是说在招聘网站上看到一个简历，看起来基本符合我们要求的就招聘。」在{{这人}}的工作中，恰好践行了这一原则。
一鸣曾提到：「我们要找到 Best of Best，人力资源在高标准上还是很有挑战的。既然我们招这个领域的人，我们应该把所有这个领域的人都挑出来，都排列一遍，对比下，找到最优的。」在{{这人}}的工作中，恰好践行了这一原则。

## 做得烂的

。。。略，抄不动了
```

## 技术实现方案

### 自然语言分析树

分析树（parse tree），也称具体语法树（concrete syntax tree）；[自然语言具体语法树（NLCST）](https://www.npmjs.com/package/nlcst-types)是一个有前途的项目，通过允许自然语言用[统一语法树（UNIST）](https://github.com/syntax-tree/unist)来描述，从而使用 JS 文本处理社区的一系列工具函数来加速文本处理。

本项目依靠自然语言具体语法树的力量，提供领先的社区共建友好的基于模板的文本生成解决方案。

### 自动多样性

基于模板生成的多样性来自于组件的多样性，我们通过同义词替换来增加组件多样性。

#### 编译期同义词标注

由于分词库、同义词库很大，而替换效果其实不是很明显，如果把词库打包进去 roi 会比较低，所以我们在编译期进行词性标注和同义词标注，用类似 sourcemap 的方式把这些信息带在模板里打包进来。
