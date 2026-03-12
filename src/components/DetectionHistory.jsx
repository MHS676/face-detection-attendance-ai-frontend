export default function DetectionHistory({ history, onRefresh }) {
  const getClassStyle = (cls) => {
    const lower = (cls || '').toLowerCase()
    if (lower.includes('person') || lower.includes('human'))
      return 'bg-blue-500/20 text-blue-400'
    if (lower.includes('car') || lower.includes('vehicle'))
      return 'bg-yellow-500/20 text-yellow-400'
    if (lower.includes('bike') || lower.includes('bicycle'))
      return 'bg-purple-500/20 text-purple-400'
    return 'bg-gray-500/20 text-gray-400'
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <span className="text-sm font-bold">📋 Recent Crossings</span>
        <button
          onClick={onRefresh}
          className="px-3 py-1 rounded-md border border-gray-600 text-gray-400 text-[11px] font-semibold hover:bg-gray-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="sticky top-0 bg-gray-800">
              {['Time', 'Tracker', 'Person', 'Object', 'Direction', 'Match'].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-700"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 text-gray-500 text-sm"
                >
                  No crossing events yet — people will appear when they cross the counting line
                </td>
              </tr>
            ) : (
              history.map((evt, i) => {
                const time = new Date(evt.timestamp).toLocaleTimeString(
                  'en-US',
                  { hour12: false }
                )
                const cls = evt.class || 'person'
                const personName = evt.person_name || 'Unknown'

                return (
                  <tr
                    key={evt.id || i}
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-sm font-mono border-b border-gray-700/50">
                      {time}
                    </td>
                    <td className="px-4 py-2.5 border-b border-gray-700/50">
                      <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full text-[11px] font-bold font-mono">
                        #{evt.tracker_id}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm font-semibold border-b border-gray-700/50">
                      <span className={personName === 'Unknown' ? 'text-gray-400 italic' : 'text-cyan-400'}>
                        {personName}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 border-b border-gray-700/50">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize ${getClassStyle(
                          cls
                        )}`}
                      >
                        {cls}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 border-b border-gray-700/50">
                      {evt.direction ? (
                        <span
                          className={`font-bold text-sm ${
                            evt.direction === 'in'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {evt.direction === 'in' ? '↑ IN' : '↓ OUT'}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-sm border-b border-gray-700/50">
                      {evt.confidence ? `${((1 - evt.confidence) * 100).toFixed(0)}%` : '—'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
