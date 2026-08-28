// Force HTTPS and serve static assets for bpaau.org.
// This file is the Worker entrypoint (referenced by `main` in wrangler.jsonc).
// Static assets are served from ./public via the ASSETS binding.
export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// Enforce HTTPS on the custom domain / any host.
		if (url.protocol === "http:") {
			url.protocol = "https:";
			return Response.redirect(url.toString(), 301);
		}

		// Serve the static site from the assets binding.
		return env.ASSETS.fetch(request);
	},
};
