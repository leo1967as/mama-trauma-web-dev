## 2026-05-21 — Use session browser tools directly for local visual verification
- What was tried: Tried to use the exposed browser/plugin route for local UI verification after the Mood refactor.
- Why it failed: The browser automation tool surface was not exposed in this session, so there was no callable local browser control despite the plugin being available conceptually.
- Do not retry because: Use the working fallback instead; launch the local app normally and run Playwright from the cached `npx` install with `NODE_PATH` pointed at that cache.
