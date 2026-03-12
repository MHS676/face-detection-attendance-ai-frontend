import { useState } from 'react'

export default function Sidebar({
  cameras,
  activeChannel,
  onSwitch,
  onConnect,
  onDisconnect,
  onAddCamera,
  onResetCounts,
  onRefresh,
}) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', channel: '', rtsp_url: '' })

  const handleSubmit = async () => {
    if (!form.name || !form.channel || !form.rtsp_url) {
      alert('Please fill all fields')
      return
    }
    const res = await onAddCamera(form)
    if (res.status === 'ok') {
      setForm({ name: '', channel: '', rtsp_url: '' })
      setShowForm(false)
    } else {
      alert('Error: ' + res.message)
    }
  }

  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800 p-4 space-y-6 overflow-y-auto hidden lg:block flex-shrink-0">
      {/* ---- Camera List ---- */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 mb-3 px-1">
          Camera Streams
        </h3>
        <div className="space-y-1.5">
          {cameras.map((cam) => (
            <div
              key={cam.channel}
              onClick={() => onSwitch(cam.channel)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all border
                ${
                  cam.channel === activeChannel
                    ? 'bg-gray-800 border-blue-500/60'
                    : 'border-transparent hover:bg-gray-800/50'
                }`}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  cam.connected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{cam.name}</div>
                <div className="text-[11px] text-gray-500">{cam.channel}</div>
              </div>
              {cam.connected ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDisconnect(cam.channel)
                  }}
                  className="px-2 py-1 rounded text-[11px] font-semibold bg-red-500/90 text-white hover:bg-red-600 transition-colors"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onConnect(cam.channel)
                  }}
                  className="px-2 py-1 rounded text-[11px] font-semibold bg-green-500/90 text-white hover:bg-green-600 transition-colors"
                >
                  Start
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---- Add Camera ---- */}
      <div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full py-2 px-4 rounded-lg border border-gray-700 text-gray-400 text-sm font-semibold hover:bg-gray-800 hover:text-gray-200 transition-colors"
        >
          + Add Camera
        </button>

        {showForm && (
          <div className="mt-3 bg-gray-800 rounded-lg p-3 space-y-2">
            <input
              type="text"
              placeholder="Camera Name (e.g. Front Gate)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-gray-950 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Channel ID (e.g. ch3)"
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value })}
              className="w-full bg-gray-950 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="RTSP URL"
              value={form.rtsp_url}
              onChange={(e) => setForm({ ...form, rtsp_url: e.target.value })}
              className="w-full bg-gray-950 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-2 px-4 rounded-md bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              Add Camera
            </button>
          </div>
        )}
      </div>

      {/* ---- Quick Actions ---- */}
      <div>
        <h3 className="text-[11px] font-bold uppercase tracking-[1.5px] text-gray-500 mb-3 px-1">
          Quick Actions
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={onResetCounts}
            className="w-full py-2 px-4 rounded-lg border border-gray-700 text-gray-400 text-sm font-semibold hover:bg-gray-800 hover:text-gray-200 transition-colors"
          >
            ↺ Reset Counts
          </button>
          <button
            onClick={onRefresh}
            className="w-full py-2 px-4 rounded-lg border border-gray-700 text-gray-400 text-sm font-semibold hover:bg-gray-800 hover:text-gray-200 transition-colors"
          >
            ⟳ Refresh All
          </button>
        </div>
      </div>
    </aside>
  )
}
