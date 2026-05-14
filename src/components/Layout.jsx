import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <>
      <main style={{ flex: 1, paddingBottom: 72 }}>
        <Outlet />
      </main>
      <footer className="credit" style={{ paddingBottom: 72 }}>
        Designed by <span>徐柒 Lorenzo</span> · 靠谱儿
      </footer>
      <Navbar />
    </>
  )
}
