/* Alat kecil yang dipakai di mana-mana. */

/* ---------- alat kecil ---------- */
export const $=s=>document.querySelector(s);
export const $$=s=>Array.prototype.slice.call(document.querySelectorAll(s));
export const rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
export const oneOf=a=>a[Math.floor(Math.random()*a.length)];
export const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t}return a};
export const h=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
export const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
