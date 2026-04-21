// realEstatePhoto.middleware.ts
// Same style as your previous middleware functions

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type realEstatePhoto = {
  realEstateQuery: string;
  url: string;
};

export type realEstatePhotoUpdate = Partial<realEstatePhoto>;

export async function CreateRealEstatePhoto(protoRealEstatePhoto: realEstatePhoto) {
  try {
    const response = await fetch(`${BASE_URL}/api/real-estate-photo`, {
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
  try {
    const url = realEstateQueryId
      ? `${BASE_URL}/api/real-estate-photo?realEstateQuery=${encodeURIComponent(
          realEstateQueryId
        )}`
      : `${BASE_URL}/api/real-estate-photo`;

    const response = await fetch(url, {
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
  try {
    const response = await fetch(
      `${BASE_URL}/api/real-estate-photo/${encodeURIComponent(photoId)}`,
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
    const response = await fetch(
      `${BASE_URL}/api/real-estate-photo/${encodeURIComponent(photoId)}`,
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
    const response = await fetch(
      `${BASE_URL}/api/real-estate-photo/${encodeURIComponent(photoId)}`,
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
