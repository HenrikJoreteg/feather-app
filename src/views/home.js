/*eslint no-unused-vars: [2, {"varsIgnorePattern": "h"}]*/
import h from 'virtual-dom/h'

export default ({count}) => {
  return (
    <div>
      <p>This app weighs about 8.5kb</p>
      <button data-click={{type: 'decrement'}}> - </button>
      <span> {count} </span>
      <button data-click={{type: 'increment'}}> + </button>
    </div>
  )
}
