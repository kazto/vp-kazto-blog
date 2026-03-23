export const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    display: flex;
    min-height: 100vh;
    background: #f8fafc;
    color: #1e293b;
  }

  /* Sidebar */
  .sidebar {
    width: 300px;
    min-width: 300px;
    background: #0f172a;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar::-webkit-scrollbar { width: 4px; }
  .sidebar::-webkit-scrollbar-track { background: transparent; }
  .sidebar::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }

  .site-title {
    padding: 28px 24px 20px;
    border-bottom: 1px solid #1e293b;
  }

  .site-title a {
    color: #f1f5f9;
    text-decoration: none;
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .post-list {
    list-style: none;
    padding: 8px 0 24px;
  }

  .post-list li { display: flex; flex-direction: column; }

  .post-list li a {
    padding: 8px 24px 2px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.8125rem;
    line-height: 1.5;
    transition: color 0.15s;
  }

  .post-list li a:hover { color: #e2e8f0; }

  .post-list li time {
    padding: 0 24px 6px;
    font-size: 0.6875rem;
    color: #475569;
  }

  .post-list li.active a {
    color: #38bdf8;
    font-weight: 600;
  }

  .post-list li.active time { color: #7dd3fc; }

  /* Content area */
  .content-wrapper {
    margin-left: 300px;
    flex: 1;
    padding: 56px 64px;
    max-width: calc(300px + 860px);
    width: 100%;
  }

  /* Hamburger button (hidden on desktop) */
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    color: #f1f5f9;
    font-size: 1.5rem;
    line-height: 1;
  }

  /* Responsive: mobile */
  @media (max-width: 768px) {
    body {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      min-width: unset;
      height: auto;
      position: relative;
      overflow: hidden;
    }

    .site-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
    }

    .menu-toggle {
      display: block;
    }

    .post-list {
      display: none;
      padding: 0 0 16px;
    }

    .sidebar.open .post-list {
      display: block;
    }

    .content-wrapper {
      margin-left: 0;
      padding: 32px 20px;
      max-width: 100%;
    }

    .post-header h1 {
      font-size: 1.5rem;
    }
  }

  .post-header { margin-bottom: 40px; }

  .post-header h1 {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1.3;
    margin-bottom: 10px;
  }

  .post-header time {
    font-size: 0.875rem;
    color: #64748b;
  }

  article {
    font-size: 1rem;
    line-height: 1.85;
    color: #334155;
  }

  article p { margin-bottom: 1.25em; }

  article h2 {
    font-size: 1.375rem;
    font-weight: 700;
    color: #0f172a;
    margin: 2em 0 0.75em;
    letter-spacing: -0.02em;
  }

  article h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 1.5em 0 0.5em;
  }

  article ul, article ol {
    padding-left: 1.75em;
    margin-bottom: 1.25em;
  }

  article li { margin-bottom: 0.4em; }

  article a { color: #0ea5e9; text-decoration: none; }
  article a:hover { text-decoration: underline; }

  article img {
    max-width: 95%;
    height: auto;
    display: block;
    margin: 1.5em 0;
    border-radius: 8px;
  }

  article pre {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    overflow-x: auto;
    margin-bottom: 1.25em;
    font-size: 0.875em;
  }

  article code {
    font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
    font-size: 0.875em;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 0.1em 0.4em;
  }

  article pre code {
    background: none;
    border: none;
    padding: 0;
  }

  article blockquote {
    border-left: 3px solid #38bdf8;
    padding: 4px 0 4px 20px;
    margin: 0 0 1.25em;
    color: #64748b;
    font-style: italic;
  }

  article hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 2em 0;
  }

  .comment-links {
    margin-top: 3em;
    padding-top: 1.5em;
    border-top: 1px solid #e2e8f0;
    font-size: 0.875rem;
    color: #64748b;
  }

  .comment-links a {
    color: #0ea5e9;
    text-decoration: none;
  }

  .comment-links a:hover {
    text-decoration: underline;
  }

  .copyright {
    font-size: 0.875rem;
    color: #64748b;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
  }

  .tag {
    display: inline-block;
    padding: 2px 10px;
    background: #e0f2fe;
    color: #0369a1;
    border-radius: 9999px;
    font-size: 0.75rem;
    text-decoration: none;
    transition: background 0.15s;
  }

  .tag:hover { background: #bae6fd; }

  .tag-post-list {
    list-style: none;
    margin-top: 24px;
  }

  .tag-post-list li {
    padding: 14px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .tag-post-list li a {
    color: #0f172a;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
  }

  .tag-post-list li a:hover { color: #0ea5e9; }

  .tag-post-list li time {
    display: block;
    font-size: 0.8125rem;
    color: #64748b;
    margin-top: 2px;
  }
`;
