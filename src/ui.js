import h from 'virtual-dom/h'
import page1 from './components/page1'
import page2 from './components/page2'

export default (state) => {
  const { url } = state
  let page

  if (url === '/one') {
    page = page1()
  } else if (url === '/two') {
    console.log('render page 2')
    page = page2()
  } else {
    page = h('h1', 'home')
  }

  return (
    <main>
      <h1>hello</h1>
      <ul>
        <li><a href='/one'>one</a></li>
        <li><a href='/two'>two</a></li>
      </ul>
      {page}
      <span>render #: {state.count}</span>
    </main>
  )
}
