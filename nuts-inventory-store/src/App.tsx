import { AppRouter } from './app/router'
import { QueryProvider } from './app/providers/QueryProvider'

function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  )
}

export default App