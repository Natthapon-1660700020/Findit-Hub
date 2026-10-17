# FindIt — Smart Lost & Found Hub

A campus lost-and-found app for the Bangkok University community, developed for CS319 Internet Programming I, Mini Project 2.

## Run locally

```sh
npm install
npm run dev
```

Optional mock API, in a second terminal:

```sh
npm run server
```

The app uses `http://localhost:5000/items` by default. Set `VITE_API_URL` to a full items endpoint to use a different API.

If the API is unavailable, the app falls back to the 25 sample items and stores changes in the current browser's localStorage. These changes are local to that browser and do not synchronize with the API when it returns. Bookmarks also persist in the current browser.

## Pages

| Route | Features |
| --- | --- |
| `/` | Search, Lost/Found filters, categories, campus locations, Central Room A6 filter |
| `/items/:id` | Item details, contact, custody, bookmarks, resolve a report |
| `/saved` | Saved items, remove bookmarks, clear the collection |
| `/report` | Report an item, select a pick-up point, upload and preview a photo |
| `/about` | Project information, development team, data attribution |

## Design

The five pages share a light theme, indigo accents, white cards, a cube logo, and outline icons. All interface copy is English. The interface is sized at 125% using a shared root font size and rem-based typography, icons, controls, and spacing. Explore uses four columns on wide screens, three on tablets, two on smaller screens, and one on narrow phones. Responsive breakpoints account for the enlarged interface. The report form and item details stack on narrow screens. Missing or unavailable images use category illustrations; unavailable team portraits use initials.

Typography is enlarged independently of the layout: content and control text is 25% larger, headings are 10% larger, and captions have a 14-pixel minimum at the default font settings. Long card titles, labels, and footer actions wrap to accommodate the larger text.

Photos accept JPG, PNG, and WEBP up to 5 MB. The app reduces images to a maximum dimension of 800 pixels before saving them.

## Verification

```sh
npm run build
npm run verify:ui
```

The build checks TypeScript and produces `dist/`. UI smoke checks render all five pages, check empty and resolved states, and exercise bookmark persistence and offline create/resolve flows using isolated in-memory storage. They do not change `db.json` or any real browser's data. These checks do not replace visual checks or interaction testing in a browser.

## Stack

React, TypeScript, Vite, React Router v7 (pinned to 7.18.4), TanStack Query, Zustand, and Tailwind CSS. Sample photography comes from Unsplash. Mock API data is in `db.json`, with browser fallback data in `src/services/mockData.ts`.
