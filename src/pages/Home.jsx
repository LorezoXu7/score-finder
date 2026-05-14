import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { categories } from '../utils/composers'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      {/* 头部 */}
      <div style={{ textAlign: 'center', padding: '40px 0 24px' }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: '#4E342E',
            marginBottom: 8,
            letterSpacing: 2,
          }}
        >
          🎼 靠谱儿
        </h1>
        <p style={{ fontSize: 15, color: '#8D6E63', marginBottom: 24 }}>
          古典乐谱搜索，一键直达 IMSLP
        </p>
        <SearchBar large />
      </div>

      {/* 快捷分类 */}
      <div style={{ marginTop: 8 }}>
        <h3 style={{ fontSize: 17, color: '#5D4037', marginBottom: 12 }}>
          按作品类型浏览
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
                padding: '16px 8px',
                cursor: 'pointer',
                border: '1px solid #BCAAA4',
                background: '#fff',
                borderRadius: 12,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(62,39,35,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
              }}
            >
              <span style={{ fontSize: 32 }}>{cat.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#4E342E' }}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 快速入口 */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: 17, color: '#5D4037', marginBottom: 12 }}>
          快速搜索
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Don Giovanni', 'Mozart', 'Verdi', 'Beethoven', 'Chopin', 'Puccini'].map(
            (term) => (
              <button
                key={term}
                className="badge"
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  border: '1px solid #BCAAA4',
                  fontSize: 13,
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
