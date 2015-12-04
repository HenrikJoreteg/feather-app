import Thread from './app.thread'
import virtualize from 'vdom-virtualize'
import toJson from 'vdom-as-json/toJson'
import applyPatch from 'vdom-serialized-patch/patch'
import { getLocalPathname } from 'local-links'
import './styles/main.styl'

const worker = new Thread()
const rootNode = document.body.firstChild
const { history, location, requestAnimationFrame } = window

worker.onmessage = ({data}) => {
  const { url, payload } = data
  requestAnimationFrame(() => {
    applyPatch(document.body.firstChild, payload)
  })
  if (location.pathname !== url) {
    history.pushState(null, null, url)
  }
}

window.addEventListener('popstate', () => {
  worker.postMessage({type: 'setUrl', payload: location.pathname})
})

document.body.addEventListener('click', (event) => {
  const pathname = getLocalPathname(event)
  const click = event.target['data-click']

  if (pathname) {
    event.preventDefault()
    worker.postMessage({type: 'setUrl', payload: pathname})
  }

  // post click actions back to worker
  if (click) {
    event.preventDefault()
    worker.postMessage(click)
  }
})

document.body.addEventListener('scroll', (event) => {
  const scroll = event.target['data-scroll']

  if (scroll) {
    event.preventDefault()
    worker.postMessage(scroll)
  }
})

worker.postMessage({type: 'start', payload: {
  tree: toJson(virtualize(rootNode)),
  url: location.pathname
}})
