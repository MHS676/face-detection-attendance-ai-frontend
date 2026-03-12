import { getVideoFeedUrl } from '../api'

export default function VideoFeed({ channel }) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden relative">
      <img
        src={getVideoFeedUrl(channel)}
        alt="Live Feed"
        className="w-full h-auto min-h-[400px] object-contain bg-black"
      />

      {/* Overlay tags */}
      <div className="absolute top-3 right-3 flex gap-1.5">
        <span className="bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-white">
          {channel.toUpperCase()}
        </span>
        <span className="bg-red-500 px-2.5 py-1 rounded-md text-[10px] font-bold text-white animate-pulse">
          ● LIVE
        </span>
      </div>
    </div>
  )
}
