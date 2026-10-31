import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: 'MakiMath',
  description: 'MakiMath',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: '连接数学知识，让学习与创作相互启发。',
      themeConfig: {
        nav: [
          { text: '介绍', link: '/introduction' },
          { text: '对学习者', link: '/learners' },
          { text: '对创作者', link: '/creators' },
          { text: '对开发者', link: '/developers' },
          { text: '更新日志', link: '/changelog' }
        ],
        sidebar: {
          '/learners': [
            { text: '为什么我不需要登录？', link: '/learners' },
            {
              text: '页面介绍',
              items: [
                { text: '开始', link: '/learners/start' },
                { text: '知识库', link: '/learners/knowledge' },
                { text: '创意工坊', link: '/learners/workshop' },
                { text: '我的书架', link: '/learners/bookshelf' },
                { text: '课程讲义详情', link: '/learners/lecture-details' },
                { text: '阅读讲义', link: '/learners/reading' },
                { text: '讲义工作台', link: '/learners/workbench' }
              ]
            },
            { text: '如何发布我的讲义？', link: '/learners/publishing' }
          ],
          '/creators': [
            { text: '对比学习者有什么不同？', link: '/creators' },
            {
              text: '开始创作',
              items: [
                { text: '组织章节与小节', link: '/creators/structure' },
                { text: '编写正文与公式', link: '/creators/writing' },
                { text: '使用MM教学宏', link: '/creators/mm-macros' },
                { text: '引用知识库', link: '/creators/knowledge-references' },
                { text: '导入与导出', link: '/creators/import-export' },
                { text: '保存、版本与审核', link: '/creators/versions-review' },
                { text: '发布我的讲义', link: '/creators/publishing' }
              ]
            }
          ],
          '/changelog': [
            { text: 'v1.2.0-beta', link: '/changelog' },
            { text: 'v1.1.1-beta', link: '/changelog/v1.1.1-beta' },
            { text: 'v1.1.0-beta', link: '/changelog/v1.1.0-beta' },
            { text: 'v1.0.0-beta', link: '/changelog/v1.0.0-beta' }
          ]
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description: 'Connecting mathematical knowledge, inspiring learning and creation.',
      themeConfig: {
        nav: [
          { text: 'Introduction', link: '/en/introduction' },
          { text: 'For Learners', link: '/en/learners' },
          { text: 'For Creators', link: '/en/creators' },
          { text: 'For Developers', link: '/en/developers' },
          { text: 'Changelog', link: '/en/changelog' }
        ],
        sidebar: {
          '/en/learners': [
            { text: "Why don't I need to sign in?", link: '/en/learners' },
            {
              text: 'Page guides',
              items: [
                { text: 'Start', link: '/en/learners/start' },
                { text: 'Knowledge Library', link: '/en/learners/knowledge' },
                { text: 'Workshop', link: '/en/learners/workshop' },
                { text: 'My Bookshelf', link: '/en/learners/bookshelf' },
                { text: 'Course & Lecture Details', link: '/en/learners/lecture-details' },
                { text: 'Reading Lectures', link: '/en/learners/reading' },
                { text: 'Lecture Workbench', link: '/en/learners/workbench' }
              ]
            },
            { text: 'How do I publish my lecture?', link: '/en/learners/publishing' }
          ],
          '/en/creators': [
            { text: 'How is this different from learning?', link: '/en/creators' },
            {
              text: 'Start creating',
              items: [
                { text: 'Organizing Chapters & Sections', link: '/en/creators/structure' },
                { text: 'Writing Content & Formulas', link: '/en/creators/writing' },
                { text: 'Using MM Teaching Macros', link: '/en/creators/mm-macros' },
                { text: 'Referencing the Knowledge Library', link: '/en/creators/knowledge-references' },
                { text: 'Import & Export', link: '/en/creators/import-export' },
                { text: 'Saving, Versions & Review', link: '/en/creators/versions-review' },
                { text: 'Publishing My Lecture', link: '/en/creators/publishing' }
              ]
            }
          ],
          '/en/changelog': [
            { text: 'v1.2.0-beta', link: '/en/changelog' },
            { text: 'v1.1.1-beta', link: '/en/changelog/v1.1.1-beta' },
            { text: 'v1.1.0-beta', link: '/en/changelog/v1.1.0-beta' },
            { text: 'v1.0.0-beta', link: '/en/changelog/v1.0.0-beta' }
          ]
        }
      }
    }
  },
  themeConfig: {
    sidebar: false
  }
})
