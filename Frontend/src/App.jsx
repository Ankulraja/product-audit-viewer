import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, SheetViewer } from './pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sheet-viewer" element={<SheetViewer />} />
      </Routes>
    </Router>
  )
}

export default App
