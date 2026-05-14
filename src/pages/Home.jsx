import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { categories } from '../utils/composers'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      {/* 头部 */}
      <div style={{ textAlign: 'center', padding: '28px 0 16px' }}>
        {/* 顶部装饰 */}
        <div style={{ color: '#D4A853', fontSize: 12, letterSpacing: 10, marginBottom: 12, opacity: 0.7 }}>
          ✦ ✦ ✦
        </div>

        {/* 主标题 */}
        <div style={{
          display: 'inline-block',
          position: 'relative',
          padding: '0 40px',
          marginBottom: 6,
        }}>
          <span style={{
            position: 'absolute', left: 0, top: '50%',
            width: 30, height: 1,
            background: 'linear-gradient(90deg, transparent, #D4A853)',
          }} />
          <span style={{
            position: 'absolute', right: 0, top: '50%',
            width: 30, height: 1,
            background: 'linear-gradient(270deg, transparent, #D4A853)',
          }} />
          <h1 style={{
            fontSize: 44,
            fontWeight: 700,
            color: '#2C1810',
            letterSpacing: 10,
            fontFamily: 'var(--serif)',
          }}>
            靠谱儿
          </h1>
        </div>

        <p style={{
          fontSize: 13,
          color: '#8B7355',
          marginBottom: 18,
          letterSpacing: 4,
          fontFamily: 'var(--serif)',
          textTransform: 'uppercase',
        }}>
          Cantus · Quaerere · Invenire
        </p>

        <SearchBar large />
      </div>

      <div className="ornament">❧ ❧ ❧</div>

      {/* 快捷分类 */}
      <div style={{ marginTop: 4 }}>
        <h3 style={{
          textAlign: 'center',
          fontSize: 16,
          color: '#6B1D2F',
          marginBottom: 16,
          fontFamily: 'var(--serif)',
          letterSpacing: 4,
        }}>
          —— 按作品类型浏览 ——
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
        }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              className="card"
              onClick={() => navigate(`/browse/${cat.key}`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '20px 8px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 28 }}>{cat.icon}</span>
              <span style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#2C1810',
                fontFamily: 'var(--serif)',
                letterSpacing: 2,
              }}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="ornament">❧ ❧ ❧</div>

      {/* 快速入口 */}
      <div>
        <h3 style={{
          textAlign: 'center',
          fontSize: 16,
          color: '#6B1D2F',
          marginBottom: 16,
          fontFamily: 'var(--serif)',
          letterSpacing: 4,
        }}>
          —— 快速搜索 ——
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {['Don Giovanni', 'Mozart', 'Rossini', 'Bellini', 'Donizetti', 'Puccini'].map(
            (term) => (
              <button
                key={term}
                className="badge"
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                style={{
                  padding: '9px 20px',
                  cursor: 'pointer',
                  fontSize: 13,
                  letterSpacing: 1,
                }}
              >
                {term}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
