import { API_URL } from "../settings";

export async function healthService(): Promise<string> {
	const response = await fetch(`${API_URL}/health`, {
		headers: {
				"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		throw new Error(`Health check failed: ${response.status}`);
	}
	const data = await response.json();
	return data.status;
}
