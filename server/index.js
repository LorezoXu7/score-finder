const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const distPath = path.resolve(path.join(__dirname, '..', 'dist'));
const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

app.use(cors());
app.use(express.json());

// Simple in-memory cache (5 minutes TTL)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() });
}

// 生产环境：提供前端静态文件
if (hasDist) {
  const distPath = path.resolve(path.join(__dirname, '..', 'dist'));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();

    let filePath = path.resolve(distPath, req.path === '/' ? 'index.html' : '.' + req.path);

    if (!path.extname(filePath)) {
      filePath = path.resolve(distPath, 'index.html');
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        res.sendFile(path.resolve(distPath, 'index.html'));
      }
    });
  });
}

// IMSLP Search API
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search query' });

  const cacheKey = `search:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    // Use IMSLP's MediaWiki API to search
    const response = await axios.get('https://imslp.org/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        srlimit: 20,
      },
      headers: {
        'User-Agent': 'ScoreFinder/1.0 (Music Score Search App)',
      },
      timeout: 15000,
    });

    const results = (response.data.query?.search || []).map((item) => ({
      id: item.pageid,
      title: item.title.replace(/ \(.*\)$/, ''),
      snippet: item.snippet.replace(/<[^>]*>/g, ''),
      url: `https://imslp.org/wiki/${encodeURIComponent(item.title)}`,
    }));

    setCache(cacheKey, results);
    res.json(results);
  } catch (err) {
    console.error('IMSLP search error:', err.message);
    // Return empty results on error so the frontend doesn't break
    res.json([]);
  }
});

// Get work details (download links from IMSLP page)
app.get('/api/work/:pageId', async (req, res) => {
  const { pageId } = req.params;
  const cacheKey = `work:${pageId}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    // Fetch page images (files) for this work
    const response = await axios.get('https://imslp.org/api.php', {
      params: {
        action: 'query',
        prop: 'images',
        pageids: pageId,
        format: 'json',
        imlimit: 50,
      },
      headers: {
        'User-Agent': 'ScoreFinder/1.0 (Music Score Search App)',
      },
      timeout: 15000,
    });

    const pages = response.data.query?.pages || {};
    const page = pages[pageId];
    const images = page?.images || [];

    // Get PDF files only
    const pdfFiles = images
      .filter((img) => img.title.toLowerCase().endsWith('.pdf'))
      .map((img) => ({
        name: img.title.replace('File:', '').replace('.pdf', ''),
        fileUrl: `https://imslp.org/wiki/Special:ImagefromIndex/${encodeURIComponent(img.title)}`,
      }));

    const workData = {
      pageId,
      pdfFiles,
      pageUrl: `https://imslp.org/wiki/?curid=${pageId}`,
    };

    setCache(cacheKey, workData);
    res.json(workData);
  } catch (err) {
    console.error('Work detail error:', err.message);
    res.json({ pageId, pdfFiles: [], pageUrl: '' });
  }
});

// Proxy PDF download
app.get('/api/download', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'ScoreFinder/1.0 (Music Score Search App)',
      },
      timeout: 60000,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    response.data.pipe(res);
  } catch (err) {
    console.error('Download error:', err.message);
    res.status(500).json({ error: 'Download failed' });
  }
});

// 国内乐谱搜索 — 生成百度/国内网站搜索链接
app.get('/api/search-domestic', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing search query' });

  const cacheKey = `domestic:${query}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  const encodedQuery = encodeURIComponent(query + ' 乐谱 PDF');

  // 国内常用乐谱网站
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

  // 也尝试用 DuckDuckGo 搜索中文乐谱PDF
  try {
    const ddgResponse = await axios.get('https://html.duckduckgo.com/html/', {
      params: { q: `${query} 乐谱 filetype:pdf` },
      headers: {
        'User-Agent': 'ScoreFinder/1.0 (Music Score Search App)',
      },
      timeout: 10000,
    });

    // 简单提取一些结果链接
    const linkMatches = ddgResponse.data.match(/<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([^<]*)</g) || [];
    const ddgResults = linkMatches.slice(0, 10).map((match, i) => {
      const href = match.match(/href="([^"]*)"/)?.[1] || '';
      const title = match.match(/>([^<]*)</)?.[1] || '未知标题';
      return {
        id: `ddg-${i}`,
        title: title.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
        snippet: '来自网络搜索的结果',
        url: href,
        source: '网络搜索',
      };
    });

    results.push(...ddgResults);
  } catch (err) {
    console.error('DuckDuckGo search error:', err.message);
  }

  setCache(cacheKey, results);
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`靠谱儿后端服务运行在 http://localhost:${PORT}`);
  if (hasDist) console.log('生产模式：已启用静态文件服务');
});
