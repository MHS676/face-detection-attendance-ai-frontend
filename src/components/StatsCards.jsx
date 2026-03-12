const cards = [
  { key: 'in', label: 'Total In', color: 'text-green-500', sub: 'Objects entered' },
  { key: 'out', label: 'Total Out', color: 'text-red-500', sub: 'Objects exited' },
  { key: 'unique', label: 'Unique Objects', color: 'text-blue-500', sub: 'Tracked today' },
  { key: 'cameras', label: 'Active Cameras', color: 'text-yellow-500', sub: 'Connected' },
]

export default function StatsCards({ totalIn, totalOut, uniqueObjects, activeCameras }) {
  const values = {
    in: totalIn,
    out: totalOut,
    unique: uniqueObjects,
    cameras: activeCameras,
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.key}
          className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            {c.label}
          </div>
          <div className={`text-3xl font-extrabold font-mono ${c.color}`}>
            {values[c.key]}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">{c.sub}</div>
        </div>
      ))}
    </div>
  )
}
