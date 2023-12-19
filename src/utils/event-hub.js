// using ES6 modules

import mitt from 'mitt';

// emitter
export const emitter = mitt();

export const eventTypes = {
    OnChatMessage: 'OnChatMessage',
    OnConsoleLog: 'OnConsoleLog',
};