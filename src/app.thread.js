/*global self*/
import diff from 'virtual-dom/diff'
import serializePatch from 'vdom-serialized-patch/serialize'
import fromJson from 'vdom-as-json/fromJson'
import view from './view'
let tree

const state = {
  count: 0,
  url: '/',
  renderCount: 0
}

self.onmessage = ({data}) => {
  const { type, payload } = data

  switch (type) {
    case 'start': {
      tree = fromJson(payload.tree)
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

  state.renderCount++

  const newTree = view(state)
  const patches = diff(tree, newTree)

  // cache for next time
  tree = newTree

  self.postMessage({url: state.url, payload: serializePatch(patches)})
}
