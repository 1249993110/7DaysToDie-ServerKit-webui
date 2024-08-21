import Papa from 'papaparse';

export const exportCsv = (array, fileName, columns, withBom = true) => {
    const data = [];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const row = [];
        for (const key of Object.keys(columns)) {
            row.push(element[key]);
        }
        data.push(row);
    }

    const obj = {
        fields: Object.values(columns),
        data: data,
    };

    const csv = withBom ? '\ufeff' + Papa.unparse(obj) : Papa.unparse(obj);

    const content = new Blob([csv], { type: 'text/plain;charset=UTF-8' });
    const urlObject = window.URL || window.webkitURL || window;
    const url = urlObject.createObjectURL(content);

    const el = document.createElement('a');
    el.href = url;
    el.download = fileName + '.csv';
    el.click();

    urlObject.revokeObjectURL(url);
};

export const exportJson = (array, fileName, indent = true) => {
    const json = indent ? JSON.stringify(array, null, 2) : JSON.stringify(array);

    const content = new Blob([json], { type: 'text/plain;charset=UTF-8' });
    const urlObject = window.URL || window.webkitURL || window;
    const url = urlObject.createObjectURL(content);

    const el = document.createElement('a');
    el.href = url;
    el.download = fileName + '.json';
    el.click();

    urlObject.revokeObjectURL(url);
};