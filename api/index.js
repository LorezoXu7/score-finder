const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key) { const e = cache.get(key); if (!e || Date.now() - e.time > CACHE_TTL) { cache.delete(key); return null; } return e.data; }
function setCache(key, data) { cache.set(key, { data, time: Date.now() }); }

const UA = 'ScoreFinder/1.0 (Music Search App)';

// ============ IMSLP 搜索（含 PDF 直链） ============
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  const cacheKey = `search:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const resp = await axios.get('https://imslp.org/api.php', {
      params: { action: 'query', list: 'search', srsearch: query, format: 'json', srlimit: 15 },
      headers: { 'User-Agent': UA }, timeout: 15000,
    });
    const items = resp.data.query?.search || [];

    // 并发获取每个作品的 PDF 链接
    const results = await Promise.all(items.map(async (item) => {
      const pdfUrl = await findIMSLPpdf(item.pageid);
      return {
        id: item.pageid,
        title: item.title.replace(/ \(.*\)$/, ''),
        snippet: item.snippet.replace(/<[^>]*>/g, ''),
        url: `https://imslp.org/wiki/${encodeURIComponent(item.title)}`,
        pdfUrl, // 直链 PDF，null 表示未找到
        source: 'IMSLP',
      };
    }));

    setCache(cacheKey, results);
    res.json(results);
  } catch (err) {
    res.json([]);
  }
});

// 查找 IMSLP 作品的第一个 PDF 文件链接
async function findIMSLPpdf(pageId) {
  const cacheKey = `pdf:${pageId}`;
  const cached = getCached(cacheKey);
  if (cached !== null) return cached;

  try {
    const resp = await axios.get('https://imslp.org/api.php', {
      params: { action: 'query', prop: 'images', pageids: pageId, format: 'json', imlimit: 20 },
      headers: { 'User-Agent': UA }, timeout: 10000,
    });
    const page = (resp.data.query?.pages || {})[pageId];
    const images = page?.images || [];
    const pdf = images.find((img) => img.title.toLowerCase().endsWith('.pdf'));
    const result = pdf ? `https://imslp.org/wiki/Special:ImagefromIndex/${encodeURIComponent(pdf.title)}` : null;
    setCache(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}

// ============ 全球免费乐谱源搜索 ============
app.get('/api/search-global', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  const cacheKey = `global:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  const q = encodeURIComponent(query);
  const results = [];

  // CPDL (ChoralWiki)
  try {
    const cpdlResp = await axios.get('https://www.cpdl.org/wiki/api.php', {
      params: { action: 'query', list: 'search', srsearch: query, format: 'json', srlimit: 10 },
      headers: { 'User-Agent': UA }, timeout: 10000,
    });
    (cpdlResp.data.query?.search || []).forEach((item) => {
      results.push({
        id: `cpdl-${item.pageid}`,
        title: item.title.replace(/ \(.*\)$/, ''),
        snippet: (item.snippet || '').replace(/<[^>]*>/g, ''),
        url: `https://www.cpdl.org/wiki/index.php/${encodeURIComponent(item.title)}`,
        pdfUrl: null,
        source: 'CPDL',
      });
    });
  } catch (err) { /* ignore */ }

  // MuseScore
  results.push({
    id: `ms-${query}`,
    title: `在 MuseScore 搜索「${query}」`,
    snippet: '全球最大的社区乐谱平台，大量免费乐谱',
    url: `https://musescore.com/sheetmusic?text=${q}`,
    pdfUrl: null,
    source: 'MuseScore',
  });

  // Mutopia Project
  results.push({
    id: `mut-${query}`,
    title: `在 Mutopia 搜索「${query}」`,
    snippet: '自由版权古典乐谱，支持 PDF/MIDI 下载',
    url: `https://www.mutopiaproject.org/cgibin/make-table.cgi?searchingfor=${q}`,
    pdfUrl: null,
    source: 'Mutopia',
  });

  // 8notes
  results.push({
    id: `8n-${query}`,
    title: `在 8notes 搜索「${query}」`,
    snippet: '免费古典乐谱，按难度分级',
    url: `https://www.8notes.com/${q}/`,
    pdfUrl: null,
    source: '8notes',
  });

  // Free-scores.com
  results.push({
    id: `fs-${query}`,
    title: `在 Free-scores 搜索「${query}」`,
    snippet: '免费乐谱下载，多种乐器编制',
    url: `https://www.free-scores.com/search_uk.php?search=${q}`,
    pdfUrl: null,
    source: 'Free-scores',
  });

  setCache(cacheKey, results);
  res.json(results);
});

// ============ 国内乐谱搜索 ============
app.get('/api/search-domestic', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  const cacheKey = `domestic:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  const q = encodeURIComponent(query);
  const domesticSites = [
    { name: '百度搜索', baseUrl: 'https://www.baidu.com/s?wd=' },
    { name: '弹琴吧', baseUrl: 'https://www.tan8.com/search?key=' },
    { name: '虫虫钢琴', baseUrl: 'https://www.gangqinpu.com/search.html?keyword=' },
    { name: '曲谱网', baseUrl: 'http://www.qupu123.com/search?keyword=' },
    { name: '找谱网', baseUrl: 'http://www.zhaopu123.com/search?key=' },
  ];
  const results = domesticSites.map((site, index) => ({
    id: `domestic-${index}`,
    title: `在「${site.name}」搜索「${query}」`,
    snippet: `点击链接在${site.name}中查找 ${query} 相关乐谱`,
    url: site.baseUrl + q,
    pdfUrl: null,
    source: site.name,
  }));

  try {
    const ddgResp = await axios.get('https://html.duckduckgo.com/html/', {
      params: { q: `${query} 乐谱 filetype:pdf` },
      headers: { 'User-Agent': UA }, timeout: 10000,
    });
    const m = ddgResp.data.match(/<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)</g) || [];
    m.slice(0, 8).forEach((match, i) => {
      const href = match.match(/href="([^"]*)"/)?.[1] || '';
      const title = match.match(/>([^<]*)</)?.[1] || '未知标题';
      results.push({
        id: `ddg-${i}`,
        title: title.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
        snippet: '来自网络搜索',
        url: href, pdfUrl: null, source: '网络搜索',
      });
    });
  } catch (err) { /* ignore */ }

  setCache(cacheKey, results);
  res.json(results);
});

// Static file serving (local dev)
const distPath = path.resolve(path.join(__dirname, '..', 'dist'));
if (fs.existsSync(path.join(distPath, 'index.html'))) {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    let fp = path.resolve(distPath, req.path === '/' ? 'index.html' : '.' + req.path);
    if (!path.extname(fp)) fp = path.resolve(distPath, 'index.html');
    res.sendFile(fp, (err) => { if (err) res.sendFile(path.resolve(distPath, 'index.html')); });
  });
}

module.exports = app;
