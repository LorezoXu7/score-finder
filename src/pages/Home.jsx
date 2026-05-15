import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { categories } from '../utils/composers'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      {/* 头部 */}
      <header style={{ textAlign: 'center', padding: '32px 0 20px' }}>
        <div style={{ color: '#C4A64A', fontSize: 13, letterSpacing: 8, marginBottom: 16, opacity: 0.7 }}>
          &#x266D; &#x266D; &#x266D;
        </div>
        <h1 style={{
          fontSize: 42, fontWeight: 700, color: '#1C0F08',
          letterSpacing: 8, fontFamily: 'var(--serif)', marginBottom: 8,
        }}>
          靠谱儿
        </h1>
        <p style={{ fontSize: 13, color: '#6B5A4E', letterSpacing: 4, marginBottom: 24 }}>
          MUSIC SCORE LIBRARY
        </p>
        <SearchBar large />
      </header>

      {/* 分隔 */}
      <div className="ornament">&#x2726; &#x2726; &#x2726;</div>

      {/* 分类 */}
      <section>
        <h2 style={{
          textAlign: 'center', fontSize: 15, color: '#6B5A4E',
          letterSpacing: 4, marginBottom: 16, fontFamily: 'var(--serif)',
        }}>
          按作品类型浏览
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 10,
        }}>
          {categories.map((cat) => (
            <button
              key={cat.key}
              className="card"
              onClick={() => navigate(`/browse/${cat.key}`)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, padding: '20px 8px',
              }}
            >
              <span style={{ fontSize: 28 }}>{cat.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1C0F08' }}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 分隔 */}
      <div className="ornament">&#x266D;</div>

      {/* 快速入口 */}
      <section>
        <h2 style={{
          textAlign: 'center', fontSize: 15, color: '#6B5A4E',
          letterSpacing: 4, marginBottom: 16, fontFamily: 'var(--serif)',
        }}>
          快速搜索
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {['Don Giovanni', 'Mozart', 'Rossini', 'Bellini', 'Donizetti', 'Puccini'].map((t) => (
            <button
              key={t}
              className="badge"
              onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
              style={{ padding: '9px 18px', fontSize: 13 }}
            >
              {t}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
