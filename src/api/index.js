const API_BASE = ''  // Uses Vite proxy in dev — requests go to Flask on :5000

export async function fetchCameras() {
  const res = await fetch(`${API_BASE}/api/cameras`)
  return res.json()
}

export async function addCamera(data) {
  const res = await fetch(`${API_BASE}/api/cameras`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function connectCamera(channel) {
  const res = await fetch(`${API_BASE}/api/cameras/${channel}/connect`, {
    method: 'POST',
  })
  return res.json()
}

export async function disconnectCamera(channel) {
  const res = await fetch(`${API_BASE}/api/cameras/${channel}/disconnect`, {
    method: 'POST',
  })
  return res.json()
}

export async function fetchCounts(channel) {
  const res = await fetch(`${API_BASE}/api/counts/${channel}`)
  return res.json()
}

export async function resetCounts(channel) {
  const res = await fetch(`${API_BASE}/api/counts/${channel}/reset`, {
    method: 'POST',
  })
  return res.json()
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/api/stats`)
  return res.json()
}

export async function fetchHistory(channel, limit = 30) {
  const res = await fetch(
    `${API_BASE}/api/history?channel=${channel}&limit=${limit}`
  )
  return res.json()
}

export function getVideoFeedUrl(channel) {
  return `${API_BASE}/video_feed/${channel}`
}

// =============================================================================
// FACE MANAGEMENT
// =============================================================================

export async function fetchFaces() {
  const res = await fetch(`${API_BASE}/api/faces`)
  return res.json()
}

export async function registerFace(name, imageFile) {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('image', imageFile)
  const res = await fetch(`${API_BASE}/api/faces`, {
    method: 'POST',
    body: formData,
  })
  return res.json()
}

export async function deleteFace(faceId) {
  const res = await fetch(`${API_BASE}/api/faces/${faceId}`, {
    method: 'DELETE',
  })
  return res.json()
}

// =============================================================================
// ATTENDANCE
// =============================================================================

export async function fetchAttendance({ channel, person, direction, limit, date } = {}) {
  const params = new URLSearchParams()
  if (channel) params.set('channel', channel)
  if (person) params.set('person', person)
  if (direction) params.set('direction', direction)
  if (limit) params.set('limit', String(limit))
  if (date) params.set('date', date)
  const res = await fetch(`${API_BASE}/api/attendance?${params.toString()}`)
  return res.json()
}

export async function fetchAttendanceSummary() {
  const res = await fetch(`${API_BASE}/api/attendance/summary`)
  return res.json()
}
