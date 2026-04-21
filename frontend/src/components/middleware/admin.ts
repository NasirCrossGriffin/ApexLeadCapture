// admin.middleware.ts
// Middleware method for POST /api/admin/autheticate (spelled as in your route)

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type AdminAuthRequest = {
  username: string;
  password: string;
  organization: string; // bodyShop id (or whatever you're passing)
};

export type AdminAuthResponse = {
  _id: string;
  username: string;
  organization: string;
};

export async function authenticateAdmin(
  creds: AdminAuthRequest
): Promise<AdminAuthResponse | null> {
  console.log("entered")
  try {
    console.log("try entered")
    const response = await fetch(`${BASE_URL}/api/admin/authenticate`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(creds),
      credentials: "include", // important if you're using sessions/cookies
    });

    if (response.ok) {
      const admin = await response.json();
      console.log(admin)
      return admin;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const check : any = async (organizationId : string) => {
    const response = await fetch(`${BASE_URL}/api/admin/check`, {
            method: 'POST',
            body : JSON.stringify({organizationId : organizationId}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: 'include',
    });

    if (response.ok) {
        console.log("Verification successful")
        return await response.json();
    } else {
        console.log(await response.status);
        throw new Error("Verification failed");
    }
}