// ============================================================
//  Personal Link-in-Bio 主页
//  修改说明：找到对应的 "TODO:" 注释，替换为你的真实信息即可
// ============================================================

import { useState } from 'react'

// TODO: 替换为你的头像图片地址（可以用网络图片或本地 public/ 目录下的文件）
const AVATAR_URL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Strom&backgroundColor=0a0a0a'
// TODO: 替换为你的名字
const NAME = 'Strom Fung'
// TODO: 替换为你的简介/标签语
const BIO = '全栈开发 · 开源爱好者 · 热爱折腾新技术'

// TODO: 替换/增删你的社交链接卡片
// label: 显示文字  url: 点击跳转地址  icon: emoji 图标  gradient: 卡片渐变色起点
const LINKS = [
  {
    label: 'GitHub',
    url: 'https://github.com/Strom-fung',
    icon: '💻',
    gradient: 'from-indigo-600 to-purple-600',
  },
  {
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/stromfung',
    icon: '🔗',
    gradient: 'from-blue-600 to-cyan-500',
  },
  {
    label: 'Email',
    url: 'mailto:strom@example.com',
    icon: '📧',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    label: '微信',
    url: 'weixin://',
    icon: '💬',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    label: '个人博客',
    url: 'https://blog.example.com',
    icon: '✍️',
    gradient: 'from-yellow-500 to-amber-600',
  },
  {
    label: 'Twitter / X',
    url: 'https://twitter.com/stromfung',
    icon: '🐦',
    gradient: 'from-sky-500 to-blue-500',
  },
  {
    label: '小红书',
    url: 'https://www.xiaohongshu.com/user/profile/stromfung',
    icon: '📕',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    label: 'Bilibili',
    url: 'https://space.bilibili.com/stromfung',
    icon: '📺',
    gradient: 'from-pink-500 to-purple-600',
  },
]

// 社交链接卡片组件
function LinkCard({ link, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
      style={{
        background: hovered
          ? `linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)`
          : `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 左侧渐变装饰条 */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-full bg-gradient-to-b ${link.gradient} transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 图标 */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 ${hovered ? 'scale-110' : ''}`}
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)`,
        }}
      >
        {link.icon}
      </div>

      {/* 文字 */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-200">
          {link.label}
        </span>
      </div>

      {/* 右侧箭头 */}
      <div
        className={`flex-shrink-0 text-white/30 group-hover:text-white/60 transition-all duration-300 ${hovered ? 'translate-x-1' : ''}`}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}

// 头像组件
function Avatar() {
  return (
    <div className="relative inline-block">
      {/* 外圈光晕 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-30 animate-pulse" />
      {/* 头像主体 */}
      <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-white/10 ring-offset-2 ring-offset-[#09090b]">
        <img
          src={AVATAR_URL}
          alt={NAME}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.parentElement.style.background = 'linear-gradient(135deg, #6366f1, #a855f7)'
          }}
        />
      </div>
      {/* 在线状态指示点 */}
      <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#09090b] shadow-lg shadow-green-500/50" />
    </div>
  )
}

// 底部 Footer
function Footer() {
  return (
    <footer className="mt-12 text-center text-xs text-white/20">
      <p>Built with ❤️ · {new Date().getFullYear()}</p>
    </footer>
  )
}

// 主应用
export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 顶部大光斑 */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-purple-600/8 blur-3xl" />
        {/* 底部光斑 */}
        <div className="absolute -bottom-40 right-20 w-80 h-80 rounded-full bg-pink-600/8 blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-600/8 blur-3xl" />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 w-full max-w-md">

        {/* 头像 + 名字 */}
        <div className="flex flex-col items-center mb-10 animate-fade-in-up">
          <Avatar />
          <h1 className="mt-5 text-2xl font-bold text-white tracking-tight">
            {NAME}
          </h1>
          <p className="mt-2 text-sm text-white/50 font-medium">
            {BIO}
          </p>

          {/* 社交小图标行（可选装饰） */}
          <div className="mt-4 flex items-center gap-3">
            {[
              { icon: '💻', href: LINKS[0]?.url || '#', label: 'GitHub' },
              { icon: '🔗', href: LINKS[1]?.url || '#', label: 'LinkedIn' },
              { icon: '📧', href: LINKS[2]?.url || '#', label: 'Email' },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
                title={item.label}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 链接卡片列表 */}
        <div className="flex flex-col gap-3">
          {LINKS.map((link, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${100 + index * 60}ms` }}
            >
              <LinkCard link={link} index={index} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
