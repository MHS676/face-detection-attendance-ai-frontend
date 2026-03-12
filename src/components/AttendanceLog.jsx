import { useState, useEffect, useCallback } from 'react'
import * as api from '../api'

export default function AttendanceLog() {
  const [logs, setLogs] = useState([])
  const [summary, setSummary] = useState({ currently_in: [], currently_out: [], total_in: 0, total_out: 0 })
  const [filter, setFilter] = useState({ person: '', direction: '' })
  const [tab, setTab] = useState('summary') // 'summary' | 'log'

  const loadLogs = useCallback(async () => {
    try {
      setLogs(await api.fetchAttendance({ ...filter, limit: 50 }))
    } catch (e) {
      console.error('attendance:', e)
    }
  }, [filter])

  const loadSummary = useCallback(async () => {
    try {
      setSummary(await api.fetchAttendanceSummary())
    } catch (e) {
      console.error('attendance summary:', e)
    }
  }, [])

  useEffect(() => {
    loadLogs()
    loadSummary()
    const t1 = setInterval(loadLogs, 5000)
    const t2 = setInterval(loadSummary, 5000)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [loadLogs, loadSummary])

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <span className="text-sm font-bold">📊 Attendance</span>
        <div className="flex gap-1">
          <button
            onClick={() => setTab('summary')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              tab === 'summary' ? 'bg-blue-500 text-white' : 'border border-gray-600 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setTab('log')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              tab === 'log' ? 'bg-blue-500 text-white' : 'border border-gray-600 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Full Log
          </button>
        </div>
      </div>

      {/* Summary Tab */}
      {tab === 'summary' && (
        <div className="p-4 space-y-4">
          {/* Currently Inside */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Currently Inside ({summary.total_in})
            </h4>
            {summary.currently_in.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No one detected inside</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {summary.currently_in.map((p, i) => (
                  <div key={i} className="bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                    <span className="text-sm font-semibold text-green-400">{p.name}</span>
                    <span className="text-[10px] text-gray-500 block">
                      {p.last_seen ? new Date(p.last_seen).toLocaleTimeString('en-US', { hour12: false }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Currently Outside / Left */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Left Today ({summary.total_out})
            </h4>
            {summary.currently_out.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No one has left yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {summary.currently_out.map((p, i) => (
                  <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    <span className="text-sm font-semibold text-red-400">{p.name}</span>
                    <span className="text-[10px] text-gray-500 block">
                      {p.last_seen ? new Date(p.last_seen).toLocaleTimeString('en-US', { hour12: false }) : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Log Tab */}
      {tab === 'log' && (
        <div>
          {/* Filters */}
          <div className="px-4 py-2 border-b border-gray-700/50 flex gap-2 items-center">
            <input
              type="text"
              placeholder="Filter by name…"
              value={filter.person}
              onChange={(e) => setFilter({ ...filter, person: e.target.value })}
              className="bg-gray-950 border border-gray-700 rounded-md px-2 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 w-40"
            />
            <select
              value={filter.direction}
              onChange={(e) => setFilter({ ...filter, direction: e.target.value })}
              className="bg-gray-950 border border-gray-700 rounded-md px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="in">IN only</option>
              <option value="out">OUT only</option>
            </select>
          </div>

          {/* Table */}
          <div className="max-h-[350px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="sticky top-0 bg-gray-800">
                  {['Time', 'Person', 'Direction', 'Camera', 'Tracker', 'Confidence'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wider text-gray-500 border-b border-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 text-sm">
                      No attendance records yet
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const time = log.timestamp
                      ? new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })
                      : ''
                    return (
                      <tr key={log.id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-2 text-sm font-mono border-b border-gray-700/50">
                          {time}
                        </td>
                        <td className="px-4 py-2 text-sm font-semibold border-b border-gray-700/50">
                          {log.person_name || 'Unknown'}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-700/50">
                          <span
                            className={`font-bold text-sm ${
                              log.direction === 'in' ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {log.direction === 'in' ? '↑ IN' : '↓ OUT'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700/50">
                          {log.camera_channel}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-700/50">
                          <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full text-[11px] font-bold font-mono">
                            #{log.tracker_id}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm border-b border-gray-700/50">
                          {log.confidence ? `${((1 - log.confidence) * 100).toFixed(0)}%` : '—'}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
