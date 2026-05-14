import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getFavorites,
  getHistory,
  removeFavorite,
  getTagsForScore,
  addTag,
  removeTag,
} from '../utils/storage'

export default function MyScores() {
  const [tab, setTab] = useState('favorites')
  const [favorites, setFavorites] = useState([])
  const [history, setHistory] = useState([])
  const [tagInputs, setTagInputs] = useState({})
  const navigate = useNavigate()

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
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }

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
        ⭐ 我的乐谱
      </h2>

      {/* Tab 切换 */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
          borderBottom: '2px solid #D7CCC8',
          paddingBottom: 8,
        }}
      >
        {[
          { key: 'favorites', label: '收藏夹', count: favorites.length },
          { key: 'history', label: '下载历史', count: history.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '8px 20px',
              borderRadius: 20,
              border: 'none',
              fontWeight: 600,
              fontSize: 14,
              background: tab === t.key ? '#5D4037' : 'transparent',
              color: tab === t.key ? '#fff' : '#8D6E63',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t.label} ({t.count})
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
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => navigate('/search')}
              >
                去搜索
              </button>
            </div>
          ) : (
            favorites.map((score) => {
              const tags = getTagsForScore(score.id)
              return (
                <div key={score.id} className="card" style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: '#3E2723',
                          marginBottom: 4,
                        }}
                      >
                        {score.title}
                      </h3>
                      <p style={{ fontSize: 12, color: '#A1887F' }}>
                        收藏于 {formatDate(score.favoritedAt)}
                      </p>

                      {/* 标签 */}
                      {tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="badge"
                              style={{
                                background: '#D7CCC8',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                              onClick={() => handleRemoveTag(score.id, tag)}
                              title="点击删除此标签"
                            >
                              {tag} ×
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 添加标签 */}
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <input
                          className="input"
                          type="text"
                          placeholder="添加标签..."
                          value={tagInputs[score.id] || ''}
                          onChange={(e) =>
                            setTagInputs((prev) => ({
                              ...prev,
                              [score.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTag(score.id)
                          }}
                          style={{ fontSize: 13, padding: '6px 10px', width: 120 }}
                        />
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleAddTag(score.id)}
                        >
                          添加
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                      <a
                        href={score.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        📥
                      </a>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleRemoveFav(score.id)}
                        style={{
                          background: '#FFF8E1',
                          color: '#D4A853',
                          border: '2px solid #D4A853',
                        }}
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
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#3E2723',
                        marginBottom: 4,
                      }}
                    >
                      {score.title}
                    </h3>
                    <p style={{ fontSize: 12, color: '#A1887F' }}>
                      下载于 {formatDate(score.downloadedAt)}
                    </p>
                  </div>
                  <a
                    href={score.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline"
                    style={{ flexShrink: 0, marginLeft: 12 }}
                  >
                    📥 重新下载
                  </a>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}
