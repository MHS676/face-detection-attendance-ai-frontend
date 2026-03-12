import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import VideoFeed from './components/VideoFeed'
import StatsCards from './components/StatsCards'
import CountPanel from './components/CountPanel'
import DetectionHistory from './components/DetectionHistory'
import FaceManager from './components/FaceManager'
import AttendanceLog from './components/AttendanceLog'
import * as api from './api'

function App() {
  const [cameras, setCameras] = useState([])
  const [activeChannel, setActiveChannel] = useState('ch1')
  const [counts, setCounts] = useState({ in: {}, out: {} })
  const [stats, setStats] = useState({ total_detections_today: 0 })
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('live') // 'live' | 'faces' | 'attendance'

  /* ---- Data fetchers ---- */

  const loadCameras = useCallback(async () => {
    try {
      setCameras(await api.fetchCameras())
    } catch (e) {
      console.error('cameras:', e)
    }
  }, [])

  const loadCounts = useCallback(async () => {
    try {
      setCounts(await api.fetchCounts(activeChannel))
    } catch (e) {
      console.error('counts:', e)
    }
  }, [activeChannel])

  const loadStats = useCallback(async () => {
    try {
      setStats(await api.fetchStats())
    } catch (e) {
      console.error('stats:', e)
    }
  }, [])

  const loadHistory = useCallback(async () => {
    try {
      setHistory(await api.fetchHistory(activeChannel))
    } catch (e) {
      console.error('history:', e)
    }
  }, [activeChannel])

  /* ---- Initial load + polling ---- */

  useEffect(() => {
    loadCameras()
    loadCounts()
    loadStats()
    loadHistory()
  }, [activeChannel, loadCameras, loadCounts, loadStats, loadHistory])

  useEffect(() => {
    const t1 = setInterval(loadCounts, 3000)
    const t2 = setInterval(loadStats, 3000)
    const t3 = setInterval(loadHistory, 5000)
    const t4 = setInterval(loadCameras, 10000)
    return () => {
      clearInterval(t1)
      clearInterval(t2)
      clearInterval(t3)
      clearInterval(t4)
    }
  }, [loadCounts, loadStats, loadHistory, loadCameras])

  /* ---- Actions ---- */

  const handleSwitch = (ch) => setActiveChannel(ch)

  const handleConnect = async (ch) => {
    await api.connectCamera(ch)
    await loadCameras()
    setActiveChannel(ch)
  }

  const handleDisconnect = async (ch) => {
    await api.disconnectCamera(ch)
    await loadCameras()
  }

  const handleAddCamera = async (data) => {
    const result = await api.addCamera(data)
    if (result.status === 'ok') {
      await loadCameras()
      setActiveChannel(data.channel)
    }
    return result
  }

  const handleResetCounts = async () => {
    await api.resetCounts(activeChannel)
    await loadCounts()
  }

  const refreshAll = () => {
    loadCameras()
    loadCounts()
    loadStats()
    loadHistory()
  }

  /* ---- Derived ---- */

  const connectedCount = cameras.filter((c) => c.connected).length
  const totalIn = Object.values(counts.in || {}).reduce((a, b) => a + b, 0)
  const totalOut = Object.values(counts.out || {}).reduce((a, b) => a + b, 0)

  /* ---- Render ---- */

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar
          cameras={cameras}
          activeChannel={activeChannel}
          onSwitch={handleSwitch}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onAddCamera={handleAddCamera}
          onResetCounts={handleResetCounts}
          onRefresh={refreshAll}
        />

        <main className="flex-1 p-5 space-y-5 overflow-auto">
          {/* Tab Navigation */}
          <div className="flex gap-2">
            {[
              { id: 'live', label: '🎥 Live View', },
              { id: 'faces', label: '👤 Face Manager', },
              { id: 'attendance', label: '📊 Attendance', },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === t.id
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Live View Tab */}
          {activeTab === 'live' && (
            <>
              <StatsCards
                totalIn={totalIn}
                totalOut={totalOut}
                uniqueObjects={stats.total_detections_today || 0}
                activeCameras={connectedCount}
              />

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
                <VideoFeed channel={activeChannel} />
                <CountPanel counts={counts} onReset={handleResetCounts} />
              </div>

              <DetectionHistory history={history} onRefresh={loadHistory} />
            </>
          )}

          {/* Face Manager Tab */}
          {activeTab === 'faces' && (
            <FaceManager />
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <AttendanceLog />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
