import { useState, useEffect } from 'react'

export default function Header() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          🎯 CCTV Detection System
        </h1>
        <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider animate-pulse">
          ● LIVE
        </span>
      </div>

      <span className="text-sm text-gray-400 font-mono hidden sm:block">
        {now.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
        {'  '}
        {now.toLocaleTimeString('en-US', { hour12: false })}
      </span>
    </header>
  )
}
