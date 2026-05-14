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
          right: 20,
          fontFamily: 'var(--serif)',
          fontSize: 14,
          fontWeight: 700,
          color: '#8B7355',
          letterSpacing: 2,
          zIndex: 50,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      >
        徐柒 Lorenzo
      </div>
      <Navbar />
    </>
  )
}
