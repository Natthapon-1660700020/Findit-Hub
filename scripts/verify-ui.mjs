import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createServer } from 'vite';

// Exercise the real page components and local data flow without a browser.
// All writes are isolated to this process's in-memory storage.
const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key),
};
globalThis.window = { localStorage: globalThis.localStorage };
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => { throw new Error('Offline verification'); };
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const clients = [];
const routers = [];

try {
  const { itemService } = await vite.ssrLoadModule('/src/services/itemService.ts');
  const { useSavedStore } = await vite.ssrLoadModule('/src/store/useSavedStore.ts');
  const { formatDate } = await vite.ssrLoadModule('/src/utils/formatDate.ts');
  const { RootLayout } = await vite.ssrLoadModule('/src/layouts/RootLayout.tsx');
  const modules = await Promise.all(['Explore', 'ItemDetail', 'SavedItems', 'ReportItem', 'About'].map(name => vite.ssrLoadModule(`/src/pages/${name}Page.tsx`)));
  const [Explore, Detail, Saved, Report, About] = modules.map((module, i) => module[['ExplorePage', 'ItemDetailPage', 'SavedItemsPage', 'ReportItemPage', 'AboutPage'][i]]);
  const seed = await itemService.getAllItems();
  assert.equal(seed.length, 25);
  assert.equal(formatDate('2026-03-28'), 'Mar 28, 2026');

  async function render(path, { items = seed, item, state } = {}) {
    // SSR reads the initial snapshot; use this case's current saved IDs.
    useSavedStore.getInitialState().savedIds = [...useSavedStore.getState().savedIds];
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
    clients.push(queryClient);
    queryClient.setQueryData(['items'], items);
    if (item) queryClient.setQueryData(['items', item.id], item);
    const router = createMemoryRouter([{ element: React.createElement(RootLayout), children: [
      { path: '/', element: React.createElement(Explore) },
      { path: '/items/:id', element: React.createElement(Detail) },
      { path: '/saved', element: React.createElement(Saved) },
      { path: '/report', element: React.createElement(Report) },
      { path: '/about', element: React.createElement(About) },
    ] }], { initialEntries: [{ pathname: path, state }] });
    routers.push(router);
    assert.equal(router.state.errors, null, `Route failed: ${path}`);
    assert.equal(router.state.location.pathname, path);
    if (path.startsWith('/items/')) assert.equal(router.state.matches.at(-1).params.id, path.split('/').at(-1));
    return renderToStaticMarkup(React.createElement(QueryClientProvider, { client: queryClient }, React.createElement(RouterProvider, { router })));
  }

  const explore = await render('/');
  assert.equal((explore.match(/class="item-card"/g) || []).length, 25);
  assert.match(explore, /Filter by category/);
  assert.match(explore, /Filter by campus location/);
  assert.match(explore, /Central Room/);
  assert.match(await render('/', { items: [] }), /No items found/);
  assert.match(await render('/', { state: { reportCreated: true } }), /Your report is published/);
  console.log('PASS Explore: 25 cards, filters, empty state, report confirmation');

  const detail = await render('/items/1', { item: seed[0] });
  assert.match(detail, /Brown Leather Wallet/);
  assert.match(detail, /Contact &amp; verification/);
  assert.match(detail, /Mark as resolved/);
  assert.match(detail, /aria-labelledby="resolve-title"/);
  assert.match(detail, /Building A6/);
  assert.match(await render('/items/4', { item: seed[3] }), /category-placeholder/);
  const resolvedItem = seed.find(item => item.status === 'Resolved');
  const resolvedMarkup = await render('/items/' + resolvedItem.id, { item: resolvedItem });
  assert.match(resolvedMarkup, /This report is resolved/);
  assert.doesNotMatch(resolvedMarkup, />Mark as resolved</);
  console.log('PASS Details: contact, A6, missing-image fallback, resolve dialog, resolved state');

  assert.match(await render('/saved'), /Your collection starts here/);
  useSavedStore.getState().toggleSave('1');
  useSavedStore.getState().toggleSave('2');
  const saved = await render('/saved');
  assert.equal((saved.match(/class="item-card"/g) || []).length, 2);
  assert.match(saved, /Unsave Brown Leather Wallet/);
  assert.match(saved, /Clear all saved/);
  assert.ok(JSON.parse(storage.get('findit-saved-items')).state.savedIds.includes('1'));
  useSavedStore.getState().toggleSave('2');
  assert.equal(useSavedStore.getState().savedIds.length, 1);
  useSavedStore.getState().clearAllSaved();
  assert.match(await render('/saved'), /Your collection starts here/);
  console.log('PASS Saved items: save, persisted IDs, unsave, clear all, empty state');

  const form = await render('/report');
  for (const id of ['item-name', 'category', 'location', 'date', 'description', 'contact', 'photo']) assert.ok(form.includes('id="' + id + '"'), 'Missing report field: ' + id);
  assert.match(form, /Up to 5 MB/);
  assert.match(form, /Submit report/);
  assert.match(form, /accept="image\/jpeg,image\/png,image\/webp"/);
  const created = await itemService.createItem({ title: 'Verification item', type: 'Found', category: 'Keys', description: 'Isolated verification report', location: 'Building A6', date: '2026-10-17', custody: 'Central Lost & Found Room (Building A6 First Floor)', contact: 'Verification only' });
  assert.equal(created.status, 'Active');
  assert.equal((await itemService.getItemById(created.id)).title, 'Verification item');
  await itemService.resolveItem({ id: created.id, note: 'Returned during isolated verification' });
  assert.equal((await itemService.getItemById(created.id)).status, 'Resolved');
  assert.equal((await itemService.getAllItems()).length, 26);
  console.log('PASS Report data flow: create, reload, resolve, persisted local data');

  const about = await render('/about');
  for (const name of ['Natthapon Potinam', 'Kitsapa Ainpueai', 'Chisanupong Inlin']) assert.ok(about.includes(name));
  assert.match(about, /JSON Server/);
  assert.match(about, /Unsplash/);
  for (const markup of [explore, detail, saved, form, about]) assert.doesNotMatch(markup, /[\u0E00-\u0E7F]/, 'Rendered UI must be English');
  console.log('PASS About: original team, attribution; all five rendered pages use English');
  console.log('All UI smoke checks passed. Visual browser verification is separate.');
} finally {
  clients.forEach(client => client.clear());
  routers.forEach(router => router.dispose());
  globalThis.fetch = originalFetch;
  await vite.close();
}
