const BASE_URL = import.meta.env.DEV ? import.meta.env.VITE_API_DEV_BASE_URL : import.meta.env.VITE_API_PROD_BASE_URL;

  async function getBaseUrl() {
    return BASE_URL;
  }

export const newContact : any = async (contact : Object) => {
    console.log(contact)
      const url = await getBaseUrl();


    try {
        const response = await fetch(`${url}/api/contact/inquiry/receive`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(contact),
                credentials: 'include',
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.log(await response.status);
            throw new Error("Contact unsuccessful");
        }
    } catch(err) {
        throw new Error("Contact unsuccessful");
    }

    
}

export const createResponseCotact : any = async (contact : Object) => {
    console.log(contact)
      const url = await getBaseUrl();


    try {
        const response = await fetch(`${url}/api/contact/inquiry/update`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(contact),
                credentials: 'include',
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.log(await response.status);
            throw new Error("Contact unsuccessful");
        }
    } catch(err) {
        throw new Error("Contact unsuccessful");
    }
}