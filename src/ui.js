import h from 'virtual-dom/h'
import page1 from './components/page1'
import page2 from './components/page2'

export default (state) => {
  const { url } = state
  let page

  if (url === '/one') {
    page = page1()
  } else if (url === '/two') {
    page = page2()
  } else {
    page = h('h1', 'home')
  }

  return h('main', [
    h('h1', 'hello'),
    h('ul', [
      h('li', [
        h('a', {href: '/one'}, 'one')
      ]),
      h('li', [
        h('a', {href: '/two'}, 'two')
      ])
    ]),
    page,
    h('span', ["render #: " + state.count])
  ]);
}
