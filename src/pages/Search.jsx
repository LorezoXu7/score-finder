import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ScoreCard from '../components/ScoreCard'

const API = window.location.hostname.includes('github.io')
  ? 'https://score-finder-beryl.vercel.app'
  : ''

export default function Search() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [source, setSource] = useState('imslp')

  const doSearch = useCallback(async (q, src) => {
    if (!q.trim()) return
    setLoading(true)
    setError('')
    try {
      const endpoints = {
        imslp: '/api/search',
        global: '/api/search-global',
        domestic: '/api/search-domestic',
      }
      const endpoint = endpoints[src] || '/api/search'
      const res = await fetch(`${API}${endpoint}?q=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error('搜索请求失败')
      const data = await res.json()
      setResults(data)
    } catch (err) {
      setError('搜索时遇到问题，请检查网络后重试')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (query) doSearch(query, source)
  }, [query, source, doSearch])

  const handleSourceChange = (src) => {
    setSource(src)
    if (query) doSearch(query, src)
  }

  const refresh = () => setRefreshKey((k) => k + 1)

  const sourceLabel = { imslp: 'IMSLP', global: '全球资源', domestic: '国内资源' }[source] || 'IMSLP'

  return (
    <div className="page">
      <div style={{ padding: '8px 0 16px' }}>
        <SearchBar initial={query} />
      </div>

      {/* 数据源切换 */}
      {query && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          <button
            onClick={() => handleSourceChange('imslp')}
            className={source === 'imslp' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
          >
            IMSLP
          </button>
          <button
            onClick={() => handleSourceChange('global')}
            className={source === 'global' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
          >
            全球资源
          </button>
          <button
            onClick={() => handleSourceChange('domestic')}
            className={source === 'domestic' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
          >
            国内资源
          </button>
        </div>
      )}

      {!query && (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>输入关键词开始搜索</h3>
          <p>支持按作曲家、作品名称搜索，可切换国际/国内数据源</p>
        </div>
      )}

      {loading && <div className="spinner" />}

      {error && (
        <div style={{ textAlign: 'center', padding: 24, color: '#8D6E63', fontSize: 14 }}>
          <p>{error}</p>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={() => doSearch(query, source)}>
            重试
          </button>
        </div>
      )}

      {!loading && !error && query && results.length === 0 && (
        <div className="empty-state">
          <div className="icon">📭</div>
          <h3>未找到相关乐谱</h3>
          <p>试试其他关键词，或切换到另一数据源再搜</p>
        </div>
      )}

      {!loading &&
        results.map((score) => (
          <ScoreCard key={score.id} score={score} onToggle={refresh} />
        ))}

      {results.length > 0 && (
        <p style={{ textAlign: 'center', fontSize: 12, color: '#A1887F', marginTop: 16 }}>
          共找到 {results.length} 条结果 · 数据来自 {sourceLabel}
        </p>
      )}
    </div>
  )
}
