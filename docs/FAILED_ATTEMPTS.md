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

## 2026-07-14 — Install Serena for Codex via global uv shims on this Windows machine
- What was tried: Reused the existing `uv tool` / `~/.local/bin` Serena shim path and attempted `uv tool uninstall` + reinstall to recover it.
- Why it failed: The shim was broken (`uv trampoline failed to canonicalize script path`) and Windows left the tool env in a partially corrupted state, so reinstalling through the shim path was unreliable.
- Do not retry because: Use a dedicated venv and point Codex directly at `C:\Users\LEO\.codex\venvs\serena\Scripts\serena-agent.exe` and `serena-hooks.exe`.

## 2026-07-14 — Retry CocoIndex installation while a timed-out uv process is still running
- What was tried: Started a second `uv pip install` after the managed shell timed out the first full CocoIndex install.
- Why it failed: The first `uv` child remained alive and held the same venv/cache lock, so both installs appeared stuck without output.
- Do not retry because: Inspect and stop only the identified orphan installer PID, then run one verbose install to completion.

## 2026-07-14 — Initialize CocoIndex interactively in the managed Windows shell
- What was tried: Ran `ccc init -f`, then generated settings once under the default Windows code page.
- Why it failed: Prompt Toolkit raised `NoConsoleScreenBufferError`, and the generated CP1252 comments later failed UTF-8 decoding.
- Do not retry because: Generate CocoIndex settings through its Python API under `python -X utf8`, and run the CLI/MCP through the same UTF-8 mode.

## 2026-07-14 — Use Serena standalone health-check as the final Windows verification
- What was tried: Ran `serena-agent project health-check` against this repo.
- Why it failed: Symbol, reference, and pattern checks passed, but shutdown/output then hit CP1252 Unicode errors and an upstream cache-save `open` error, producing a false failing exit.
- Do not retry because: Verify Serena through its MCP server with `PYTHONUTF8=1` and a real symbol query until the standalone health-check is fixed upstream.

## 2026-07-14 — Use Serena file diagnostics for the Check-in audit
- What was tried: Requested diagnostics for `src/components/afterbloom/CheckInFlow.jsx` after successful Serena symbol reads.
- Why it failed: The MCP diagnostics call exceeded its 300-second timeout on this Windows setup.
- Do not retry because: Use Serena for symbols/references and verify JavaScript with the existing lint/build commands until diagnostics latency is fixed.

## 2026-07-14 — Pass a test directory directly to Node 22 test runner
- What was tried: Used `node --test tests` as the package test command.
- Why it failed: On this Windows/Node 22 setup, the runner treated `tests` as a module path instead of discovering its files.
- Do not retry because: Keep the explicit portable glob `node --test "tests/*.test.js"`.

## 2026-07-15 — Use a device-ID bootstrap as proof of the live Firebase tracer
- What was tried: Bootstrapped a synthetic Mother session with UID `device-test-trace-w6-20260715-1815`, completed a High-Risk-tag check-in, and watched Firestore channel requests return HTTP 200 before opening Admin.
- Why it failed: The synthetic mother never appeared in Admin, so the channel response did not prove an authenticated committed write. The normal clean onboarding path requires Google sign-in.
- Do not retry because: Run the tracer with a Firebase-authenticated synthetic test account and verify the document in Admin before attempting resolve/retrigger.
## 2026-07-15 — Deploy notification Cloud Functions on Firebase Spark plan
- What was tried: Ran a Functions deployment dry-run for scheduled reminders and case-resolution notifications.
- Why it failed: Firebase requires the Blaze plan before enabling Cloud Build and deploying Functions.
- Do not retry because: Upgrade project `afterbloom-18d15` to Blaze first, then rerun the existing deployment command.

## 2026-07-15 — Start preview through the npm PowerShell wrapper
- What was tried: Ran `npm run preview -- --host 127.0.0.1 --port 4180` for runtime verification.
- Why it failed: The Windows npm PowerShell wrapper denied access to its global npm path and dropped the forwarded flags.
- Do not retry because: Run Vite directly with `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4180`; that path returned HTTP 200.

## 2026-07-16 — Generate logo transparency with PowerShell image processing
- What was tried: Used System.Drawing to remove the connected white background from the supplied preview and generate resized PWA icons.
- Why it failed: The first command imported the nonexistent `System.Drawing.Imaging` assembly; the next two attempts used unparenthesized arithmetic inside PowerShell arrays, causing operator parsing errors.
- Do not retry because: The corrected System.Drawing command now produces transparent web assets and opaque white-background icons successfully.

## 2026-07-18 — Navigate stale Vercel clients directly to a cross-origin Firebase URL
- What was tried: Called `WindowClient.navigate()` with the Firebase hostname during the Vercel migration worker's activation.
- Why it failed: The stale client was not yet controlled and direct cross-origin navigation did not move the page; the activation promise stopped before unregistering.
- Do not retry because: Claim the client, reload its same-origin URL, then let the current app entrypoint call `location.replace()` to Firebase.

## 2026-07-18 — Run a repo-local JavaScript Playwright spec through transient npx
- What was tried: Ran `npx playwright test` against a JavaScript spec while Playwright was not a local dependency.
- Why it failed: The transient CLI could not resolve `@playwright/test` or `playwright/test` from the repo test file.
- Do not retry because: Use the installed Python Playwright runtime for standalone preview QA unless Playwright becomes a declared project dependency.

## 2026-07-20 — Scroll an expanding Care Journey accordion immediately
- What was tried: Called native `scrollIntoView` from the `openPhase` effect as soon as the accordion state changed.
- Why it failed: The Framer Motion collapse had not finished expanding, so the browser calculated the maximum scroll from the old document height and left the heading around 52% of the viewport.
- Do not retry because: Delay the scroll until after the 320ms content expansion and keep the 5vh scroll margin.

## 2026-07-20 — Run the updated Journey smoke against a stale Vite process
- What was tried: Ran the new six-tab Playwright smoke while the existing Vite process still served the pre-EPDS-label bundle, then ran it before the lazy Journey tab had mounted.
- Why it failed: The browser saw the old `แบบประเมินสุขภาพใจ` label and the accordion count was still below eight during lazy loading.
- Do not retry because: Restart the exact dev-server PID when local verification is needed and wait on the Journey DOM condition instead of a fixed short delay.
