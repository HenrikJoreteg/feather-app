import home from './home'
import about from './about'

export default (state) => {
  const { url } = state
  let page

  if (url === '/') {
    page = home(state)
  } else if (url === '/about') {
    page = about()
  }

  return (
    <main>
      <h1>Feather POC App</h1>
      <nav>
        <a href='/'>home</a> | <a href='/about'>about</a>
      </nav>
      {page}
    </main>
  )
}
