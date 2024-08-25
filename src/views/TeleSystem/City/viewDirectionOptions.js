import { i18n } from '~/plugins/i18n';

const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];

const viewDirectionOptions = [];
for (let i = 0; i < directions.length; i++) {
    viewDirectionOptions.push({
        value: directions[i],
        label: i18n.global.t('views.teleSystem.city.viewDirection.' + directions[i]),
    });
}

export { viewDirectionOptions };

export const getViewDirectionLabel = (val) => {
    for (let i = 0; i < viewDirectionOptions.length; i++) {
        if (viewDirectionOptions[i].value === val) {
            return viewDirectionOptions[i].label;
        }
    }
};
