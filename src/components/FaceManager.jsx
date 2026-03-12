import { useState, useEffect, useRef } from 'react'
import * as api from '../api'

export default function FaceManager() {
  const [faces, setFaces] = useState([])
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const fileRef = useRef()

  const loadFaces = async () => {
    try {
      setFaces(await api.fetchFaces())
    } catch (e) {
      console.error('faces:', e)
    }
  }

  useEffect(() => {
    loadFaces()
  }, [])

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }

  const handleRegister = async () => {
    if (!name.trim() || !file) {
      setMessage({ text: 'Please enter a name and select an image', type: 'error' })
      return
    }
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const res = await api.registerFace(name.trim(), file)
      if (res.status === 'ok') {
        setMessage({ text: `✓ "${res.name}" registered successfully!`, type: 'success' })
        setName('')
        setFile(null)
        setPreview(null)
        if (fileRef.current) fileRef.current.value = ''
        loadFaces()
      } else {
        setMessage({ text: `✗ ${res.message}`, type: 'error' })
      }
    } catch (e) {
      setMessage({ text: `✗ ${e.message}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, faceName) => {
    if (!confirm(`Delete face "${faceName}"?`)) return
    try {
      await api.deleteFace(id)
      loadFaces()
    } catch (e) {
      console.error('delete face:', e)
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <span className="text-sm font-bold">👤 Face Recognition Manager</span>
        <span className="text-[11px] text-gray-500">{faces.length} registered</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Register Form */}
        <div className="bg-gray-900 rounded-lg p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Register New Face
          </h4>

          <div className="flex gap-3 items-start">
            {/* Image preview or upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors flex-shrink-0 overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-2xl text-gray-500">📷</span>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Person's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-2 px-4 rounded-md bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing…' : '+ Register Face'}
              </button>
            </div>
          </div>

          {message.text && (
            <div
              className={`text-sm px-3 py-2 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        {/* Known Faces Grid */}
        {faces.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Known Faces
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {faces.map((f) => (
                <div
                  key={f.id}
                  className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 group"
                >
                  <div className="aspect-square bg-gray-950 flex items-center justify-center">
                    {f.thumbnail ? (
                      <img
                        src={`data:image/jpeg;base64,${f.thumbnail}`}
                        alt={f.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-gray-600">👤</span>
                    )}
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <span className="text-sm font-semibold truncate">{f.name}</span>
                    <button
                      onClick={() => handleDelete(f.id, f.name)}
                      className="text-red-400 hover:text-red-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
