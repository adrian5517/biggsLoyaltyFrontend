// This util fetches the real user count from the backend
export async function fetchUserCount(
    apiUrl = "/api/proxy/user_count.php",
  timeout = 5000
): Promise<number | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      console.error(`User count fetch failed: ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    if (data && data.success && typeof data.count === "number") {
      return data.count;
    }
    console.error("User count fetch: Invalid response format", data);
    return null;
  } catch (err) {
    clearTimeout(timer); // ensure timer is cleared on error too
    if (err instanceof Error && err.name === "AbortError") {
      console.error("User count fetch timed out");
    } else {
      console.error("User count fetch error:", err);
    }
    return null;
  }
}