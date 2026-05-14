import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <>
      <main style={{ flex: 1, paddingBottom: 100 }}>
        <Outlet />
      </main>
      <div
        style={{
          position: 'fixed',
          bottom: 88,
          right: 24,
          fontFamily: 'var(--serif)',
          fontSize: 11,
          color: '#A1887F',
          letterSpacing: 2,
          zIndex: 50,
          pointerEvents: 'none',
          opacity: 0.7,
        }}
      >
        徐柒
      </div>
      <Navbar />
    </>
  )
}
