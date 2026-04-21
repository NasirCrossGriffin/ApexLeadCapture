//Upload to S3
const BASE_URL = import.meta.env.DEV ? import.meta.env.VITE_API_DEV_BASE_URL : import.meta.env.VITE_API_PROD_BASE_URL;

  async function getBaseUrl() {
    return BASE_URL;
  }

export const uploadToS3 : any = async (file : File) => {
    console.log("Function entered")
    const formData = new FormData();
    formData.append("file", file);
    const url = await getBaseUrl();

    const response = await fetch(`${url}/api/s3/`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
    });

    if (response.ok) {
        return await response.json();
    } else {
        console.log(await response.status);
        throw new Error("File upload failed!");
    }
}