export const getBase64 = (blobUrl) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(blobUrl);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });
};

export const getIconUrl = (item) => {
    let itemName = item.itemIcon;
    if (item.iconColor !== 'FFFFFF') {
        itemName += '__' + item.iconColor;
    }

    return import.meta.env.VITE_APP_API_BASE_URL + 'ItemIcons/' + itemName + '.png';
};