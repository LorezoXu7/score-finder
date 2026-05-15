import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { periods, categories } from '../utils/composers'
import { getWorks } from '../utils/works'

export default function Browse() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [selectedComposer, setSelectedComposer] = useState(null)

  const selectedCategory = categories.find((c) => c.key === category)

  // 点了作曲家 → 显示作品
  if (selectedComposer) {
    const worksList = getWorks(selectedComposer.query)
    return (
      <div className="page">
        <div style={{ marginBottom: 20 }}>
          <button className="btn btn-outline btn-sm" onClick={() => setSelectedComposer(null)}>
            ← 返回
          </button>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1C0F08', marginBottom: 4, fontFamily: 'var(--serif)' }}>
          {selectedComposer.name}
        </h2>
        <p style={{ fontSize: 13, color: '#6B5A4E', marginBottom: 20 }}>
          {worksList.length > 0 ? '点击作品名即可搜索乐谱' : '暂无作品数据，可直接搜索'}
        </p>

        {worksList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {worksList.map((work) => (
              <button
                key={work}
                className="card"
                onClick={() => navigate(`/search?q=${encodeURIComponent(selectedComposer.query + ' ' + work)}`)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontWeight: 600, color: '#1C0F08', fontSize: 15 }}>{work}</span>
                <span style={{ color: '#C4A64A', fontSize: 18 }}>&#x2197;</span>
              </button>
            ))}
          </div>
        ) : (
          <button className="btn btn-primary btn-block"
            onClick={() => navigate(`/search?q=${encodeURIComponent(selectedComposer.query)}`)}>
            搜索 {selectedComposer.name} 的乐谱
          </button>
        )}
      </div>
    )
  }

  // 选了作品类型 → 显示作曲家
  if (selectedCategory) {
    return (
      <div className="page">
        <div style={{ marginBottom: 20 }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/browse')}>
            ← 返回分类
          </button>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1C0F08', marginBottom: 6, fontFamily: 'var(--serif)' }}>
          {selectedCategory.icon} {selectedCategory.name}
        </h2>
        <p style={{ fontSize: 13, color: '#6B5A4E', marginBottom: 16 }}>
          选择作曲家，查看代表作品
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {periods.map((period) =>
            period.composers.map((comp) => (
              <button
                key={comp.name}
                className="card"
                onClick={() => setSelectedComposer(comp)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontWeight: 600, color: '#1C0F08', fontSize: 15 }}>{comp.name}</span>
                <span className="badge">{period.name}</span>
              </button>
            ))
          )}
        </div>
      </div>
    )
  }

  // 浏览主页
  return (
    <div className="page">
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1C0F08', marginBottom: 20, marginTop: 8, fontFamily: 'var(--serif)' }}>
        分类浏览
      </h2>

      {/* 作品类型 */}
      <h3 style={{ fontSize: 15, color: '#6B5A4E', marginBottom: 12, letterSpacing: 2, fontFamily: 'var(--serif)' }}>
        按作品类型
      </h3>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 10, marginBottom: 28,
      }}>
        {categories.map((cat) => (
          <button key={cat.key} className="card"
            onClick={() => navigate(`/browse/${cat.key}`)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '18px 8px' }}>
            <span style={{ fontSize: 28 }}>{cat.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1C0F08' }}>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 按时期浏览作曲家 */}
      <h3 style={{ fontSize: 15, color: '#6B5A4E', marginBottom: 12, letterSpacing: 2, fontFamily: 'var(--serif)' }}>
        按时期浏览作曲家
      </h3>
      {periods.map((period) => (
        <div key={period.key} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <h4 style={{ fontSize: 16, color: '#1C0F08', fontWeight: 600, fontFamily: 'var(--serif)' }}>{period.name}</h4>
            <span style={{ fontSize: 12, color: '#9B8A7A' }}>{period.years}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {period.composers.map((comp) => (
              <button key={comp.name} className="badge"
                onClick={() => setSelectedComposer(comp)}
                style={{ padding: '9px 18px', fontSize: 13, cursor: 'pointer' }}>
                {comp.name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
