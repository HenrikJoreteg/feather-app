/*global self*/
import diff from 'virtual-dom/diff'
import serializePatch from 'vdom-serialized-patch/serialize'
import fromJson from 'vdom-as-json/fromJson'
import app from './views/app'
let currentVDom
let renderCount = 0

// our entire application state
// as a plain object
const state = {
  count: 0,
  url: '/'
}

// messages from the main thread come
// in here
self.onmessage = ({data}) => {
  const { type, payload } = data

  console.log('worker got message:', data)

  // handle different event types
  // update the state accordingly
  switch (type) {
    case 'start': {
      currentVDom = fromJson(payload.virtualDom)
      state.url = payload.url
      break
    }
    case 'setUrl': {
      state.url = payload
      break
    }
    case 'increment': {
      state.count++
      break
    }
    case 'decrement': {
      state.count--
      break
    }
  }

  // just for fun
  console.log('render count:', ++renderCount)

  // our entire app in one line:
  const newVDom = app(state)

  // do the diff
  const patches = diff(currentVDom, newVDom)

  // cache last vdom so we diff against
  // the new one the next time through
  currentVDom = newVDom

  // send patches and current url back to the main thread
  self.postMessage({url: state.url, payload: serializePatch(patches)})
}
