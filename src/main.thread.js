import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import serializePatch from 'vdom-serialized-patch/serialize'
import fromJson from 'vdom-as-json/fromJson'
import ui from './ui'

let tree
const state = {
  count: 0,
  url: '/'
}

onmessage = ({data}) => {
  const { type, payload } = data

  console.log('event:', type, payload)

  switch (type) {
    case 'start': {
      tree = fromJson(payload.tree)
      state.url = payload.url
      break;
    }
    case 'setUrl': {
      state.url = payload
      break;
    }
  }

  // mutate our state
  state.count++

  const newTree = ui(state);
  const patches = diff(tree, newTree);

  // cache for next time
  tree = newTree

  postMessage({url: state.url, payload: serializePatch(patches)})
}
