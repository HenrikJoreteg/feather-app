/*eslint no-unused-vars: [2, {"varsIgnorePattern": "h"}]*/
import h from 'virtual-dom/h'

export default ({count}) => {
  return (
    <div>
      <h1>Page one</h1>
      <button data-click={{type: 'decrement'}}> - </button>
      <span>{count}</span>
      <button data-click={{type: 'increment'}}> + </button>
    </div>
  )
}
