import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import Browse from './pages/Browse'
import MyScores from './pages/MyScores'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/browse/:category" element={<Browse />} />
        <Route path="/my-scores" element={<MyScores />} />
      </Route>
    </Routes>
  )
}
