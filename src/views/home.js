export default ({count}) => (
  <div>
    <p>This app weighs about 15kb</p>
    <button data-click={{type: 'decrement'}}> - </button>
    <span> {count} </span>
    <button data-click={{type: 'increment'}}> + </button>
  </div>
)
