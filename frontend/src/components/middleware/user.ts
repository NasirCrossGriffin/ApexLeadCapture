const BASE_URL = import.meta.env.DEV ? import.meta.env.VITE_API_DEV_BASE_URL : import.meta.env.VITE_API_PROD_BASE_URL;

  async function getBaseUrl() {
    return BASE_URL;
  }

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  organization: string; // ObjectId string
  // add other fields if your model has them
};

export type UserUpdate = Partial<User>;

export async function createUser(protoUser: User) {
    const url = await getBaseUrl();

  try {
    const response = await fetch(`${url}/api/user`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(protoUser),
    });

    if (response.ok) {
      const newUser = await response.json();
      return newUser;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getUsers(organizationId?: string) {
    const url = await getBaseUrl();

  try {
    const thisUrl =
      organizationId
        ? `${url}/api/user?organization=${encodeURIComponent(organizationId)}`
        : `${url}/api/user`;

    const response = await fetch(thisUrl, {
      headers: { "content-type": "application/json" },
      method: "GET",
    });

    if (response.ok) {
      const users = await response.json();
      return users;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getUserById(userId: string) {
    const url = await getBaseUrl();

  try {
    const response = await fetch(`${url}/api/user/${encodeURIComponent(userId)}`, {
      headers: { "content-type": "application/json" },
      method: "GET",
    });

    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateUser(userId: string, updates: UserUpdate) {
    const url = await getBaseUrl();

  try {
    const response = await fetch(`${url}/api/user/${encodeURIComponent(userId)}`, {
      headers: { "content-type": "application/json" },
      method: "PUT",
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      return updatedUser;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteUser(userId: string) {
    const url = await getBaseUrl();

  try {
    const response = await fetch(`${url}/api/user/${encodeURIComponent(userId)}`, {
      headers: { "content-type": "application/json" },
      method: "DELETE",
    });

    if (response.ok) {
      const result = await response.json();
      return result; // { deleted: true, id: ... }
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}
