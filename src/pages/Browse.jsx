import { useParams, useNavigate } from 'react-router-dom'
import { periods, categories } from '../utils/composers'

export default function Browse() {
  const { category } = useParams()
  const navigate = useNavigate()

  // 如果选中了某个作品类型，显示该类型的作曲家列表
  const selectedCategory = categories.find((c) => c.key === category)

  return (
    <div className="page">
      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#4E342E',
          marginBottom: 20,
          marginTop: 8,
        }}
      >
        {selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : '📚 分类浏览'}
      </h2>

      {selectedCategory ? (
        <>
          <p style={{ fontSize: 14, color: '#8D6E63', marginBottom: 16 }}>
            点击作曲家，搜索「{selectedCategory.name}」相关乐谱
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {periods.map((period) =>
              period.composers.map((comp) => (
                <button
                  key={comp.name}
                  className="card"
                  onClick={() =>
                    navigate(
                      `/search?q=${encodeURIComponent(comp.query + ' ' + selectedCategory.query)}`
                    )
                  }
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    border: '1px solid #BCAAA4',
                    background: '#fff',
                    borderRadius: 12,
                    width: '100%',
                    textAlign: 'left',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#EFEBE9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                >
                  <span style={{ fontWeight: 600, color: '#4E342E', fontSize: 15 }}>
                    {comp.name}
                  </span>
                  <span className="badge">{period.name}</span>
                </button>
              ))
            )}
          </div>
          <button
            className="btn btn-outline"
            style={{ marginTop: 20, width: '100%' }}
            onClick={() => navigate('/browse')}
          >
            ← 返回分类列表
          </button>
        </>
      ) : (
        <>
          {/* 作品类型 */}
          <h3 style={{ fontSize: 15, color: '#8D6E63', marginBottom: 12, marginTop: 4 }}>
            按作品类型
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: 10,
              marginBottom: 28,
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

          {/* 按时期浏览作曲家 */}
          <h3 style={{ fontSize: 15, color: '#8D6E63', marginBottom: 12 }}>
            按时期浏览作曲家
          </h3>
          {periods.map((period) => (
            <div key={period.key} style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <h4 style={{ fontSize: 16, color: '#5D4037', fontWeight: 600 }}>
                  {period.name}
                </h4>
                <span style={{ fontSize: 12, color: '#A1887F' }}>{period.years}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {period.composers.map((comp) => (
                  <button
                    key={comp.name}
                    className="badge"
                    onClick={() => navigate(`/search?q=${encodeURIComponent(comp.query)}`)}
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      border: '1px solid #BCAAA4',
                      fontSize: 13,
                      background: '#fff',
                    }}
                  >
                    {comp.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
