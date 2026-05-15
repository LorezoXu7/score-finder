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
    if (fav) { removeFavorite(score.id); setFav(false) }
    else { addFavorite(score); setFav(true) }
    onToggle?.()
  }

  const handleDownload = () => {
    if (score.source === 'IMSLP') {
      setShowCopyright(true)
    } else {
      addHistory(score)
      window.open(score.url, '_blank')
      onToggle?.()
    }
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
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: '#1C0F08', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {score.title}
          </h3>
          {score.snippet && (
            <p style={{ fontSize: 13, color: '#6B5A4E', marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {score.snippet}
            </p>
          )}
          <span className="badge">{score.source || 'IMSLP'}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 12 }}>
          <button className="btn btn-sm btn-outline" onClick={handleDownload} title="打开 / 下载">
            &#x1F4E5;
          </button>
          <button className="btn btn-sm" onClick={handleFavorite}
            title={fav ? '取消收藏' : '收藏'}
            style={{
              background: fav ? '#FDF8F0' : 'transparent',
              color: fav ? '#C4A64A' : '#9B8A7A',
              border: fav ? '1.5px solid #C4A64A' : '1.5px solid #D4C5A0',
            }}>
            {fav ? '★' : '☆'}
          </button>
        </div>
      </div>
      <a href={score.url} target="_blank" rel="noopener noreferrer"
        style={{ fontSize: 12, color: '#9B8A7A', marginTop: 8, display: 'inline-block' }}>
        在 {score.source || '网站'} 打开 &#x2197;
      </a>

      {showCopyright && (
        <CopyrightNotice score={score} onConfirm={confirmDownload} onCancel={() => setShowCopyright(false)} />
      )}
    </div>
  )
}
