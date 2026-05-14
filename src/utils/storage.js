// 本地存储工具 — 管理收藏、下载历史、标签

const KEYS = {
  FAVORITES: 'score_favorites',
  HISTORY: 'score_history',
  TAGS: 'score_tags',
}

function read(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

// 收藏
export function getFavorites() {
  return read(KEYS.FAVORITES)
}

export function addFavorite(score) {
  const list = read(KEYS.FAVORITES)
  const exists = list.find((s) => s.id === score.id)
  if (!exists) {
    list.unshift({ ...score, favoritedAt: Date.now() })
    write(KEYS.FAVORITES, list)
  }
  return list
}

export function removeFavorite(id) {
  const list = read(KEYS.FAVORITES).filter((s) => s.id !== id)
  write(KEYS.FAVORITES, list)
  return list
}

export function isFavorite(id) {
  return read(KEYS.FAVORITES).some((s) => s.id === id)
}

// 下载历史
export function getHistory() {
  return read(KEYS.HISTORY)
}

export function addHistory(score) {
  const list = read(KEYS.HISTORY)
  const idx = list.findIndex((s) => s.id === score.id)
  if (idx >= 0) list.splice(idx, 1)
  list.unshift({ ...score, downloadedAt: Date.now() })
  // 最多保留50条
  if (list.length > 50) list.length = 50
  write(KEYS.HISTORY, list)
  return list
}

// 标签
export function getTags() {
  return read(KEYS.TAGS, {})
}

export function addTag(scoreId, tag) {
  const tags = read(KEYS.TAGS, {})
  if (!tags[scoreId]) tags[scoreId] = []
  if (!tags[scoreId].includes(tag)) {
    tags[scoreId].push(tag)
    write(KEYS.TAGS, tags)
  }
  return tags
}

export function removeTag(scoreId, tag) {
  const tags = read(KEYS.TAGS, {})
  if (tags[scoreId]) {
    tags[scoreId] = tags[scoreId].filter((t) => t !== tag)
    write(KEYS.TAGS, tags)
  }
  return tags
}

export function getTagsForScore(scoreId) {
  const tags = read(KEYS.TAGS, {})
  return tags[scoreId] || []
}
