import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getFavorites,
  getHistory,
  removeFavorite,
  getTagsForScore,
  addTag,
  removeTag,
  getTags,
} from '../utils/storage'

export default function MyScores() {
  const [tab, setTab] = useState('favorites')
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])
  const [tagInputs, setTagInputs] = useState({})
  const navigate = useNavigate()

  // 同步相关
  const [syncCode, setSyncCode] = useState('')
  const [syncInput, setSyncInput] = useState('')
  const [syncMsg, setSyncMsg] = useState('')
  const [syncLoading, setSyncLoading] = useState(false)

  const refresh = useCallback(() => {
    setFavorites(getFavorites())
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh, tab])

  const handleRemoveFav = (id) => {
    removeFavorite(id)
    refresh()
  }

  const handleAddTag = (scoreId) => {
    const tag = tagInputs[scoreId]?.trim()
    if (tag) {
      addTag(scoreId, tag)
      setTagInputs((prev) => ({ ...prev, [scoreId]: '' }))
      refresh()
    }
  }

  const handleRemoveTag = (scoreId, tag) => {
    removeTag(scoreId, tag)
    refresh()
  }

  // 上传数据生成同步码
  const handleUpload = async () => {
    setSyncLoading(true)
    setSyncMsg('')
    try {
      const res = await fetch('/api/sync/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favorites: getFavorites(),
          history: getHistory(),
          tags: getTags(),
        }),
      })
      const data = await res.json()
      if (data.code) {
        setSyncCode(data.code)
        setSyncMsg('同步码已生成，30分钟内有效')
      }
    } catch {
      setSyncMsg('上传失败，请检查网络')
    } finally {
      setSyncLoading(false)
    }
  }

  // 用同步码下载数据
  const handleDownload = async () => {
    if (!syncInput.trim()) return
    setSyncLoading(true)
    setSyncMsg('')
    try {
      const res = await fetch(`/api/sync/download?code=${encodeURIComponent(syncInput.trim())}`)
      if (!res.ok) {
        const err = await res.json()
        setSyncMsg(err.error || '同步失败')
        return
      }
      const { favorites: favs, history: hist, tags } = await res.json()

      // 合并到本地存储（不覆盖已有数据）
      const existingFavs = getFavorites()
      const existingHist = getHistory()
      const existingTags = getTags()

      const mergedFavs = [...favs.filter((f) => !existingFavs.some((e) => e.id === f.id)), ...existingFavs]
      const mergedHist = [...hist.filter((h) => !existingHist.some((e) => e.id === h.id)), ...existingHist]
      const mergedTags = { ...tags, ...existingTags }

      localStorage.setItem('score_favorites', JSON.stringify(mergedFavs))
      localStorage.setItem('score_history', JSON.stringify(mergedHist.slice(0, 50)))
      localStorage.setItem('score_tags', JSON.stringify(mergedTags))

      setSyncMsg(`已同步：${favs.length} 个收藏、${hist.length} 条历史`)
      setSyncInput('')
      refresh()
      setTab('favorites')
    } catch {
      setSyncMsg('下载失败，请检查网络')
    } finally {
      setSyncLoading(false)
    }
  }

  const formatDate = (ts) => {
    const d = new Date(ts)
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const tabs = [
    { key: 'favorites', label: '收藏夹', count: favorites.length },
    { key: 'history', label: '下载历史', count: history.length },
    { key: 'sync', label: '同步', count: null },
  ]

  return (
    <div className="page">
      <h2 style={{
        fontSize: 22, fontWeight: 700, color: '#4E342E', marginBottom: 20, marginTop: 8,
        fontFamily: 'var(--serif)', letterSpacing: 2,
      }}>
        我的乐谱
      </h2>

      <div style={{
        display: 'flex', gap: 8, marginBottom: 20,
        borderBottom: '2px solid #D7CCC8', paddingBottom: 8,
      }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSyncMsg(''); setSyncCode('') }}
            style={{
              padding: '8px 20px', borderRadius: 20, border: 'none',
              fontWeight: 600, fontSize: 14,
              background: tab === t.key ? 'linear-gradient(180deg, #6D4C41 0%, #4E342E 100%)' : 'transparent',
              color: tab === t.key ? '#fff' : '#8D6E63',
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: tab === t.key ? '0 2px 6px rgba(62,39,35,0.3)' : 'none',
            }}
          >
            {t.label}{t.count != null ? ` (${t.count})` : ''}
          </button>
        ))}
      </div>

      {/* 收藏夹 */}
      {tab === 'favorites' && (
        <>
          {favorites.length === 0 ? (
            <div className="empty-state">
              <div className="icon">☆</div>
              <h3>还没有收藏的谱子</h3>
              <p>搜索并点击星标即可收藏</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/search')}>
                去搜索
              </button>
            </div>
          ) : (
            favorites.map((score) => {
              const tags = getTagsForScore(score.id)
              return (
                <div key={score.id} className="card" style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#3E2723', marginBottom: 4 }}>
                        {score.title}
                      </h3>
                      <p style={{ fontSize: 12, color: '#A1887F' }}>
                        收藏于 {formatDate(score.favoritedAt)}
                      </p>
                      {tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                          {tags.map((tag) => (
                            <span
                              key={tag} className="badge"
                              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              onClick={() => handleRemoveTag(score.id, tag)}
                              title="点击删除此标签"
                            >
                              {tag} ×
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <input
                          className="input" type="text" placeholder="添加标签..."
                          value={tagInputs[score.id] || ''}
                          onChange={(e) => setTagInputs((prev) => ({ ...prev, [score.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(score.id) }}
                          style={{ fontSize: 13, padding: '6px 10px', width: 120 }}
                        />
                        <button className="btn btn-sm btn-outline" onClick={() => handleAddTag(score.id)}>
                          添加
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                      <a href={score.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
                        📥
                      </a>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleRemoveFav(score.id)}
                        style={{ background: '#FFF8E1', color: '#D4A853', border: '2px solid #D4A853' }}
                      >
                        ★
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </>
      )}

      {/* 下载历史 */}
      {tab === 'history' && (
        <>
          {history.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📥</div>
              <h3>还没有下载记录</h3>
              <p>下载过的谱子会出现在这里</p>
            </div>
          ) : (
            history.map((score) => (
              <div key={`${score.id}-${score.downloadedAt}`} className="card" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#3E2723', marginBottom: 4 }}>
                      {score.title}
                    </h3>
                    <p style={{ fontSize: 12, color: '#A1887F' }}>
                      下载于 {formatDate(score.downloadedAt)}
                    </p>
                  </div>
                  <a href={score.url} target="_blank" rel="noopener noreferrer"
                    className="btn btn-sm btn-outline" style={{ flexShrink: 0, marginLeft: 12 }}>
                    📥 重新下载
                  </a>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* 同步 */}
      {tab === 'sync' && (
        <div>
          {/* 上传 */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, color: '#4E342E', marginBottom: 12, fontFamily: 'var(--serif)' }}>
              📤 这台设备 → 另一台设备
            </h3>
            <p style={{ fontSize: 13, color: '#8D6E63', marginBottom: 14 }}>
              上传你的收藏和历史数据，生成一个同步码。在另一台设备输入此码即可同步。
            </p>
            <button
              className="btn btn-primary btn-block"
              onClick={handleUpload}
              disabled={syncLoading}
              style={{ marginBottom: syncCode ? 14 : 0 }}
            >
              {syncLoading ? '生成中...' : '生成同步码'}
            </button>
            {syncCode && (
              <div style={{
                textAlign: 'center', padding: '16px',
                background: 'linear-gradient(180deg, #FFF8E1 0%, #F5F0EB 100%)',
                borderRadius: 8, border: '1px solid #E8D5A3',
                marginTop: 12,
              }}>
                <p style={{ fontSize: 12, color: '#8D6E63', marginBottom: 6 }}>你的同步码</p>
                <p style={{
                  fontSize: 32, fontWeight: 700, color: '#4E342E',
                  letterSpacing: 6, fontFamily: 'monospace',
                }}>
                  {syncCode}
                </p>
                <p style={{ fontSize: 11, color: '#A1887F', marginTop: 6 }}>30分钟内有效 · 请在另一台设备输入</p>
              </div>
            )}
          </div>

          {/* 下载 */}
          <div className="card">
            <h3 style={{ fontSize: 16, color: '#4E342E', marginBottom: 12, fontFamily: 'var(--serif)' }}>
              📥 另一台设备 → 这台设备
            </h3>
            <p style={{ fontSize: 13, color: '#8D6E63', marginBottom: 14 }}>
              输入另一台设备上生成的同步码，将数据同步到这台设备。
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="input"
                type="text"
                placeholder="输入 6 位同步码"
                value={syncInput}
                onChange={(e) => setSyncInput(e.target.value.toUpperCase())}
                maxLength={6}
                style={{ flex: 1, fontSize: 18, textAlign: 'center', letterSpacing: 4, fontFamily: 'monospace' }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleDownload() }}
              />
              <button
                className="btn btn-primary"
                onClick={handleDownload}
                disabled={syncLoading || syncInput.trim().length < 6}
              >
                {syncLoading ? '同步中...' : '同步'}
              </button>
            </div>
          </div>

          {/* 消息 */}
          {syncMsg && (
            <div style={{
              textAlign: 'center', padding: '14px', marginTop: 16,
              borderRadius: 8, fontSize: 14, color: syncMsg.includes('失败') || syncMsg.includes('过期') ? '#C62828' : '#2E7D32',
              background: syncMsg.includes('失败') || syncMsg.includes('过期') ? '#FFEBEE' : '#E8F5E9',
            }}>
              {syncMsg}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
