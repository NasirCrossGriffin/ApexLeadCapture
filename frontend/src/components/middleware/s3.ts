//Upload to S3
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uploadToS3 : any = async (file : File) => {
    console.log("Function entered")
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/api/s3/`, {
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