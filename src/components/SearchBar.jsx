import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar({ large = false, initial = '' }) {
  const [query, setQuery] = useState(initial)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          className="input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索作曲家或作品名称，如 Don Giovanni..."
          style={{
            paddingRight: 56,
            fontSize: large ? 18 : 16,
            padding: large ? '14px 56px 14px 18px' : undefined,
          }}
          autoFocus={large}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            position: 'absolute',
            right: 6,
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '8px 14px',
            fontSize: 14,
          }}
        >
          搜索
        </button>
      </div>
    </form>
  )
}
