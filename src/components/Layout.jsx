import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <>
      <main style={{ flex: 1, paddingBottom: 72 }}>
        <Outlet />
      </main>
      <Navbar />
    </>
  )
}
