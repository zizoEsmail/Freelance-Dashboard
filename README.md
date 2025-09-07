# ⚡ Freelance Dashboard (HTML/CSS/JS/jQuery + DataTables + Toastr + Animate.css)

A clean, production-ready mini dashboard that uses the public **JSONPlaceholder** API to manage Users and Posts, with local enhancements.

## ✨ Features

- **Dashboard** with live counts for **Users, Posts, Comments**.
- **Users** page powered by **DataTables**:
  - View / Edit / Delete rows locally.
  - **⭐ Favorites** saved in **LocalStorage**.
- **Posts** page:
  - **Live search** (DataTables built-in).
  - **Add / Edit / Delete** posts **locally** (no API writes).
  - **View Comments** per post (fetched live from API).
- **Toastr** notifications for every action.
- **Loader** overlay during requests.
- **Light/Dark Mode** toggle saved to LocalStorage.
- **No bundlers**—just static files + CDNs.

## 🛠️ Tech Stack

- **HTML, CSS** (custom, CSS variables for theming)
- **Animate.css** (subtle animations on dashboard)
- **JavaScript (ES6)** + **jQuery**
- **DataTables** for fast tables + search + paging
- **Toastr** for notifications
- **JSONPlaceholder API** for demo data

## 📂 Structure

```
/assets
  /css
    styles.css
  /js
    app.js         # shared utils (theme, loader, fetch, modals, toastr)
    dashboard.js   # dashboard counts
    users.js       # users table, modal, favorites
    posts.js       # posts table, local CRUD, comments
index.html         # Dashboard
users.html         # Users table
posts.html         # Posts table
```

## ▶️ How to Run

1. **Download** the folder or ZIP and extract it.
2. Open **`index.html`** in your browser—no server required.
   - If you face CORS issues on some setups, use a tiny static server:
     - Python 3: `python -m http.server 8080` then open `http://localhost:8080`.
3. Navigate between **Dashboard / Users / Posts** from the header.

## 🔗 APIs

- Users → `https://jsonplaceholder.typicode.com/users`
- Posts → `https://jsonplaceholder.typicode.com/posts`
- Comments → `https://jsonplaceholder.typicode.com/comments?postId={id}`

## 🧪 Notes

- **Edits/Deletes** are **local only** (no server write).
- **Favorites** and **local Posts** persist via **LocalStorage**.
- The **theme** respects OS preference on first load, then your toggle choice.

## 📘 Libraries (via CDN)

- jQuery 3.7.x
- DataTables 1.13.x
- Toastr 2.1.x
- Animate.css 4.x

---

Made with care for a smooth UX and clean code.
