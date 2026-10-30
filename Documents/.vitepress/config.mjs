import { defineConfig } from 'vitepress'

const pages = [
  ['guide/reading', '阅读与掌握记录', 'Reading & mastery'],
  ['authoring/workbench', '讲义工作台', 'Lecture workbench'],
  ['authoring/typst-guide', 'Typst 与 MM 宏', 'Typst & MM macros'],
  ['authoring/import-export', '导入与导出', 'Import & export'],
  ['guide/admin', '平台管理与审核', 'Administration & review'],
  ['guide/development', '开发与架构', 'Development & architecture'],
  ['deploy/self-host', '部署与升级', 'Deployment & upgrades'],
  ['api/overview', '接口约定', 'API conventions'],
  ['api/auth', '认证与会话', 'Authentication & sessions'],
  ['api/knowledge', '知识点 API', 'Knowledge API'],
  ['api/lectures', '讲义 API', 'Lecture API'],
  ['api/review', '审核与管理 API', 'Review & management API']
]

function navigation(english) {
  const prefix = english ? '/en/' : '/'
  return pages.map(([path, zh, en]) => ({ text: english ? en : zh, link: prefix + path }))
}

export default defineConfig({
  base: '/',
  title: 'MakiMath',
  description: 'MakiMath documentation',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: 'MakiMath 使用、开发与接口文档',
      themeConfig: {
        nav: [
          { text: '阅读', link: '/guide/reading' },
          { text: '编写', link: '/authoring/workbench' },
          { text: '管理', link: '/guide/admin' },
          { text: '开发与部署', link: '/guide/development' },
          { text: 'API', link: '/api/overview' }
        ],
        sidebar: navigation(false),
        docFooter: { prev: '上一篇', next: '下一篇' },
        outline: { label: '本页大纲' }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Reading', link: '/en/guide/reading' },
          { text: 'Authoring', link: '/en/authoring/workbench' },
          { text: 'Administration', link: '/en/guide/admin' },
          { text: 'Development & deployment', link: '/en/guide/development' },
          { text: 'API', link: '/en/api/overview' }
        ],
        sidebar: navigation(true),
        docFooter: { prev: 'Previous page', next: 'Next page' },
        outline: { label: 'On this page' }
      }
    }
  }
})
