// realEstatePhoto.middleware.ts
// Same style as your previous middleware functions

const BASE_URL = import.meta.env.DEV ? import.meta.env.VITE_API_DEV_BASE_URL : import.meta.env.VITE_API_PROD_BASE_URL;

  async function getBaseUrl() {
    return BASE_URL;
  }

export type realEstatePhoto = {
  realEstateQuery: string;
  url: string;
};

export type realEstatePhotoUpdate = Partial<realEstatePhoto>;

export async function CreateRealEstatePhoto(protoRealEstatePhoto: realEstatePhoto) {
    const url = await getBaseUrl();

  try {
    const response = await fetch(`${url}/api/real-estate-photo`, {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify(protoRealEstatePhoto),
    });

    if (response.ok) {
      const newRealEstatePhoto = await response.json();
      return newRealEstatePhoto;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function GetRealEstatePhotos(realEstateQueryId?: string) {
    const url = await getBaseUrl();

  try {
    const thisUrl = realEstateQueryId
      ? `${url}/api/real-estate-photo?realEstateQuery=${encodeURIComponent(
          realEstateQueryId
        )}`
      : `${url}/api/real-estate-photo`;

    const response = await fetch(thisUrl, {
      headers: { "content-type": "application/json" },
      method: "GET",
    });

    if (response.ok) {
      const photos = await response.json();
      return photos;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function GetRealEstatePhotoById(photoId: string) {
    const url = await getBaseUrl();

  try {
    const response = await fetch(
      `${url}/api/real-estate-photo/${encodeURIComponent(photoId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "GET",
      }
    );

    if (response.ok) {
      const photo = await response.json();
      return photo;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function UpdateRealEstatePhoto(
  photoId: string,
  updates: realEstatePhotoUpdate
) {
  try {
      const url = await getBaseUrl();

    const response = await fetch(
      `${url}/api/real-estate-photo/${encodeURIComponent(photoId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );

    if (response.ok) {
      const updatedPhoto = await response.json();
      return updatedPhoto;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function DeleteRealEstatePhoto(photoId: string) {
  try {
      const url = await getBaseUrl();

    const response = await fetch(
      `${url}/api/real-estate-photo/${encodeURIComponent(photoId)}`,
      {
        headers: { "content-type": "application/json" },
        method: "DELETE",
      }
    );

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
