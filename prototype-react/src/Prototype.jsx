import { Fragment, useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import parse, { attributesToProps } from 'html-react-parser'
import { FRAMES, byId, TABS, SW, AVO, validScreen, initState, createScreenMarkup } from './screens.js'

function routeId() {
  const id = location.hash.replace(/^#\/?/, '')
  return validScreen(id) ? id : 'signin'
}

function savedRoute(id) {
  const saved = history.state?.sleevePrototypeReact
  return saved && Array.isArray(saved.stack) && saved.stack.length &&
    saved.stack.every(validScreen) && saved.stack.at(-1) === id &&
    Number.isInteger(saved.index) && saved.index >= 0 && saved.index < saved.stack.length
    ? saved : null
}

function initialRoute() {
  const id = routeId()
  const stack = [...(byId[id].chain || []), id]
  return savedRoute(id) || { stack, index: stack.length - 1 }
}

function writeHistory(method, route) {
  history[method]({ sleevePrototypeReact: route }, '', '#/' + route.stack.at(-1))
}

export default function Prototype() {
  const [state, setState] = useState(() => {
    const initial = initState()
    if (routeId() === 'avatar') initial.draft = { ...initial.avatar }
    return initial
  })
  const [route, setRoute] = useState(initialRoute)
  const [animation, setAnimation] = useState('')
  const [dev, setDev] = useState(() => new URLSearchParams(location.search).has('dev'))
  const [panelOpen, setPanelOpen] = useState(false)
  const [hotspots, setHotspots] = useState(false)
  const [overlay, setOverlay] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const [notice, setNotice] = useState(null)
  const stageRef = useRef(null)
  const frameBoxRef = useRef(null)
  const screenRef = useRef(null)
  const id = route.stack.at(-1)
  const frame = byId[id]

  function mutate(change) {
    setState(previous => {
      const next = structuredClone(previous)
      change(next)
      return next
    })
  }

  function toast(message) { setNotice({ message }) }

  function navigate(destination, mode) {
    if (!validScreen(destination) || destination === id) return
    if (destination === 'avatar') mutate(next => { next.draft = { ...next.avatar } })
    else if (id === 'avatar') mutate(next => { next.draft = null })
    const next = { stack: [...route.stack, destination], index: route.index + 1 }
    writeHistory('pushState', next)
    setAnimation(mode === 'tab' && TABS.includes(id) ? 'fade' :
      byId[destination].sheet && !frame.sheet ? 'up' : 'push')
    setRoute(next)
  }

  function back() {
    if (route.stack.length < 2) return
    if (route.index > 0) { history.back(); return }
    const next = { stack: route.stack.slice(0, -1), index: 0 }
    if (id === 'avatar') mutate(nextState => { nextState.draft = null })
    writeHistory('replaceState', next)
    setAnimation('back')
    setRoute(next)
  }

  function closeDrop() {
    let count = 0
    while (route.stack.length - count > 1 && route.stack.at(-1 - count).startsWith('drop-')) count += 1
    if (count && count <= route.index) { history.go(-count); return }
    const next = { stack: route.stack.slice(0, route.stack.length - count), index: 0 }
    writeHistory('replaceState', next)
    setAnimation('fade')
    setRoute(next)
  }

  function dismiss() { if (id.startsWith('drop-')) closeDrop(); else back() }
  function step(direction) { navigate(FRAMES[(frame.n - 1 + direction + FRAMES.length) % FRAMES.length].id) }
  function restart() { setState(initState()); navigate('signin'); setPanelOpen(false) }

  const restoreRoute = useEffectEvent(() => {
    const destination = routeId()
    const saved = savedRoute(destination)
    if (saved && destination === id && saved.index === route.index) return
    const next = saved || { stack: [...route.stack, destination], index: route.index + 1 }
    if (id === 'avatar' && destination !== 'avatar') mutate(nextState => { nextState.draft = null })
    if (destination === 'avatar' && id !== 'avatar') mutate(nextState => { nextState.draft = { ...nextState.avatar } })
    writeHistory('replaceState', next)
    setAnimation(next.index < route.index ? 'back' : 'fade')
    setRoute(next)
  })

  const handleKey = useEffectEvent(event => {
    if (event.target.closest('input:not([type="checkbox"]), textarea') || event.metaKey || event.ctrlKey || event.altKey) return
    const key = event.key.toLowerCase()
    if (key === 's') {
      setDev(!dev)
      setPanelOpen(!dev)
      if (dev) { setHotspots(false); setOverlay(false) }
    } else if (key === 'escape') {
      if (panelOpen) setPanelOpen(false)
      else dismiss()
    } else if (dev) {
      if (key === 'arrowright' || key === 'arrowleft') {
        event.preventDefault()
        step(key === 'arrowright' ? 1 : -1)
      } else if (key === 'h') setHotspots(!hotspots)
      else if (key === 'o') setOverlay(!overlay)
    }
  })

  useEffect(() => {
    if (!savedRoute(routeId())) {
      const stack = [...(byId[routeId()].chain || []), routeId()]
      stack.forEach((destination, index) => {
        writeHistory(index ? 'pushState' : 'replaceState', { stack: stack.slice(0, index + 1), index })
      })
    }
    const restore = () => restoreRoute()
    const keydown = event => handleKey(event)
    window.addEventListener('popstate', restore)
    window.addEventListener('hashchange', restore)
    document.addEventListener('keydown', keydown)
    return () => {
      window.removeEventListener('popstate', restore)
      window.removeEventListener('hashchange', restore)
      document.removeEventListener('keydown', keydown)
    }
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 2400)
    return () => clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!flashing) return
    const timer = setTimeout(() => setFlashing(false), 650)
    return () => clearTimeout(timer)
  }, [flashing])

  useLayoutEffect(() => {
    const stage = stageRef.current
    const frameBox = frameBoxRef.current
    function fit() {
      if (matchMedia('(max-width: 719px)').matches) { frameBox.style.setProperty('--s', 1); return }
      const style = getComputedStyle(stage)
      const width = stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      const height = stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
      frameBox.style.setProperty('--s', Math.max(0.35, Math.min(1, width / 390, height / 844)).toFixed(4))
    }
    const observer = new ResizeObserver(fit)
    observer.observe(stage)
    fit()
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (id === 'conversation') {
      const messages = screenRef.current.querySelector('.msgs')
      messages.scrollTop = messages.scrollHeight
    }
  }, [id, state.msgs])

  function action(name, key) {
    switch (name) {
      case 'play': mutate(next => { next.playing = next.playing === key ? null : key }); break
      case 'chip': mutate(next => { if (next.chips.has(key)) next.chips.delete(key); else next.chips.add(key) }); break
      case 'like': mutate(next => { const like = next.likes[key]; like.on = !like.on; like.n += like.on ? 1 : -1 }); break
      case 'accept':
        mutate(next => { next.requests = []; next.friends += 1 })
        toast('You and @[handle] are friends now')
        break
      case 'decline': mutate(next => { next.requests = [] }); toast('Request declined'); break
      case 'read': mutate(next => { next.unread[key] = false }); break
      case 'spotify':
        mutate(next => { next.spotify = !next.spotify })
        toast(state.spotify ? 'Spotify disconnected' : 'Spotify connected')
        break
      case 'pick': navigate('drop-why'); break
      case 'closeDrop': closeDrop(); break
      case 'dismiss': dismiss(); break
      case 'sendPick': mutate(next => { if (next.sendSel.has(key)) next.sendSel.delete(key); else next.sendSel.add(key) }); break
      case 'send': {
        const count = state.sendSel.size
        if (!count) return
        mutate(next => { next.inputs['send-msg'] = '' })
        back()
        toast(`Sent to ${count} friend${count > 1 ? 's' : ''}`)
        break
      }
      case 'personFriend':
        mutate(next => { next.personFriend = !next.personFriend; next.friends += next.personFriend ? 1 : -1 })
        toast(state.personFriend ? 'Removed from friends' : 'Friend request sent')
        break
      case 'addFriend': {
        const status = state.addState[key]
        if (status === 'friends') { navigate('person'); return }
        mutate(next => { next.addState[key] = status === 'add' ? 'requested' : 'add' })
        toast(status === 'add' ? `Request sent to @${key}` : `Request to @${key} cancelled`)
        break
      }
      case 'avTab': mutate(next => { next.draft.tab = key }); break
      case 'cycle': {
        const [option, direction] = key.split(':')
        const length = AVO[option].length
        mutate(next => { next.draft[option] = (next.draft[option] + Number(direction) + length) % length })
        break
      }
      case 'swatch': {
        const [option, value] = key.split(':')
        mutate(next => { next.draft[option] = Number(value) })
        break
      }
      case 'shuffle': {
        const lengths = Object.fromEntries(Object.entries(AVO).map(([option, values]) => [option, values.length]))
        for (const option of ['outfitColor', 'hairColor', 'skin', 'bg']) lengths[option] = SW.length
        const values = Object.fromEntries(Object.entries(lengths).map(([option, length]) => [option, Math.floor(Math.random() * length)]))
        mutate(next => { next.draft = { ...next.draft, ...values } })
        break
      }
      case 'saveAvatar': mutate(next => { next.avatar = { ...next.draft } }); back(); toast('Avatar saved'); break
      default: break
    }
  }

  function handleClick(event) {
    const target = event.target.closest('[data-go],[data-back],[data-action],[data-missing]')
    if (!target) {
      if (!hotspots && !event.target.closest('input, textarea, label, button, form.search')) setFlashing(true)
      return
    }
    if (target.disabled) return
    if (target.dataset.action) action(target.dataset.action, target.dataset.key)
    if (target.dataset.missing) toast(`No frame for "${target.dataset.missing}" yet`)
    if ('back' in target.dataset) back()
    if (target.dataset.go) navigate(target.dataset.go, target.dataset.mode)
  }

  function handleSubmit(event) {
    event.preventDefault()
    switch (event.target.dataset.form) {
      case 'signin': navigate('discover', 'tab'); break
      case 'search': toast('No frame for search results yet'); break
      case 'drop':
        mutate(next => {
          next.songComments.unshift({ who: '@[you]', t: 'now', text: next.inputs['drop-note']?.trim() || '[Your note]', mine: true })
          next.comments += 1
          next.inputs['drop-note'] = ''
        })
        closeDrop()
        toast('Dropped. Your friends will see it in their feed')
        break
      case 'comment': {
        const text = state.inputs['song-c']?.trim()
        if (!text) { toast('Write something first'); screenRef.current.querySelector('#song-c').focus(); return }
        mutate(next => {
          next.songComments.unshift({ who: '@[you]', t: 'now', text, mine: true })
          next.comments += 1
          next.inputs['song-c'] = ''
        })
        toast('Comment posted')
        break
      }
      case 'msg': {
        const text = state.inputs['msg-in']?.trim()
        if (!text) return
        mutate(next => {
          const last = next.msgs.at(-1)
          if (last?.stamp && last.side === 'me') next.msgs.splice(next.msgs.length - 1, 0, { from: 'me', text })
          else next.msgs.push({ from: 'me', text }, { stamp: 'Just now', side: 'me' })
          next.inputs['msg-in'] = ''
        })
        screenRef.current.querySelector('#msg-in').focus()
        break
      }
      default: break
    }
  }

  const markup = createScreenMarkup(id, state)
  const screenDocument = new DOMParser().parseFromString(markup, 'text/html')
  const targets = [...screenDocument.querySelectorAll('[data-go]')].filter((element, index, elements) =>
    element.dataset.go !== id && elements.findIndex(other => other.dataset.go === element.dataset.go) === index)
  const backTarget = screenDocument.querySelector('[data-back],[data-action="dismiss"]')
  const content = parse(markup, {
    replace(node) {
      if ((node.name === 'input' || node.name === 'textarea') && node.attribs.id) {
        const props = attributesToProps(node.attribs)
        delete props.defaultValue
        props.value = state.inputs[props.id] || ''
        props.onChange = event => {
          const { id: inputId, value } = event.target
          mutate(next => { next.inputs[inputId] = value })
        }
        return node.name === 'textarea' ? <textarea {...props} /> : <input {...props} />
      }
    },
  })

  return (
    <div className={`app${dev ? ' dev' : ''}${panelOpen ? ' open' : ''}`} id="app">
      <aside className="panel" id="panel" aria-label="Prototype controls">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Lo-fi prototype</p>
            <h1>Sleeve</h1>
            <p className="panel-sub">13 frames, one at a time. Tap through it like the real app, or jump to any frame here.</p>
          </div>
          <button className="panel-close" type="button" onClick={() => setPanelOpen(false)}>Done</button>
        </div>
        <nav className="frames" id="frameList" aria-label="Frames">
          {FRAMES.map((entry, index) => (
            <Fragment key={entry.id}>
              {entry.group !== FRAMES[index - 1]?.group && <p className="group">{entry.group}</p>}
              <button className="fr" type="button" data-frame={entry.id} aria-current={entry.id === id ? 'true' : 'false'} onClick={() => { navigate(entry.id); setPanelOpen(false) }}>
                <span className="n">{String(index + 1).padStart(2, '0')}</span>{entry.name}{entry.sheet && <span className="tag">Sheet</span>}
              </button>
            </Fragment>
          ))}
        </nav>
        <section className="box" aria-labelledby="linksTitle">
          <h2 id="linksTitle">Links from this frame</h2>
          <div className="links" id="links">
            {route.stack.length > 1 && backTarget && <button type="button" onClick={() => { dismiss(); setPanelOpen(false) }}>Back to {byId[route.stack.at(-2)].name}</button>}
            {targets.map(target => <button key={target.dataset.go} type="button" onClick={() => {
              if (target.dataset.action) action(target.dataset.action, target.dataset.key)
              navigate(target.dataset.go, target.dataset.mode)
              setPanelOpen(false)
            }}>{byId[target.dataset.go].name}</button>)}
            {!targets.length && !backTarget && <span className="none">None. Use the frame list.</span>}
          </div>
        </section>
        <section className="box" aria-label="View options">
          <label className="switch"><input id="hotToggle" type="checkbox" checked={hotspots} onChange={event => setHotspots(event.target.checked)} /> Show hotspots <kbd>H</kbd></label>
          <label className="switch"><input id="origToggle" type="checkbox" checked={overlay} onChange={event => setOverlay(event.target.checked)} /> Overlay original frame <kbd>O</kbd></label>
          <div className="ctl-row">
            <button className="ctl" type="button" onClick={() => step(-1)}>Prev</button>
            <button className="ctl" type="button" onClick={() => step(1)}>Next</button>
            <button className="ctl" type="button" onClick={restart}>Restart</button>
          </div>
          <p className="tip">Click anywhere that isn&apos;t clickable and the hotspots flash blue. Arrow keys step through frames; Esc goes back.</p>
        </section>
      </aside>
      <main className="stage" id="stage" ref={stageRef}>
        <div className="frame-box" id="frameBox" ref={frameBoxRef}>
          <div className="frame-label"><span><b id="frameName">{frame.name}</b></span><span id="frameNum">{String(frame.n).padStart(2, '0')} / {FRAMES.length}</span></div>
          <div className={`frame${hotspots || flashing ? ' hot' : ''}`} id="frame">
            <div key={id} className={`screen${animation ? ` a-${animation}` : ''}`} id="screen" data-screen={id} ref={screenRef} onClick={handleClick} onSubmit={handleSubmit}>{content}</div>
            <img className="orig" id="orig" src={`${import.meta.env.BASE_URL}wireframes/${frame.file}`} alt={`Original ${frame.name} wireframe`} hidden={!overlay} />
            <div className={`toast${notice ? ' show' : ''}`} id="toast" role="status" aria-live="polite" style={{ bottom: screenDocument.querySelector('.tabbar,.sheet-foot,.composer-bar') ? undefined : '40px' }}>{notice && <span>{notice.message}</span>}</div>
          </div>
        </div>
        <button className="pill" id="pill" type="button" aria-controls="panel" aria-expanded={panelOpen} onClick={() => setPanelOpen(true)}>{String(frame.n).padStart(2, '0')}/{FRAMES.length} · {frame.name}</button>
      </main>
    </div>
  )
}