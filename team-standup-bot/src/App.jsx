import { useState, useEffect, useRef } from 'react'

// ============================================================
// 飞书 Webhook 推送接口（预留）
// 使用方式：
// 1. 在飞书群中创建自定义机器人，复制 Webhook URL
// 2. 将 URL 填入下方 FEISHU_WEBHOOK_URL
// 3. 取消注释 sendToFeishu 函数调用即可启用
// ============================================================
// const FEISHU_WEBHOOK_URL = 'https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxx'
//
// async function sendToFeishu(markdown) {
//   try {
//     const response = await fetch(FEISHU_WEBHOOK_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         msg_type: 'markdown',
//         content: { text: markdown }
//       })
//     })
//     return response.ok
//   } catch (err) {
//     console.error('飞书推送失败:', err)
//     return false
//   }
// }
// ============================================================

function formatDate(isoString) {
  const d = new Date(isoString)
  return d.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function generateSummary(yesterday, today, blockers) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][now.getDay()]

  let md = `# 📋 站会记录 — ${dateStr} (${weekday})\n\n`

  md += `## ✅ 昨天完成\n`
  if (yesterday.trim()) {
    yesterday.trim().split('\n').forEach(line => {
      md += `- ${line.trim()}\n`
    })
  } else {
    md += `- （无）\n`
  }

  md += `\n## 🎯 今日计划\n`
  if (today.trim()) {
    today.trim().split('\n').forEach(line => {
      md += `- ${line.trim()}\n`
    })
  } else {
    md += `- （无）\n`
  }

  md += `\n## 🚧 遇到阻塞\n`
  if (blockers.trim()) {
    blockers.trim().split('\n').forEach(line => {
      md += `- ${line.trim()}\n`
    })
  } else {
    md += `- （无阻塞）\n`
  }

  md += `\n---\n> 🤖 由 Team Standup Bot 自动生成\n`
  return md
}

