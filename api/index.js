const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data;
}
function setCache(key, data) { cache.set(key, { data, time: Date.now() }); }

// IMSLP Search
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  const cacheKey = `search:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);
  try {
    const resp = await axios.get('https://imslp.org/api.php', {
      params: { action: 'query', list: 'search', srsearch: query, format: 'json', srlimit: 20 },
      headers: { 'User-Agent': 'ScoreFinder/1.0' },
      timeout: 15000,
    });
    const results = (resp.data.query?.search || []).map((item) => ({
      id: item.pageid,
      title: item.title.replace(/ \(.*\)$/, ''),
      snippet: item.snippet.replace(/<[^>]*>/g, ''),
      url: `https://imslp.org/wiki/${encodeURIComponent(item.title)}`,
    }));
    setCache(cacheKey, results);
    res.json(results);
  } catch (err) {
    res.json([]);
  }
});

// Domestic search
app.get('/api/search-domestic', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  const cacheKey = `domestic:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

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
    url: site.baseUrl + encodeURIComponent(query),
    source: site.name,
  }));

  try {
    const ddgResp = await axios.get('https://html.duckduckgo.com/html/', {
      params: { q: `${query} 乐谱 filetype:pdf` },
      headers: { 'User-Agent': 'ScoreFinder/1.0' },
      timeout: 10000,
    });
    const linkMatches = ddgResp.data.match(/<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)</g) || [];
    linkMatches.slice(0, 10).forEach((match, i) => {
      const href = match.match(/href="([^"]*)"/)?.[1] || '';
      const title = match.match(/>([^<]*)</)?.[1] || '未知标题';
      results.push({
        id: `ddg-${i}`,
        title: title.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
        snippet: '来自网络搜索',
        url: href,
        source: '网络搜索',
      });
    });
  } catch (err) { /* ignore */ }

  setCache(cacheKey, results);
  res.json(results);
});

// === 同步：数据导出导入（无需服务器存储）===
// 同步功能已改为前端导出/导入 JSON 文件，不依赖后端

// PDF download proxy
app.get('/api/download', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing URL' });
  try {
    const response = await axios.get(url, {
      responseType: 'stream',
      headers: { 'User-Agent': 'ScoreFinder/1.0' },
      timeout: 60000,
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Download failed' });
  }
});

// Static file serving (for local dev compatibility)
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
