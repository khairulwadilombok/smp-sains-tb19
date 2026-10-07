'use strict';
// Semua konten utama sudah ada dalam HTML; JavaScript hanya menambah interaksi.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  const closeMenu = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); } });
  window.matchMedia('(min-width: 841px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
}
const search = document.querySelector('[data-search]');
const category = document.querySelector('[data-category]');
const items = [...document.querySelectorAll('[data-filter-item]')];
const results = document.querySelector('[data-results]');
const empty = document.querySelector('[data-empty]');
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('id');
if (search && items.length) {
  const params = new URLSearchParams(window.location.search);
  search.value = params.get('q') || '';
  if (category && [...category.options].some(o => o.value === params.get('kategori'))) category.value = params.get('kategori');
  function filter() {
    const query = normalize(search.value.trim()); const chosen = category ? category.value : '';
    let count = 0;
    for (const item of items) {
      const cats = JSON.parse(item.dataset.categories || '[]');
      const match = (!query || normalize(item.dataset.searchText || '').includes(query)) && (!chosen || cats.includes(chosen));
      item.hidden = !match; if (match) count++;
    }
    if (results) results.textContent = `${count} dari ${items.length} ${results.dataset.noun || 'artikel'} ditampilkan`;
    if (empty) empty.hidden = count !== 0;
  }
  search.addEventListener('input', filter);
  if (category) category.addEventListener('change', filter);
  const reset = document.querySelector('[data-reset]');
  if (reset) reset.addEventListener('click', () => { search.value = ''; if (category) category.value = ''; filter(); search.focus(); });
  filter();
}
const dialog = document.querySelector('#photo-dialog');
if (dialog) {
  const photo = dialog.querySelector('.lightbox-image');
  const title = dialog.querySelector('[data-photo-title]');
  let previousFocus;
  for (const button of document.querySelectorAll('[data-photo]')) {
    button.addEventListener('click', () => {
      previousFocus = button; photo.src = button.dataset.photo; photo.alt = button.dataset.title;
      title.textContent = button.dataset.title; dialog.showModal();
    });
  }
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { photo.removeAttribute('src'); previousFocus?.focus(); });
}
const share = document.querySelector('[data-copy-link]');
if (share) {
  share.addEventListener('click', async () => {
    const status = document.querySelector('[data-share-status]');
    // Gunakan alamat yang sedang dibuka, bukan domain lama saat masih preview lokal.
    try { await navigator.clipboard.writeText(location.href); status.textContent = 'Tautan berhasil disalin.'; }
    catch { status.textContent = 'Penyalinan otomatis tidak tersedia. Salin alamat halaman dari bilah alamat browser.'; }
  });
}
