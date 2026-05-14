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
            onClick={() => { setTab(t.key); setSyncMsg('') }}
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
          {/* 导出 */}
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, color: '#4E342E', marginBottom: 12, fontFamily: 'var(--serif)' }}>
              📤 导出数据
            </h3>
            <p style={{ fontSize: 13, color: '#8D6E63', marginBottom: 14 }}>
              把收藏、历史和标签下载为一个文件，发送到另一台设备。
            </p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => {
                const data = {
                  favorites: getFavorites(),
                  history: getHistory(),
                  tags: getTags(),
                  exportedAt: new Date().toISOString(),
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `靠谱儿-备份-${new Date().toISOString().slice(0, 10)}.json`
                a.click()
                URL.revokeObjectURL(url)
                setSyncMsg('导出成功！把文件发送到另一台设备后导入即可')
              }}
            >
              下载备份文件
            </button>
          </div>

          {/* 导入 */}
          <div className="card">
            <h3 style={{ fontSize: 16, color: '#4E342E', marginBottom: 12, fontFamily: 'var(--serif)' }}>
              📥 导入数据
            </h3>
            <p style={{ fontSize: 13, color: '#8D6E63', marginBottom: 14 }}>
              选择之前导出的备份文件，将数据合并到这台设备。（不会覆盖已有数据）
            </p>
            <input
              type="file"
              accept=".json"
              id="import-file"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setSyncLoading(true)
                const reader = new FileReader()
                reader.onload = (ev) => {
                  try {
                    const data = JSON.parse(ev.target.result)
                    const existingFavs = getFavorites()
                    const existingHist = getHistory()
                    const existingTags = getTags()

                    const mergedFavs = [...(data.favorites || []).filter((f) => !existingFavs.some((e) => e.id === f.id)), ...existingFavs]
                    const mergedHist = [...(data.history || []).filter((h) => !existingHist.some((e) => e.id === h.id)), ...existingHist]
                    const mergedTags = { ...data.tags, ...existingTags }

                    localStorage.setItem('score_favorites', JSON.stringify(mergedFavs))
                    localStorage.setItem('score_history', JSON.stringify(mergedHist.slice(0, 50)))
                    localStorage.setItem('score_tags', JSON.stringify(mergedTags))

                    setSyncMsg(`导入成功！已合并 ${data.favorites?.length || 0} 个收藏、${data.history?.length || 0} 条历史`)
                    refresh()
                    setTab('favorites')
                  } catch {
                    setSyncMsg('文件格式错误，请选择正确的备份文件')
                  }
                  setSyncLoading(false)
                  e.target.value = ''
                }
                reader.readAsText(file)
              }}
            />
            <button
              className="btn btn-outline btn-block"
              onClick={() => document.getElementById('import-file').click()}
              disabled={syncLoading}
            >
              {syncLoading ? '导入中...' : '选择备份文件导入'}
            </button>
          </div>

          {/* 消息 */}
          {syncMsg && (
            <div style={{
              textAlign: 'center', padding: '14px', marginTop: 16,
              borderRadius: 8, fontSize: 14,
              color: syncMsg.includes('失败') || syncMsg.includes('错误') ? '#C62828' : '#2E7D32',
              background: syncMsg.includes('失败') || syncMsg.includes('错误') ? '#FFEBEE' : '#E8F5E9',
            }}>
              {syncMsg}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
