import { useEffect, useEffectEvent, useRef, useState } from 'react'

let apiPromise

function loadApi() {
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const timeout = setTimeout(() => fail(), 15_000)
    function fail() {
      clearTimeout(timeout)
      script.remove()
      apiPromise = null
      reject(new Error('Spotify player could not load. Close the player and try again.'))
    }
    window.onSpotifyIframeApiReady = api => {
      clearTimeout(timeout)
      resolve(api)
    }
    script.src = 'https://open.spotify.com/embed/iframe-api/v1'
    script.onerror = fail
    document.head.append(script)
  })
  return apiPromise
}

export default function SpotifyPlayer({ request, onPlayback, onClose }) {
  const hostRef = useRef(null)
  const initialTrackRef = useRef(request.track)
  const handledRef = useRef(null)
  const loadedTrackRef = useRef(request.track.id)
  const [controller, setController] = useState(null)
  const [error, setError] = useState('')
  const reportPlayback = useEffectEvent(value => onPlayback(value))

  useEffect(() => {
    let active = true
    let embed
    const host = hostRef.current
    const element = document.createElement('div')
    host.append(element)
    const timeout = setTimeout(() => {
      if (active) setError('Spotify player did not become ready. Close it and try again.')
    }, 20_000)
    loadApi().then(api => {
      if (!active) return
      api.createController(element, {
        uri: `spotify:track:${initialTrackRef.current.id}`,
        width: '100%',
        height: 80,
      }, created => {
        if (!active) { created.destroy(); return }
        embed = created
        created.addListener('ready', () => {
          if (!active) return
          clearTimeout(timeout)
          setError('')
          setController(created)
        })
        created.addListener('playback_update', event => {
          if (active) reportPlayback({
            trackId: event.data.playingURI?.split(':').at(-1) || loadedTrackRef.current,
            paused: event.data.isPaused,
          })
        })
      })
    }).catch(cause => {
      if (active) {
        clearTimeout(timeout)
        setError(cause.message)
      }
    })
    return () => {
      active = false
      clearTimeout(timeout)
      embed?.destroy()
      host.replaceChildren()
    }
  }, [])

  useEffect(() => {
    if (!controller || handledRef.current === request) return
    const previous = handledRef.current
    handledRef.current = request
    let active = true
    Promise.resolve().then(() => {
      if (!active) return
      if (loadedTrackRef.current !== request.track.id) {
        loadedTrackRef.current = request.track.id
        controller.loadEntity(`spotify:track:${request.track.id}`)
        controller.play()
      } else if (previous) {
        controller.togglePlay()
      } else {
        controller.play()
      }
    }).catch(cause => {
      if (active) setError(`Spotify playback failed: ${cause.message}`)
    })
    return () => { active = false }
  }, [controller, request])

  return (
    <section className="mini-player" aria-label="Spotify player">
      <div className="mini-player-head">
        <span>{request.track.title}</span>
        <button type="button" onClick={onClose} aria-label="Close Spotify player">Close</button>
      </div>
      <div ref={hostRef} className="mini-player-embed" />
      <p role="status">{error || (controller
        ? 'No audio? Tap Play in the Spotify player. Previews may be limited.'
        : 'Loading Spotify player…')}</p>
    </section>
  )
}
