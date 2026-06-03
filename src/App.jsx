import { useState } from 'react'
import './App.css'

// Mock AI summary generator
function generateSummary(text) {
  const lines = text.split('\n').filter(l => l.trim())
  const participants = []
  const mentions = []

  // Extract potential participants (lines starting with names followed by colon)
  lines.forEach(line => {
    const match = line.match(/^([A-Za-z\u4e00-\u9fa5]{2,6})[:：]/)
    if (match && !participants.includes(match[1])) {
      participants.push(match[1])
    }
  })

  // Simulated structured summary
  const mockSummary = `## 📋 会议摘要

### 🎯 核心要点
${lines.slice(0, 3).map((l, i) => `• ${l.replace(/^[^\s：:]+[:：]\s*/, '').slice(0, 80)}...`).join('\n') || '• 会议已记录，等待内容分析'}

### 📝 讨论事项
${lines.filter(l => l.includes('讨论') || l.includes('问题') || l.includes('议题')).map(l => `• ${l.slice(0, 100)}`).join('\n') || lines.slice(2, 6).map(l => `• ${l.slice(0, 100)}`).join('\n')}

### ✅ 待办事项
${lines.filter(l => l.includes('待办') || l.includes('TODO') || l.includes('任务') || l.includes('完成')).map(l => `• ${l.replace(/^[^\s：:]+[:：]\s*/, '')}`).join('\n') || '• [负责人] - [具体事项] - 截止日期'}

### ✅ 决策记录
${lines.filter(l => l.includes('决定') || l.includes('决策') || l.includes('通过') || l.includes('同意')).map(l => `• ${l.replace(/^[^\s：:]+[:：]\s*/, '')}`).join('\n') || '• [决策事项描述] - 决策依据'}

### 👥 参会人员
${participants.length > 0 ? participants.map(p => `- ${p}`).join('\n') : '- 待补充'}

---
*由 Meeting Summary Bot 生成 | ${new Date().toLocaleDateString('zh-CN')}*`

  return mockSummary
}

function App() {
  const [input, setInput] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!input.trim()) return
    setLoading(true)
    setSummary('')

    // Simulate API call delay
    await new Promise(r => setTimeout(r, 1200))

    const result = generateSummary(input)
    setSummary(result)
    setLoading(false)
  }

  const handleCopy = async () => {
    if (!summary) return
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
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

  const handleClear = () => {
    setInput('')
    setSummary('')
    setCopied(false)
  }

  const handleSample = () => {
    setInput(`会议主题：产品迭代计划评审会
时间：2025年6月3日 14:00-15:30
参会人：张三、李四、王五、赵六

张三：回顾上周工作进度，重点介绍了用户增长模块的A/B测试结果。

李四：目前转化率提升约12%，但留存率仍有波动，需要进一步分析。

王五：建议下周开始推进支付流程优化，相关需求文档已评审通过。

讨论：关于新功能的灰度发布策略，大家一致同意先从10%流量开始测试。

决定：支付模块优化优先级调高，本周五前完成开发评审。

待办：
- 李四：完成留存数据详细分析报告（周三前）
- 王五：支付流程UI设计方案优化（周四前）
- 赵六：协调后端资源排期（周三前）

张三：下次评审会定于下周一上午10点。`)
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-200">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#16181f]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl">📝</div>
            <div>
              <h1 className="text-lg font-bold text-white">会议纪要助手</h1>
              <p className="text-xs text-gray-500">Meeting Summary Bot</p>
            </div>
          </div>
          <button
            onClick={handleSample}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-300 transition"
          >
            示例文本
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Input Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-400">
              📄 粘贴会议记录
            </label>
            <span className="text-xs text-gray-600">
              {input.length} 字符
            </span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`粘贴会议记录文本...

示例格式：
会议主题：xxx
时间：xxx
参会人：xxx

张三：发言内容...
李四：发言内容...
...
`}
            className="w-full h-64 bg-[#1a1d27] border border-gray-700 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
          />
        </section>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleGenerate}
            disabled={!input.trim() || loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium transition shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                生成摘要中...
              </>
            ) : (
              <>
                ✨ 生成摘要
              </>
            )}
          </button>
          <button
            onClick={handleClear}
            disabled={!input && !summary}
            className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 text-gray-300 font-medium transition"
          >
            清空
          </button>
        </div>

        {/* Summary Output */}
        {summary && (
          <section className="border border-gray-700 rounded-2xl overflow-hidden bg-[#1a1d27]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 bg-[#16181f]">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400">📋</span>
                <h2 className="text-sm font-medium text-gray-300">结构化摘要</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 hidden sm:block">Markdown 格式</span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    copied
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      已复制
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      复制
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="p-5">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-mono" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
                {summary}
              </pre>
            </div>
          </section>
        )}

        {/* Features */}
        {!summary && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="p-5 rounded-xl bg-[#1a1d27] border border-gray-800">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">智能提取要点</h3>
              <p className="text-xs text-gray-600">自动识别会议核心议题和关键讨论点</p>
            </div>
            <div className="p-5 rounded-xl bg-[#1a1d27] border border-gray-800">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">待办与决策</h3>
              <p className="text-xs text-gray-600">清晰区分待办事项和会议决策</p>
            </div>
            <div className="p-5 rounded-xl bg-[#1a1d27] border border-gray-800">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">一键复制</h3>
              <p className="text-xs text-gray-600">生成 Markdown 格式，方便粘贴分享</p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-5 text-center">
          <p className="text-xs text-gray-600">
            Built with React + Vite + Tailwind CSS · Powered by AI
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
