/*global self*/
import diff from 'virtual-dom/diff'
import serializePatch from 'vdom-serialized-patch/serialize'
import fromJson from 'vdom-as-json/fromJson'
import app from './views/app'
let currentVDom, globalState

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
      globalState = payload.state
      globalState.url = payload.url
      break
    }
    case 'setUrl': {
      globalState.url = payload
      break
    }
    case 'increment': {
      globalState.count++
      break
    }
    case 'decrement': {
      globalState.count--
      break
    }
  }

  // just for fun
  console.log('render count:', ++globalState.renderCount)

  // our entire app in one line:
  const newVDom = app(globalState)

  // do the diff
  const patches = diff(currentVDom, newVDom)

  // cache last vdom so we diff against
  // the new one the next time through
  currentVDom = newVDom

  // send patches and current url back to the main thread
  self.postMessage({url: globalState.url, payload: serializePatch(patches), state: globalState})
}
