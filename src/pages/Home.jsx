import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { categories } from '../utils/composers'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      {/* 头部 */}
      <div style={{ textAlign: 'center', padding: '32px 0 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 4, letterSpacing: 4 }}>🎵</div>
        <h1
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: '#3E2723',
            marginBottom: 6,
            letterSpacing: 4,
            fontFamily: 'var(--serif)',
          }}
        >
          靠谱儿
        </h1>
        <p style={{ fontSize: 14, color: '#8D6E63', marginBottom: 20, fontStyle: 'italic' }}>
          —— 古典乐谱 · 触手可及 ——
        </p>
        <SearchBar large />
      </div>

      <div className="divider">❦</div>

      {/* 快捷分类 */}
      <div style={{ marginTop: 4 }}>
        <h3
          style={{
            fontSize: 17,
            color: '#4E342E',
            marginBottom: 14,
            fontFamily: 'var(--serif)',
            letterSpacing: 1,
          }}
        >
          ◆ 按作品类型浏览
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: 10,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              className="card"
              onClick={() => navigate(`/browse/${cat.key}`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '18px 8px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 30 }}>{cat.icon}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#4E342E',
                  fontFamily: 'var(--serif)',
                }}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="divider">♪</div>

      {/* 快速入口 */}
      <div>
        <h3
          style={{
            fontSize: 17,
            color: '#4E342E',
            marginBottom: 14,
            fontFamily: 'var(--serif)',
            letterSpacing: 1,
          }}
        >
          ◆ 快速搜索
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Don Giovanni', 'Mozart', 'Verdi', 'Beethoven', 'Chopin', 'Puccini'].map(
            (term) => (
              <button
                key={term}
                className="badge"
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                style={{
                  padding: '8px 18px',
                  cursor: 'pointer',
                  fontSize: 13,
                  background: '#FFFEF9',
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
