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

export default function SpotifyPlayer({ request, onPlayback, onVisibility, onClose }) {
  const hostRef = useRef(null)
  const initialTrackRef = useRef(request.track)
  const handledRef = useRef(null)
  const loadedTrackRef = useRef(request.track.id)
  const pausedRef = useRef(true)
  const fallbackTimerRef = useRef(null)
  const [controller, setController] = useState(null)
  const [error, setError] = useState('')
  const reportPlayback = useEffectEvent(value => onPlayback(value))
  const showControls = useEffectEvent(visible => onVisibility(visible))
  const reportError = useEffectEvent(message => {
    setError(message)
    showControls(true)
  })

  useEffect(() => {
    let active = true
    let embed
    const host = hostRef.current
    const element = document.createElement('div')
    host.append(element)
    const timeout = setTimeout(() => {
      if (active) reportError('Spotify player did not become ready. Close it and try again.')
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
          if (!active) return
          const trackId = event.data.playingURI?.split(':').at(-1) || loadedTrackRef.current
          reportPlayback({ trackId, paused: event.data.isPaused })
          if (trackId !== loadedTrackRef.current) return
          pausedRef.current = event.data.isPaused
          if (!event.data.isPaused && !event.data.isBuffering) {
            clearTimeout(fallbackTimerRef.current)
            showControls(false)
          }
        })
      })
    }).catch(cause => {
      if (active) {
        clearTimeout(timeout)
        reportError(cause.message)
      }
    })
    return () => {
      active = false
      clearTimeout(timeout)
      clearTimeout(fallbackTimerRef.current)
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
      clearTimeout(fallbackTimerRef.current)
      const changingTrack = loadedTrackRef.current !== request.track.id
      if (changingTrack || !previous || pausedRef.current) {
        fallbackTimerRef.current = setTimeout(() => showControls(true), 3000)
      }
      if (changingTrack) {
        loadedTrackRef.current = request.track.id
        pausedRef.current = true
        controller.loadEntity(`spotify:track:${request.track.id}`)
        controller.play()
      } else if (previous) {
        controller.togglePlay()
      } else {
        controller.play()
      }
    }).catch(cause => {
      if (active) {
        clearTimeout(fallbackTimerRef.current)
        reportError(`Spotify playback failed: ${cause.message}`)
      }
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
