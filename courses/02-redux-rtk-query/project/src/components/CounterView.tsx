import { useAppDispatch, useAppSelector } from '../store/hooks'
import { increment, decrement } from '../store/slices/counterSlice'

export default function CounterView() {
  const count = useAppSelector((state) => state.counter)
  const dispatch = useAppDispatch()

  return (
    <div id="counter-view">
      <p data-testid="counter-value">{count}</p>
      <button data-testid="increment-btn" onClick={() => dispatch(increment())}>
        Increment
      </button>
      <button data-testid="decrement-btn" onClick={() => dispatch(decrement())}>
        Decrement
      </button>
    </div>
  )
}