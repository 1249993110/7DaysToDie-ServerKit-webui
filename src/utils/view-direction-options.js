export const viewDirectionOptions = [
    {
        value: 'n',
        label: '北',
    },
    {
        value: 'ne',
        label: '东北',
    },
    {
        value: 'e',
        label: '东',
    },
    {
        value: 'se',
        label: '东南',
    },
    {
        value: 's',
        label: '南',
    },
    {
        value: 'sw',
        label: '西南',
    },
    {
        value: 'w',
        label: '西',
    },
    {
        value: 'nw',
        label: '西北',
    },
    {
        value: 'north',
        label: '北',
    },
    {
        value: 'northeast',
        label: '东北',
    },
];

export const getLabel = (val) => {
    for (let i = 0; i < viewDirectionOptions.length; i++) {
        if (viewDirectionOptions[i].value === val) {
            return viewDirectionOptions[i].label;
        }
    }
};
