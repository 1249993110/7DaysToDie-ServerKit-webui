export const getBase64 = (blobUrl) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(blobUrl);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });
};

export const getItemIconUrl = (name, iconColor = null) => {
    if (!name) {
        return null;
    }

    if (iconColor) {
        if (iconColor.toUpperCase() !== 'FFFFFF') {
            name += '__' + iconColor;
        }

        return import.meta.env.VITE_APP_API_BASE_URL + 'ItemIcons/' + name + '.png';
    }

    return import.meta.env.VITE_APP_API_BASE_URL + 'ItemIcons/' + name;
};

export const getUiIconUrl = (name, iconColor = null) => {
    if (!name) {
        return null;
    }

    if (iconColor) {
        if (iconColor.toUpperCase() !== 'FFFFFF') {
            name += '__' + iconColor;
        }
    }

    return import.meta.env.VITE_APP_API_BASE_URL + 'UiIcons/' + name + '.png';
};