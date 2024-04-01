export const seo = {
  title: 'smallbone - 个人博客',
  description:
    'smallbone 的个人博客，记录生活、技术、思考，分享知识、经验、感悟。',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://cali.so'
      : 'http://localhost:3000'
  ),
} as const
