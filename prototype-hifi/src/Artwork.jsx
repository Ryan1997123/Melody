import { useEffect, useState } from 'react'
import coverAtlas from './assets/Cover.svg'

const coverRequests = new Map()
const tilePositions = [81, 145, 209, 273, 337, 401, 465, 529]

function spotifyCover(trackId) {
  if (!coverRequests.has(trackId)) {
    const request = fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${trackId}`)}`)
      .then(response => {
        if (!response.ok) throw new Error(`Spotify artwork request failed (${response.status}).`)
        return response.json()
      })
      .then(data => data.thumbnail_url)
    coverRequests.set(trackId, request)
  }
  return coverRequests.get(trackId)
}

export default function Artwork({ track, className, style }) {
  const [resolvedImage, setResolvedImage] = useState(null)
  const source = resolvedImage?.trackId === track.id ? resolvedImage.url : track.image || ''

  useEffect(() => {
    let active = true
    if (!track.image) {
      spotifyCover(track.id)
        .then(image => { if (active) setResolvedImage({ trackId: track.id, url: image }) })
        .catch(() => { if (active) setResolvedImage({ trackId: track.id, url: '' }) })
    }
    return () => { active = false }
  }, [track.id, track.image])

  const size = Number.parseFloat(style?.['--sz']) || 52
  const tileX = tilePositions[Array.from(track.id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % tilePositions.length]
  const scale = size / 52
  const artStyle = {
    ...style,
    backgroundImage: source ? 'none' : `url("${coverAtlas}")`,
    backgroundPosition: source ? undefined : `-${tileX * scale}px -${17 * scale}px`,
    backgroundSize: source ? undefined : `${598 * scale}px ${86 * scale}px`,
    backgroundRepeat: 'no-repeat',
  }

  return (
    <span className={className} style={artStyle} role="img" aria-label={`${track.title} album artwork`}>
      {source && <img src={source} alt="" loading="lazy" onError={() => setResolvedImage({ trackId: track.id, url: '' })} />}
    </span>
  )
}
