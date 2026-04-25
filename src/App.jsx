import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BuilderComponent } from '@builder.io/react'
import WeatherDashboard from './WeatherDashboard.jsx'
import './App.scss'

const BUILDER_PUBLIC_API_KEY = import.meta.env.VITE_BUILDER_PUBLIC_API_KEY

function BuilderPageRoute() {
  if (!BUILDER_PUBLIC_API_KEY) {
    return (
      <p className="cds--type-body-01">
        Set <code className="cds--code-snippet--inline">VITE_BUILDER_PUBLIC_API_KEY</code> in{' '}
        <code className="cds--code-snippet--inline">.env</code> to render Builder pages for unmatched
        routes.
      </p>
    )
  }
  return <BuilderComponent model="page" />
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/weather/:zip" element={<WeatherDashboard />} />
          <Route path="*" element={<BuilderPageRoute />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
