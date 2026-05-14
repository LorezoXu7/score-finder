import { useState, useEffect } from 'react'
import { isFavorite, addFavorite, removeFavorite, addHistory } from '../utils/storage'
import CopyrightNotice from './CopyrightNotice'

export default function ScoreCard({ score, onToggle }) {
  const [fav, setFav] = useState(false)
  const [showCopyright, setShowCopyright] = useState(false)

  useEffect(() => {
    setFav(isFavorite(score.id))
  }, [score.id])

  const handleFavorite = () => {
    if (fav) {
      removeFavorite(score.id)
      setFav(false)
    } else {
      addFavorite(score)
      setFav(true)
    }
    onToggle?.()
  }

  const handleDownload = () => {
    setShowCopyright(true)
  }

  const confirmDownload = () => {
    setShowCopyright(false)
    addHistory(score)
    window.open(score.url, '_blank')
    onToggle?.()
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 4,
              color: '#3E2723',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {score.title}
          </h3>
          {score.snippet && (
            <p
              style={{
                fontSize: 13,
                color: '#8D6E63',
                marginBottom: 8,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {score.snippet}
            </p>
          )}
          <span className="badge" style={score.source === '网络搜索' ? { background: '#E8F5E9', color: '#2E7D32' } : score.source && score.source !== 'IMSLP' ? { background: '#FFF3E0', color: '#E65100' } : undefined}>
            {score.source || 'IMSLP'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 12 }}>
          <button
            className="btn btn-sm btn-outline"
            onClick={handleDownload}
            title="下载 / 查看"
          >
            📥
          </button>
          <button
            className="btn btn-sm"
            onClick={handleFavorite}
            title={fav ? '取消收藏' : '收藏'}
            style={{
              background: fav ? '#FFF8E1' : 'transparent',
              color: fav ? '#D4A853' : '#8D6E63',
              border: fav ? '2px solid #D4A853' : '2px solid #BCAAA4',
            }}
          >
            {fav ? '★' : '☆'}
          </button>
        </div>
      </div>
      <a
        href={score.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 12, color: '#8D6E63', marginTop: 8, display: 'inline-block' }}
      >
        {score.source && score.source !== 'IMSLP'
          ? `在 ${score.source} 查看详情 →`
          : '在 IMSLP 查看详情 →'}
      </a>

      {showCopyright && (
        <CopyrightNotice
          score={score}
          onConfirm={confirmDownload}
          onCancel={() => setShowCopyright(false)}
        />
      )}
    </div>
  )
}
