import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/MakiMath-Docs/',
  title: 'MakiMath',
  description: 'Structured Mathematics Learning Platform',

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'MakiMath',
      description: '结构化数学讲义与学习平台',
      themeConfig: {
        nav: [
          { text: '指南', link: '/guide/getting-started' },
          { text: '讲义编写', link: '/authoring/workflow' },
          { text: '技术架构', link: '/architecture/overview' },
          { text: 'API 接口', link: '/api/overview' },
          { text: '部署运维', link: '/deploy/self-host' },
          { text: '社区贡献', link: '/contributing/guide' }
        ],
        sidebar: {
          '/guide/': [
            {
              text: '基础认知',
              items: [
                { text: '快速上手总览', link: '/guide/getting-started' },
                { text: '项目概述', link: '/guide/overview' }
              ]
            },
            {
              text: '面向开发者',
              items: [
                { text: '全栈开发快速上手', link: '/guide/dev-getting-started' }
              ]
            },
            {
              text: '面向编者',
              items: [
                { text: '编者入驻与快速上手', link: '/guide/editor-getting-started' }
              ]
            }
          ],
          '/authoring/': [
            {
              text: '讲义创作',
              items: [
                { text: '讲义编排规范与 DAG', link: '/authoring/workflow' },
                { text: 'Typst 数学排版指南', link: '/authoring/typst-guide' },
                { text: '编者工作台指南', link: '/authoring/workbench' }
              ]
            }
          ],
          '/architecture/': [
            {
              text: '系统架构',
              items: [
                { text: '系统架构总览', link: '/architecture/overview' },
                { text: '前端架构 (Vue 3 + WASM)', link: '/architecture/frontend' },
                { text: '后端架构 (Fastify + PG)', link: '/architecture/backend' },
                { text: '通信安全与数据保护', link: '/architecture/security' }
              ]
            }
          ],
          '/api/': [
            {
              text: 'API 接口参考',
              items: [
                { text: '接口概览与约定', link: '/api/overview' },
                { text: '认证与会话 API', link: '/api/auth' },
                { text: '课程与目录树 API', link: '/api/courses' },
                { text: '小节与讲义正文 API', link: '/api/sections' }
              ]
            }
          ],
          '/deploy/': [
            {
              text: '部署运维',
              items: [
                { text: '私有化部署指南', link: '/deploy/self-host' },
                { text: '环境变量参考', link: '/deploy/environment' },
                { text: 'Nginx 反向代理配置', link: '/deploy/nginx' }
              ]
            }
          ],
          '/contributing/': [
            {
              text: '开源社区',
              items: [
                { text: '贡献指南', link: '/contributing/guide' },
                { text: 'Git Commit 提交规范', link: '/contributing/git-rules' }
              ]
            }
          ]
        },
        docFooter: {
          prev: '上一篇',
          next: '下一篇'
        },
        outline: {
          label: '本页大纲'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'MakiMath',
      description: 'Structured Mathematics Learning Platform',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'Authoring', link: '/en/authoring/workflow' },
          { text: 'Architecture', link: '/en/architecture/overview' },
          { text: 'API', link: '/en/api/overview' },
          { text: 'Deploy', link: '/en/deploy/self-host' },
          { text: 'Contributing', link: '/en/contributing/guide' }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Overview',
              items: [
                { text: 'Quickstart Overview', link: '/en/guide/getting-started' },
                { text: 'Project Overview', link: '/en/guide/overview' }
              ]
            },
            {
              text: 'For Developers',
              items: [
                { text: 'Developer Quickstart', link: '/en/guide/dev-getting-started' }
              ]
            },
            {
              text: 'For Editors',
              items: [
                { text: 'Editor Quickstart', link: '/en/guide/editor-getting-started' }
              ]
            }
          ],
          '/en/authoring/': [
            {
              text: 'Content Authoring',
              items: [
                { text: 'Lecture Structure & DAG', link: '/en/authoring/workflow' },
                { text: 'Typst Math Guide', link: '/en/authoring/typst-guide' },
                { text: 'Editor Workbench', link: '/en/authoring/workbench' }
              ]
            }
          ],
          '/en/architecture/': [
            {
              text: 'Architecture',
              items: [
                { text: 'System Overview', link: '/en/architecture/overview' },
                { text: 'Frontend (Vue 3 + WASM)', link: '/en/architecture/frontend' },
                { text: 'Backend (Fastify + PG)', link: '/en/architecture/backend' },
                { text: 'Communication & Data Security', link: '/en/architecture/security' }
              ]
            }
          ],
          '/en/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'Overview & Conventions', link: '/en/api/overview' },
                { text: 'Auth & Session API', link: '/en/api/auth' },
                { text: 'Courses & Tree API', link: '/en/api/courses' },
                { text: 'Sections & Lecture Doc API', link: '/en/api/sections' }
              ]
            }
          ],
          '/en/deploy/': [
            {
              text: 'Deployment & Ops',
              items: [
                { text: 'Self-Hosting Guide', link: '/en/deploy/self-host' },
                { text: 'Environment Variables', link: '/en/deploy/environment' },
                { text: 'Nginx Setup', link: '/en/deploy/nginx' }
              ]
            }
          ],
          '/en/contributing/': [
            {
              text: 'Community',
              items: [
                { text: 'Contributing Guide', link: '/en/contributing/guide' },
                { text: 'Git Commit Rules', link: '/en/contributing/git-rules' }
              ]
            }
          ]
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        outline: {
          label: 'On this page'
        }
      }
    }
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/new-maki-math' }
    ]
  }
})
