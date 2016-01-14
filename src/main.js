/*global history, requestAnimationFrame, location*/
import WorkerThread from './worker.thread'
import virtualize from 'vdom-virtualize'
import toJson from 'vdom-as-json/toJson'
import applyPatch from 'vdom-serialized-patch/patch'
import { getLocalPathname } from 'local-links'
import { defobj, defn } from 'ud'
import './styles/main.styl'

// our entire application state
// as a plain object
let globalState = defobj(module, {
  count: 0,
  url: '/',
  renderCount: 0
})

// this function adds the neccessary handlers to the newly created worker
// this is done as a separate function, since the worker may be hot reloaded
const setupWorker = defn(module, function setupWorker (worker, state) {
  // The root element that contains our app markup
  const rootElement = document.body.firstChild

  // any time we get a message from the worker
  // it will be a set of "patches" to apply to
  // the real DOM. We do this on a requestAnimationFrame
  // for minimal impact
  worker.onmessage = ({data}) => {
    const { url, payload, state } = data
    globalState = state
    requestAnimationFrame(() => {
      applyPatch(rootElement, payload)
    })
    // we only want to update the URL
    // if it's different than the current
    // URL. Otherwise we keep pushing
    // the same url to the history with
    // each render
    if (location.pathname !== url) {
      history.pushState(null, null, url)
    }
  }

  // we start things off by sending a virtual DOM
  // representation of the *real* DOM along with
  // the current URL to our worker
  worker.postMessage({type: 'start', payload: {
    virtualDom: toJson(virtualize(rootElement)),
    url: location.pathname,
    state: globalState
  }})
})

// Create an instance of our worker.
// The actual loading of the script gets handled
// by webpack's worker-loader:
// https://www.npmjs.com/package/worker-loader
let worker = new WorkerThread()

if (module.hot) {
  module.hot.accept('./worker.thread', () => {
    worker.terminate()
    let NewWorker = require('./worker.thread')
    worker = new NewWorker()
    setupWorker(worker, globalState)
  })
}

// let's start our worker!
setupWorker(worker, globalState)

// if the user hits the back/forward buttons
// pass the new url to the worker
window.addEventListener('popstate', () => {
  worker.postMessage({type: 'setUrl', payload: location.pathname})
})

// listen for all clicks globally
document.body.addEventListener('click', (event) => {
  // handles internal navigation defined as
  // clicks on <a> tags that have `href` that is
  // on the same origin.
  // https://www.npmjs.com/package/local-links
  const pathname = getLocalPathname(event)
  if (pathname) {
    // stop browser from following the link
    event.preventDefault()
    // instead, post the new URL to our worker
    // which will trigger compute a new vDom
    // based on that new URL state
    worker.postMessage({type: 'setUrl', payload: pathname})
    return
  }

  // this is for other "onClick" type events we want to
  // respond to. We check existance of an `data-click`
  // attribute and if it exists, post that back.
  // In our case, the messages look like either
  // {type: "increment"}
  // or
  // {type: "decrement"}
  // but could contain any serializable payload
  // describing the action that occured
  const click = event.target['data-click']
  if (click) {
    event.preventDefault()
    worker.postMessage(click)
  }
})
