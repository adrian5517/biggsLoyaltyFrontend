// This util fetches the real user count from the backend
export async function fetchUserCount() {
  try {
    const res = await fetch("http://localhost:8080/api/user_count.php");
    const data = await res.json();
    if (data.success && typeof data.count === "number") {
      return data.count;
    }
    return null;
  } catch {
    return null;
  }
}
