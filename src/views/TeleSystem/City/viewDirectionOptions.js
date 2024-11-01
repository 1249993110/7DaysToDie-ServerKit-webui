import { i18n } from '~/plugins/i18n';

const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];

const getViewDirectionOptions = () => {
    const arr = [];
    for (let i = 0; i < directions.length; i++) {
        arr.push({
            value: directions[i],
            label: i18n.global.t('views.teleSystem.city.viewDirection.' + directions[i]),
        });
    }
    return arr;
};

export { getViewDirectionOptions };

export const getViewDirectionLabel = (val) => {
    const options = getViewDirectionOptions();
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === val) {
            return options[i].label;
        }
    }
};
