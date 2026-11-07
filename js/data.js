/* Semua isi pelajaran ada di sini. Menambah kata, benda untuk dihitung, atau tempat
   petualangan cukup dengan menambah baris di daftar di bawah. */

/* ---------- data ---------- */
export const NUM=['nol','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan','sepuluh'];
export const PRAISE=['Hebat!','Pintar sekali!','Betul!','Yeay, benar!','Kamu pintar!'];
export const WORDS=[
  {e:'🍎',w:'Apel',l:'A'},{e:'🐔',w:'Ayam',l:'A'},{e:'🍇',w:'Anggur',l:'A'},
  {e:'🦆',w:'Bebek',l:'B'},{e:'⭐',w:'Bintang',l:'B'},{e:'🌙',w:'Bulan',l:'B'},{e:'🐻',w:'Beruang',l:'B'},
  {e:'🐑',w:'Domba',l:'D'},{e:'🐘',w:'Gajah',l:'G'},{e:'🐯',w:'Harimau',l:'H'},
  {e:'🐟',w:'Ikan',l:'I'},{e:'🍊',w:'Jeruk',l:'J'},{e:'🦒',w:'Jerapah',l:'J'},
  {e:'🐱',w:'Kucing',l:'K'},{e:'🐰',w:'Kelinci',l:'K'},{e:'🐢',w:'Kura-kura',l:'K'},{e:'🐴',w:'Kuda',l:'K'},{e:'🐸',w:'Katak',l:'K'},
  {e:'🥭',w:'Mangga',l:'M'},{e:'🐵',w:'Monyet',l:'M'},{e:'🚗',w:'Mobil',l:'M'},{e:'☀️',w:'Matahari',l:'M'},
  {e:'🍍',w:'Nanas',l:'N'},{e:'🍌',w:'Pisang',l:'P'},{e:'🌳',w:'Pohon',l:'P'},
  {e:'🏠',w:'Rumah',l:'R'},{e:'🐄',w:'Sapi',l:'S'},{e:'🦁',w:'Singa',l:'S'},{e:'🍉',w:'Semangka',l:'S'},
  {e:'🥒',w:'Timun',l:'T'},{e:'🐍',w:'Ular',l:'U'},{e:'🥕',w:'Wortel',l:'W'}
];
export const LETTERS=Array.from(new Set(WORDS.map(w=>w.l)));
export const COUNT_ITEMS=[
  {e:'🍎',n:'apel'},{e:'🍌',n:'pisang'},{e:'🐟',n:'ikan'},{e:'🦆',n:'bebek'},{e:'⭐',n:'bintang'},
  {e:'🦋',n:'kupu-kupu'},{e:'🐰',n:'kelinci'},{e:'🍊',n:'jeruk'},{e:'🌸',n:'bunga'}
];
export const STOPS=[
  {name:'Hutan',e:'🌳',bg:'#C9EDCF',type:'count',max:3},
  {name:'Sungai',e:'🌊',bg:'#C3E6F8',type:'letter'},
  {name:'Kebun Bunga',e:'🌻',bg:'#FFEBB0',type:'count',max:4},
  {name:'Bukit',e:'⛰️',bg:'#F8DCC9',type:'letter'},
  {name:'Kebun Timun',e:'🥒',bg:'#D7F2BE',type:'count',max:5}
];
