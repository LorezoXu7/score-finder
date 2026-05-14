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
          color: '#8D6E63',
          letterSpacing: 2,
          zIndex: 50,
          pointerEvents: 'none',
          opacity: 0.75,
        }}
      >
        徐柒 Lorenzo
      </div>
      <Navbar />
    </>
  )
}
