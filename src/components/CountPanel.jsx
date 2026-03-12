const CLASS_CONFIG = {
  person:     { icon: '👤', bg: 'bg-blue-500/20' },
  human:      { icon: '👤', bg: 'bg-blue-500/20' },
  people:     { icon: '👤', bg: 'bg-blue-500/20' },
  car:        { icon: '🚗', bg: 'bg-yellow-500/20' },
  vehicle:    { icon: '🚗', bg: 'bg-yellow-500/20' },
  truck:      { icon: '🚛', bg: 'bg-yellow-500/20' },
  bike:       { icon: '🚲', bg: 'bg-purple-500/20' },
  bicycle:    { icon: '🚲', bg: 'bg-purple-500/20' },
  motorcycle: { icon: '🏍️', bg: 'bg-purple-500/20' },
  bus:        { icon: '🚌', bg: 'bg-orange-500/20' },
  dog:        { icon: '🐕', bg: 'bg-green-500/20' },
  cat:        { icon: '🐈', bg: 'bg-pink-500/20' },
}

export default function CountPanel({ counts, onReset }) {
  const allClasses = [
    ...new Set([
      ...Object.keys(counts?.in || {}),
      ...Object.keys(counts?.out || {}),
    ]),
  ]

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <span className="text-sm font-bold">📊 Object Counts</span>
        <button
          onClick={onReset}
          className="px-3 py-1 rounded-md border border-gray-600 text-gray-400 text-[11px] font-semibold hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Count rows */}
      <div className="p-4 space-y-2 flex-1 overflow-y-auto">
        {allClasses.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            No detections yet.
            <br />
            Objects will appear here.
          </div>
        ) : (
          allClasses.map((cls) => {
            const cfg = CLASS_CONFIG[cls.toLowerCase()] || {
              icon: '📦',
              bg: 'bg-gray-500/20',
            }
            const inCount = counts.in?.[cls] || 0
            const outCount = counts.out?.[cls] || 0

            return (
              <div
                key={cls}
                className="flex items-center justify-between px-3 py-2.5 bg-gray-950 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-sm ${cfg.bg}`}
                  >
                    {cfg.icon}
                  </span>
                  {cls}
                </div>
                <div className="flex gap-3 font-mono text-sm font-bold">
                  <span className="text-green-500">IN: {inCount}</span>
                  <span className="text-red-500">OUT: {outCount}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
