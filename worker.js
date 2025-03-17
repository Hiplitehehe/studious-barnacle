
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const { code } = await request.json();
      if (!code) {
        return new Response(JSON.stringify({ error: "Missing code" }), { status: 400 });
      }

      const githubResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code
        })
      });

      const githubData = await githubResponse.json();
      if (githubData.error) {
        return new Response(JSON.stringify({ error: githubData.error_description }), { status: 400 });
      }

      return new Response(JSON.stringify({ access_token: githubData.access_token }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  }
};
