import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <>
      <main style={{ flex: 1, paddingBottom: 72 }}>
        <Outlet />
      </main>
      <div
        style={{
          position: 'fixed',
          bottom: 76,
          right: 12,
          fontFamily: 'var(--serif)',
          fontSize: 12,
          color: '#A1887F',
          letterSpacing: 1,
          zIndex: 50,
          pointerEvents: 'none',
          textShadow: '0 1px 2px rgba(255,255,255,0.8)',
        }}
      >
        徐柒
      </div>
      <Navbar />
    </>
  )
}
