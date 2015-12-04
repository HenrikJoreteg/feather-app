# feather

Feather is a proof of concept app demonstrating the following in 8.5kb of min/gzipped code.

- Initial render of clientside components to static HTML at build time. So the browser gets "pre-rendered" HTML.
- JS "taking over" once loaded in the browser.
- App state, logic, and virtual DOM rendering and diffing happens outside of main UI thread using a WebWorker.
- WebWorker code is "inlined" and loaded as a data URI using `Blob` interface.
- Worker code is written in ES2015 and `import` other modules and npm modules from inside worker.
- Insanely light "router" (feels silly to even call it that). The current URL is simply treated as a part of application state. It then gets "rendered" to the URL bar with `history.pushState` if it's different than current.
- Styles are pre-processed and live-reloaded during development without need for browser plugins.
- `npm run build && npm run deploy` puts a fully static site with clean URLs on the Internet using [Surge.sh](https://surge.sh).
- Main ui thread has only three responsibilities:
	- listening for and sending serializable actions back to the worker (this includes `popstate` events) for routing
	- sending "state of the world" to worker on start. This includes parsing real DOM into a virtual dom so the worker has a starting point for calculating diffs and sending in the current URL.