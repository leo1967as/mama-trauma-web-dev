## 2026-05-21 — Use session browser tools directly for local visual verification
- What was tried: Tried to use the exposed browser/plugin route for local UI verification after the Mood refactor.
- Why it failed: The browser automation tool surface was not exposed in this session, so there was no callable local browser control despite the plugin being available conceptually.
- Do not retry because: Use the working fallback instead; launch the local app normally and run Playwright from the cached `npx` install with `NODE_PATH` pointed at that cache.

## 2026-06-09 — Copy skill directory onto an existing PowerShell destination
- What was tried: Copied `.agents/skills/caveman` to the existing global `C:\Users\LEO\.codex\skills\caveman` directory with `Copy-Item -Recurse -Force`.
- Why it failed: PowerShell nested the source folder as `...\skills\caveman\caveman` instead of replacing the root `SKILL.md`.
- Do not retry because: When syncing a skill into an existing directory, copy the source contents (`source\*`) into the target directory and verify `SKILL.md` at the target root.

## 2026-06-15 — Run impeccable CLI installer on Windows without unzip in PATH
- What was tried: Ran `npx impeccable skills install` directly from the project root.
- Why it failed: The CLI downloaded its bundle successfully but then called `unzip`, which is not present in this Windows PATH, so extraction aborted before install.
- Do not retry because: On this machine, either provide a temporary `unzip` shim in PATH or extract/copy the bundle manually before rerunning the installer.

## 2026-06-15 — Use Node REPL browser automation for Therapy visual QA
- What was tried: Used the Browser plugin's Node REPL path to import Playwright and inspect the local Therapy page.
- Why it failed: The Node REPL kernel exited with a Windows sandbox setup error before Playwright could import.
- Do not retry because: Use the dev server plus another browser automation path, or manual browser QA, until the Node REPL sandbox issue is resolved.

## 2026-06-16 — Use current Chrome CDP and npm exec for tab jank measurement
- What was tried: Tried to connect Playwright over the already-open Chrome DevTools port and tried `npm exec --package=playwright` / `npx -p playwright` to run an inline script from the project.
- Why it failed: The existing Chrome CDP connection timed out after WebSocket connect, and npm exec did not make `require("playwright")` resolvable to inline Node in this shell.
- Do not retry because: Use a clean system Chrome launch controlled by Playwright installed in a temp folder such as `D:\tmp\moji-pwdiag`, or install a proper local test dependency if recurring UI performance tests are needed.

## 2026-06-16 — Add full Afterbloom wordmark image to final Welcome bridge
- What was tried: Added `src/logo/afterbloom-flower.png` as the main visual in the onboarding final Welcome stage.
- Why it failed: The resulting composition felt less polished than the simple text-only Welcome state and was rejected in visual review.
- Do not retry because: Keep the final Welcome bridge text-led unless the brand asset is redesigned or cropped specifically for that compact transition.

## 2026-06-27 — Run Admin lint and build concurrently through npm on this Windows setup
- What was tried: Launched `npm run lint` and `npm run build` concurrently while auditing the separate Admin Dashboard.
- Why it failed: The parallel npm processes intermittently hit an access-denied check under the user npm installation, obscuring the build result.
- Do not retry because: Run Admin npm verification commands sequentially on this machine; the sequential build completed successfully.

## 2026-06-27 — Validate live Firebase through the sandboxed Chrome smoke
- What was tried: Opened the local Admin Dashboard with Playwright/system Chrome and attempted to load live Firebase data.
- Why it failed: The sandbox denied external Firebase requests; moving only the browser outside the sandbox could not reach the sandbox-local Vite server.
- Do not retry because: Use the user's normal browser for the planned Mother App-to-Admin tracer test, or run both the dev server and browser in the same unrestricted environment.
## 2026-06-27 — Run Firebase re-login inside a non-interactive agent shell
- What was tried: Ran `firebase login --reauth` directly through the managed shell.
- Why it failed: Firebase CLI detected a non-interactive environment and refused the login flow.
- Do not retry because: Open a visible PowerShell process for interactive Firebase login, then return to CLI/API automation after credentials refresh.
