const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const newContact : any = async (contact : Object) => {
    console.log(contact)

    try {
        const response = await fetch(`${BASE_URL}/api/contact/inquiry/receive`, {
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

    try {
        const response = await fetch(`${BASE_URL}/api/contact/inquiry/update`, {
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