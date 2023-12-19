export const getBase64 = (blobUrl) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(blobUrl);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });
};