function HistoryItem({ item, onRestore }) {
  return (
    <div className="border border-[#2a2a30] rounded-lg p-4 bg-[#13131a] hover:border-[#3a3a44] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#71717a]">{formatDate(item.createdAt)}</span>
        <button
          onClick={() => onRestore(item)}
          className="text-xs text-[#a1a1aa] hover:text-white transition-colors px-2 py-1 rounded border border-[#2a2a30] hover:border-[#4a4a54] bg-[#1c1c24]"
        >
          恢复
        </button>
      </div>
      <div className="space-y-1">
        {item.yesterday && (
          <div>
            <div className="text-[10px] text-[#52525b] uppercase tracking-wide mb-1">昨天</div>
            <div className="text-sm text-[#a1a1aa] whitespace-pre-wrap">{item.yesterday}</div>
          </div>
        )}
        {item.today && (
          <div className="mt-2">
            <div className="text-[10px] text-[#52525b] uppercase tracking-wide mb-1">今天</div>
            <div className="text-sm text-[#a1a1aa] whitespace-pre-wrap">{item.today}</div>
          </div>
        )}
        {item.blockers && (
          <div className="mt-2">
            <div className="text-[10px] text-[#52525b] uppercase tracking-wide mb-1">阻塞</div>
            <div className="text-sm text-[#a1a1aa] whitespace-pre-wrap">{item.blockers}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [yesterday, setYesterday] = useState('')
  const [today, setToday] = useState('')
  const [blockers, setBlockers] = useState('')
  const [summary, setSummary] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const yesterdayRef = useRef(null)
  const todayRef = useRef(null)
  const blockersRef = useRef(null)

  // Auto-resize textarea
  function autoResize(el) {
    if (el) {
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('standup-history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('standup-history', JSON.stringify(history))
  }, [history])

  function handleSubmit(e) {
    e.preventDefault()
    if (!yesterday.trim() && !today.trim() && !blockers.trim()) return

    const md = generateSummary(yesterday, today, blockers)
    setSummary(md)
    setSubmitted(true)

    const entry = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      yesterday,
      today,
      blockers,
      summary: md,
    }
    setHistory(prev => [entry, ...prev].slice(0, 50))
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = summary
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleReset() {
    setYesterday('')
    setToday('')
    setBlockers('')
    setSummary('')
    setSubmitted(false)
    if (yesterdayRef.current) { yesterdayRef.current.style.height = 'auto' }
    if (todayRef.current) { todayRef.current.style.height = 'auto' }
    if (blockersRef.current) { todayRef.current.style.height = 'auto' }
  }

  function handleRestore(item) {
    setYesterday(item.yesterday)
    setToday(item.today)
    setBlockers(item.blockers)
    setSummary('')
    setSubmitted(false)
    setShowHistory(false)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1e1e26] bg-[#0d0d0f] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#5e6ad2] to-[#9b8cf2] flex items-center justify-center text-xs font-bold">
              S
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Team Standup Bot</h1>
              <p className="text-[10px] text-[#52525b]">异步站会 · 记录你的工作</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(h => !h)}
            className="text-xs text-[#71717a] hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#2a2a30] hover:border-[#3a3a44] bg-[#13131a]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            历史 {history.length > 0 && `(${history.length})`}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {/* History Panel */}
        {showHistory && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[#a1a1aa]">历史记录</h2>
              <button
                onClick={() => setHistory([])}
                className="text-xs text-[#52525b] hover:text-red-400 transition-colors"
              >
                清空历史
              </button>
            </div>
            {history.length === 0 ? (
              <div className="text-sm text-[#3f3f46] text-center py-8 border border-dashed border-[#27272a] rounded-lg">
                暂无历史记录
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {history.map(item => (
                  <HistoryItem key={item.id} item={item} onRestore={handleRestore} />
                ))}
              </div>
            )}
          </div>
        )}

        {!submitted ? (
          /* Input Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Yesterday */}
            <div>
              <label className="block text-xs font-medium text-[#71717a] mb-2 uppercase tracking-wider">
                <span className="text-[#22c55e] mr-1">✓</span>
                昨天做了什么
              </label>
              <textarea
                ref={yesterdayRef}
                value={yesterday}
                onChange={e => {
                  setYesterday(e.target.value)
                  autoResize(e.target)
                }}
                onInput={e => autoResize(e.target)}
                placeholder="输入昨天完成的工作，每行一条..."
                className="w-full bg-[#13131a] border border-[#2a2a30] rounded-lg px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#5e6ad2] transition-colors min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Today */}
            <div>
              <label className="block text-xs font-medium text-[#71717a] mb-2 uppercase tracking-wider">
                <span className="text-[#3b82f6] mr-1">→</span>
                今天计划做什么
              </label>
              <textarea
                ref={todayRef}
                value={today}
                onChange={e => {
                  setToday(e.target.value)
                  autoResize(e.target)
                }}
                onInput={e => autoResize(e.target)}
                placeholder="输入今天的计划，每行一条..."
                className="w-full bg-[#13131a] border border-[#2a2a30] rounded-lg px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#5e6ad2] transition-colors min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Blockers */}
            <div>
              <label className="block text-xs font-medium text-[#71717a] mb-2 uppercase tracking-wider">
                <span className="text-[#ef4444] mr-1">!</span>
                遇到什么阻塞
              </label>
              <textarea
                ref={blockersRef}
                value={blockers}
                onChange={e => {
                  setBlockers(e.target.value)
                  autoResize(e.target)
                }}
                onInput={e => autoResize(e.target)}
                placeholder="输入遇到的阻碍（没有则留空）..."
                className="w-full bg-[#13131a] border border-[#2a2a30] rounded-lg px-4 py-3 text-sm text-white placeholder-[#3f3f46] focus:outline-none focus:border-[#5e6ad2] transition-colors min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={!yesterday.trim() && !today.trim() && !blockers.trim()}
                className="px-5 py-2.5 bg-[#5e6ad2] hover:bg-[#4f5ab8] disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
                生成站会摘要
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 text-sm text-[#71717a] hover:text-white transition-colors rounded-lg border border-[#2a2a30] hover:border-[#3a3a44] bg-[#13131a]"
              >
                重置
              </button>
            </div>
          </form>
        ) : (
          /* Summary Output */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[#a1a1aa]">📋 站会摘要</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 bg-[#13131a] border border-[#2a2a30] hover:border-[#4a4a54] text-[#a1a1aa] hover:text-white"
                >
                  {copied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      已复制
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                      </svg>
                      复制 Markdown
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs text-[#71717a] hover:text-white transition-colors rounded-md border border-[#2a2a30] hover:border-[#3a3a44] bg-[#13131a]"
                >
                  新建
                </button>
              </div>
            </div>

            {/* Feishu push hint */}
            <div className="mb-3 flex items-center gap-2 text-[10px] text-[#3f3f46]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              如需推送到飞书群，请取消 App.jsx 中的飞书 Webhook 代码注释
            </div>

            <div className="bg-[#13131a] border border-[#2a2a30] rounded-xl overflow-hidden">
              {/* Preview */}
              <div className="px-5 py-4 border-b border-[#1e1e26]">
                <div className="text-xs text-[#52525b] mb-3">预览</div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-[#d4d4d8]">
                  {summary}
                </div>
              </div>

              {/* Raw Markdown */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-[#52525b]">Markdown 源码</div>
                </div>
                <pre className="text-xs text-[#71717a] whitespace-pre-wrap break-all bg-[#0d0d0f] rounded-lg p-3 border border-[#1e1e26] font-mono max-h-60 overflow-auto">
                  {summary}
                </pre>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="bg-[#13131a] border border-[#1e1e26] rounded-lg px-4 py-3 text-center">
                <div className="text-lg font-semibold text-[#22c55e]">{yesterday.trim() ? yesterday.trim().split('\n').length : 0}</div>
                <div className="text-[10px] text-[#52525b] uppercase tracking-wide">昨日完成</div>
              </div>
              <div className="bg-[#13131a] border border-[#1e1e26] rounded-lg px-4 py-3 text-center">
                <div className="text-lg font-semibold text-[#3b82f6]">{today.trim() ? today.trim().split('\n').length : 0}</div>
                <div className="text-[10px] text-[#52525b] uppercase tracking-wide">今日计划</div>
              </div>
              <div className="bg-[#13131a] border border-[#1e1e26] rounded-lg px-4 py-3 text-center">
                <div className="text-lg font-semibold text-[#ef4444]">{blockers.trim() ? blockers.trim().split('\n').length : 0}</div>
                <div className="text-[10px] text-[#52525b] uppercase tracking-wide">阻塞项</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e1e26] mt-auto">
        <div className="max-w-3xl mx-auto px-6 py-4 text-center text-[10px] text-[#3f3f46]">
          Team Standup Bot · 异步站会 · localStorage 本地存储
        </div>
      </footer>
    </div>
  )
}
