import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-fallback">
          <p>Something went wrong.</p>
          <button id="error-retry" onClick={() => this.setState({ hasError: false })}>Retry</button>
        </div>
      )
    }
    return this.props.children
  }
}