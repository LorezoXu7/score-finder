import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/', label: '首页', icon: '♪' },
  { path: '/search', label: '搜索', icon: '🔍' },
  { path: '/browse', label: '浏览', icon: '📚' },
  { path: '/my-scores', label: '我的', icon: '⭐' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = '/' + (location.pathname.split('/')[1] || '')

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#5D4037',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 64,
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        zIndex: 100,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.2)',
      }}
    >
      {tabs.map((tab) => {
        const isActive =
          tab.path === '/'
            ? currentPath === '/'
            : currentPath.startsWith(tab.path)
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              color: isActive ? '#FFF8E1' : '#A1887F',
              fontSize: 11,
              fontWeight: isActive ? 700 : 500,
              padding: '8px 16px',
              transition: 'color 0.2s',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
