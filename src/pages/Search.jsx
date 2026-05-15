import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ScoreCard from '../components/ScoreCard'

function imslpResults(query) {
  const q = encodeURIComponent(query)
  return [{
    id: 'imslp', title: `在 IMSLP 搜索「${query}」`,
    snippet: '国际乐谱图书馆计划 · 全球最大免费乐谱资源库',
    url: `https://imslp.org/wiki/Special:Search?search=${q}`,
    source: 'IMSLP',
  }]
}

function globalResults(query) {
  const q = encodeURIComponent(query)
  return [
    { id: 'imslp', title: `在 IMSLP 搜索「${query}」`, snippet: '国际乐谱图书馆计划', url: `https://imslp.org/wiki/Special:Search?search=${q}`, source: 'IMSLP' },
    { id: 'cpdl', title: `在 CPDL 搜索「${query}」`, snippet: '合唱公共领域图书馆 · 声乐/合唱作品', url: `https://www.cpdl.org/wiki/index.php?search=${q}`, source: 'CPDL' },
    { id: 'musescore', title: `在 MuseScore 搜索「${query}」`, snippet: '全球最大社区乐谱平台', url: `https://musescore.com/sheetmusic?text=${q}`, source: 'MuseScore' },
    { id: 'mutopia', title: `在 Mutopia 搜索「${query}」`, snippet: '自由版权古典乐谱 · PDF/MIDI', url: `https://www.mutopiaproject.org/cgibin/make-table.cgi?searchingfor=${q}`, source: 'Mutopia' },
    { id: '8notes', title: `在 8notes 搜索「${query}」`, snippet: '免费古典乐谱 · 按难度分级', url: `https://www.8notes.com/${q}/`, source: '8notes' },
    { id: 'freescores', title: `在 Free-scores 搜索「${query}」`, snippet: '免费乐谱下载 · 多种编制', url: `https://www.free-scores.com/search_uk.php?search=${q}`, source: 'Free-scores' },
  ]
}

function domesticResults(query) {
  const q = encodeURIComponent(query)
  return [
    { id: 'baidu', title: `在百度搜索「${query} 乐谱 PDF」`, snippet: '中文搜索 · 覆盖国内乐谱资源', url: `https://www.baidu.com/s?wd=${encodeURIComponent(query + ' 乐谱 PDF')}`, source: '百度' },
    { id: 'tan8', title: `在弹琴吧搜索「${query}」`, snippet: '钢琴谱为主的国内乐谱社区', url: `https://www.tan8.com/search?key=${q}`, source: '弹琴吧' },
    { id: 'gangqinpu', title: `在虫虫钢琴搜索「${query}」`, snippet: '国内知名钢琴谱网站', url: `https://www.gangqinpu.com/search.html?keyword=${q}`, source: '虫虫钢琴' },
    { id: 'qupu123', title: `在曲谱网搜索「${query}」`, snippet: '综合曲谱资源', url: `http://www.qupu123.com/search?keyword=${q}`, source: '曲谱网' },
    { id: 'zhaopu', title: `在找谱网搜索「${query}」`, snippet: '乐谱检索网站', url: `http://www.zhaopu123.com/search?key=${q}`, source: '找谱网' },
  ]
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [source, setSource] = useState('imslp')

  const results = useMemo(() => {
    if (!query.trim()) return []
    switch (source) {
      case 'global': return globalResults(query)
      case 'domestic': return domesticResults(query)
      default: return imslpResults(query)
    }
  }, [query, source])

  const labels = { imslp: 'IMSLP', global: '全球资源', domestic: '国内资源' }

  return (
    <div className="page">
      <div style={{ padding: '8px 0 16px' }}>
        <SearchBar initial={query} />
      </div>

      {query && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {['imslp', 'global', 'domestic'].map((s) => (
            <button key={s} onClick={() => setSource(s)}
              className={source === s ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>
              {labels[s]}
            </button>
          ))}
        </div>
      )}

      {!query && (
        <div className="empty-state">
          <div className="icon">&#x1F50D;</div>
          <h3>输入关键词开始搜索</h3>
          <p>搜索后点击链接即可跳转到对应网站下载乐谱</p>
        </div>
      )}

      {results.map((score) => (
        <ScoreCard key={score.id} score={score} onToggle={() => {}} />
      ))}

      {results.length > 0 && (
        <p style={{ textAlign: 'center', fontSize: 12, color: '#9B8A7A', marginTop: 16 }}>
          {results.length} 个搜索入口 · 数据来自 {labels[source]}
        </p>
      )}
    </div>
  )
}
