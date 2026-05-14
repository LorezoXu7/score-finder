// 作曲家分类数据

export const periods = [
  {
    key: 'baroque',
    name: '巴洛克时期',
    years: '1600-1750',
    composers: [
      { name: '巴赫 (J.S. Bach)', query: 'Bach' },
      { name: '亨德尔 (Handel)', query: 'Handel' },
      { name: '维瓦尔第 (Vivaldi)', query: 'Vivaldi' },
      { name: '斯卡拉蒂 (Scarlatti)', query: 'Scarlatti' },
      { name: '蒙特威尔第 (Monteverdi)', query: 'Monteverdi' },
    ],
  },
  {
    key: 'classical',
    name: '古典时期',
    years: '1750-1820',
    composers: [
      { name: '莫扎特 (Mozart)', query: 'Mozart' },
      { name: '贝多芬 (Beethoven)', query: 'Beethoven' },
      { name: '海顿 (Haydn)', query: 'Haydn' },
      { name: '舒伯特 (Schubert)', query: 'Schubert' },
      { name: '格鲁克 (Gluck)', query: 'Gluck' },
    ],
  },
  {
    key: 'belcanto',
    name: '美声时期 (Bel Canto)',
    years: '1810-1850',
    composers: [
      { name: '罗西尼 (Rossini)', query: 'Rossini' },
      { name: '贝里尼 (Bellini)', query: 'Bellini' },
      { name: '多尼采蒂 (Donizetti)', query: 'Donizetti' },
    ],
  },
  {
    key: 'romantic',
    name: '浪漫时期',
    years: '1820-1900',
    composers: [
      { name: '肖邦 (Chopin)', query: 'Chopin' },
      { name: '李斯特 (Liszt)', query: 'Liszt' },
      { name: '舒曼 (Schumann)', query: 'Schumann' },
      { name: '勃拉姆斯 (Brahms)', query: 'Brahms' },
      { name: '柴可夫斯基 (Tchaikovsky)', query: 'Tchaikovsky' },
      { name: '瓦格纳 (Wagner)', query: 'Wagner' },
      { name: '威尔第 (Verdi)', query: 'Verdi' },
      { name: '普契尼 (Puccini)', query: 'Puccini' },
      { name: '德彪西 (Debussy)', query: 'Debussy' },
      { name: '拉赫玛尼诺夫 (Rachmaninoff)', query: 'Rachmaninoff' },
    ],
  },
  {
    key: 'modern',
    name: '近现代',
    years: '1900至今',
    composers: [
      { name: '斯特拉文斯基 (Stravinsky)', query: 'Stravinsky' },
      { name: '拉威尔 (Ravel)', query: 'Ravel' },
      { name: '普罗科菲耶夫 (Prokofiev)', query: 'Prokofiev' },
      { name: '肖斯塔科维奇 (Shostakovich)', query: 'Shostakovich' },
      { name: '巴托克 (Bartok)', query: 'Bartok' },
      { name: '格什温 (Gershwin)', query: 'Gershwin' },
    ],
  },
]

export const categories = [
  { key: 'opera', name: '歌剧', icon: '🎭', query: 'opera' },
  { key: 'symphony', name: '交响乐', icon: '🎻', query: 'symphony' },
  { key: 'concerto', name: '协奏曲', icon: '🎹', query: 'concerto' },
  { key: 'chamber', name: '室内乐', icon: '🎼', query: 'chamber music' },
  { key: 'solo-piano', name: '钢琴独奏', icon: '🎹', query: 'piano solo' },
  { key: 'solo-violin', name: '小提琴独奏', icon: '🎻', query: 'violin sonata' },
  { key: 'lied', name: '艺术歌曲', icon: '🎤', query: 'lieder' },
  { key: 'choral', name: '合唱作品', icon: '🎵', query: 'choral' },
]
