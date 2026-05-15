import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ScoreCard from '../components/ScoreCard'

function imslpResults(query) {
  const q = encodeURIComponent(query)
  return [
    { id: 'imslp', title: `在 IMSLP 搜索「${query}」`, snippet: '国际乐谱图书馆 · 全球最大免费古典乐谱库', url: `https://imslp.org/wiki/Special:Search?search=${q}`, source: 'IMSLP' },
    { id: 'imslp-cat', title: `在 IMSLP 按分类浏览「${query}」`, snippet: '按作曲家/时期/体裁分类查找', url: `https://imslp.org/wiki/Category:${q}`, source: 'IMSLP' },
  ]
}

function globalResults(query) {
  const q = encodeURIComponent(query)
  return [
    { id: 'imslp', title: `在 IMSLP 搜索「${query}」`, snippet: '国际乐谱图书馆 · 全球最大免费古典乐谱库', url: `https://imslp.org/wiki/Special:Search?search=${q}`, source: 'IMSLP' },
    { id: 'cpdl', title: `在 CPDL 搜索「${query}」`, snippet: '合唱公共领域图书馆 · 声乐/合唱作品', url: `https://www.cpdl.org/wiki/index.php?search=${q}`, source: 'CPDL' },
    { id: 'musescore', title: `在 MuseScore 搜索「${query}」`, snippet: '全球最大社区乐谱平台 · 海量原创与改编', url: `https://musescore.com/sheetmusic?text=${q}`, source: 'MuseScore' },
    { id: 'mutopia', title: `在 Mutopia 搜索「${query}」`, snippet: '自由版权古典乐谱 · PDF + MIDI 下载', url: `https://www.mutopiaproject.org/cgibin/make-table.cgi?searchingfor=${q}`, source: 'Mutopia' },
    { id: '8notes', title: `在 8notes 搜索「${query}」`, snippet: '免费古典乐谱 · 按难度分级 · 含音频', url: `https://www.8notes.com/${q}/`, source: '8notes' },
    { id: 'freescores', title: `在 Free-scores 搜索「${query}」`, snippet: '免费乐谱下载 · 多种乐器编制', url: `https://www.free-scores.com/search_uk.php?search=${q}`, source: 'Free-scores' },
    { id: 'scorser', title: `在 Scorser 搜索「${query}」`, snippet: '乐谱搜索引擎 · 聚合多个乐谱网站', url: `https://www.scorser.com/Search?q=${q}`, source: 'Scorser' },
    { id: 'sheetmusicplus', title: `在 Sheet Music Plus 搜索「${query}」`, snippet: '全球最大乐谱商店 · 含免费乐谱', url: `https://www.sheetmusicplus.com/search?q=${q}`, source: 'Sheet Music Plus' },
    { id: 'musicnotes', title: `在 Musicnotes 搜索「${query}」`, snippet: '专业乐谱平台 · 含免费专区', url: `https://www.musicnotes.com/search/?q=${q}`, source: 'Musicnotes' },
    { id: 'scoreexchange', title: `在 Score Exchange 搜索「${query}」`, snippet: '作曲家社区乐谱交易平台', url: `https://www.scoreexchange.com/search/?q=${q}`, source: 'Score Exchange' },
    { id: 'pianotte', title: `在 Pianotte 搜索「${query}」`, snippet: '古典钢琴谱专题 · 按作曲家分类', url: `https://www.pianotte.sk/search/?q=${q}`, source: 'Pianotte' },
    { id: 'flutetunes', title: `在 Flute Tunes 搜索「${query}」`, snippet: '免费长笛/器乐谱 · PDF 下载', url: `https://www.flutetunes.com/search/?q=${q}`, source: 'Flute Tunes' },
  ]
}

function domesticResults(query) {
  const q = encodeURIComponent(query)
  return [
    { id: 'baidu', title: `在百度搜索「${query} 乐谱 PDF」`, snippet: '中文综合搜索 · 覆盖国内乐谱资源', url: `https://www.baidu.com/s?wd=${encodeURIComponent(query + ' 乐谱 PDF')}`, source: '百度' },
    { id: 'tan8', title: `在弹琴吧搜索「${query}」`, snippet: '国内最大钢琴谱社区 · 含简谱五线谱', url: `https://www.tan8.com/search?key=${q}`, source: '弹琴吧' },
    { id: 'gangqinpu', title: `在虫虫钢琴搜索「${query}」`, snippet: '国内老牌钢琴谱网站 · 海量流行/古典谱', url: `https://www.gangqinpu.com/search.html?keyword=${q}`, source: '虫虫钢琴' },
    { id: 'qupu123', title: `在曲谱网搜索「${query}」`, snippet: '综合曲谱资源站', url: `http://www.qupu123.com/search?keyword=${q}`, source: '曲谱网' },
    { id: 'zhaopu', title: `在找谱网搜索「${query}」`, snippet: '乐谱检索站', url: `http://www.zhaopu123.com/search?key=${q}`, source: '找谱网' },
    { id: 'sooopu', title: `在搜谱网搜索「${query}」`, snippet: '国内乐谱搜索 · 吉他谱/钢琴谱/简谱', url: `http://www.sooopu.com/search/?q=${q}`, source: '搜谱网' },
    { id: 'yueqixuexi', title: `在乐器学习网搜索「${query}」`, snippet: '乐器教程与乐谱资源', url: `http://www.yueqixuexi.com/search/?q=${q}`, source: '乐器学习网' },
    { id: 'jitapu', title: `在吉他谱网搜索「${query}」`, snippet: '中文吉他谱资源站', url: `https://www.jitapu.com/search?q=${q}`, source: '吉他谱网' },
    { id: 'docin', title: `在豆丁网搜索「${query} 乐谱」`, snippet: '文档分享平台 · 含大量乐谱PDF', url: `https://www.docin.com/search.do?searchcat=2&searchType_banner=p&nkey=${q}`, source: '豆丁网' },
    { id: 'doc88', title: `在道客巴巴搜索「${query} 乐谱」`, snippet: '文档分享平台 · 乐谱资料丰富', url: `https://www.doc88.com/search?keyword=${q}`, source: '道客巴巴' },
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
