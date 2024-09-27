<template>
    <div class="console">
        <RouterButton :names="['console']">
            <template #route-button>
                <div class="route-button">
                    <span style="font-size: 14px; margin-right: 4px">{{ t('views.playerList.autoRefresh') }}</span>
                    <el-switch v-model="autoRefrensh" />
                </div>
            </template>
        </RouterButton>
        <div id="console-content"></div>
        <div class="send-container">
            <!-- <el-input :placeholder="t('global.message.inputText')" v-model="command" clearable @keyup.enter.native="sendCommand"> </el-input> -->
            <autocomplete
                style="width: calc(100% - 115px)"
                :search="search"
                :placeholder="t('global.message.inputText')"
                :aria-label="t('global.message.inputText')"
                @keyup.enter.native="sendCommand"
                @keydown.up.prevent="handleArrowUp"
                @keydown.down.prevent="handleArrowDown"
                :get-result-value="getResultValue"
                autoSelect
                ref="autocompleteRef"
            >
                <template #result="{ result, props }">
                    <li v-bind="props" class="autocomplete-result wiki-result">
                        <div class="wiki-title">
                            {{ result.title }}
                        </div>
                        <div class="wiki-snippet" v-html="result.snippet" />
                    </li> </template
            ></autocomplete>
            <el-button class="button" type="primary" @click="sendCommand" size="large">{{ t('global.button.send') }}</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'console',
};
</script>

<script setup>
import { executeConsoleCommand, getAllowedCommands } from '~/api/server';
import Autocomplete from '@trevoreyre/autocomplete-vue';
import '@trevoreyre/autocomplete-vue/dist/style.css';

const { t } = useI18n();
const autoRefrensh = ref(true);

const commandHistory = [];
let historyIndex = -1;
const handleArrowUp = () => {
    if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        autocompleteRef.value.value = commandHistory[commandHistory.length - 1 - historyIndex];
    }
};
const handleArrowDown = () => {
    if (commandHistory.length > 0 && historyIndex >= 0) {
        historyIndex--;
        autocompleteRef.value.value = historyIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - historyIndex];
    }
};

const autocompleteRef = ref();
const sendCommand = async () => {
    const command = autocompleteRef.value.value.trim();
    if (!command) {
        return;
    }
    const data = await executeConsoleCommand(command, true);

    commandHistory.push(command);
    historyIndex = -1;

    autocompleteRef.value.value = '';
    data.forEach((item) => {
        appendMessage(item, 'Assert');
    });
};

let messageBuffer = [];
let isActivated = false;
onActivated(() => {
    if(!autoRefrensh.value) {
        return;
    }

    isActivated = true;
    messageBuffer.forEach((logEntry) => {
        appendMessage(logEntry.message, logEntry.logType);
    });
    messageBuffer = [];
});
onDeactivated(() => {
    isActivated = false;
});

const appendMessage = (message, logType) => {
    const element = document.getElementById('console-content');

    let color;
    switch (logType) {
        case 'Error':
            color = 'red';
            break;
        case 'Assert':
            color = 'white';
            break;
        case 'Warning':
            color = 'yellow';
            break;
        case 'Log':
            color = '#00C814';
            break;
        case 'Exception':
            color = 'red';
            break;
        default:
            color = '#00C814';
    }

    const p = document.createElement('p');
    const font = document.createElement('font');
    font.setAttribute('color', color);
    font.setAttribute('style', 'font-family: monospace');
    font.innerText = message;
    p.appendChild(font);

    element.appendChild(p);
    p.scrollIntoView();
};

emitter.on(eventTypes.OnConsoleLog, (logEntry) => {
    if (!isActivated) {
        messageBuffer.push(logEntry);
    } else {
        appendMessage(logEntry.message, logEntry.logType);
    }
});

let allowedCommands = [];
const search = async (input) => {
    if (input.length < 1) {
        return [];
    }

    if (allowedCommands.length === 0) {
        allowedCommands = await getAllowedCommands();
    }

    const result = [];
    for (let i = 0; i < allowedCommands.length; i++) {
        const commands = allowedCommands[i].commands;
        for (let j = 0; j < commands.length; j++) {
            if (commands[j].toLowerCase().startsWith(input.toLowerCase())) {
                result.push({ title: commands[j], snippet: allowedCommands[i].description });
            }
        }
    }

    return result;
};

const getResultValue = (result) => {
    return result.title;
};

watch(autoRefrensh, (val) => {
    if (val) {
        isActivated = true;
        messageBuffer.forEach((logEntry) => {
            appendMessage(logEntry.message, logEntry.logType);
        });
        messageBuffer = [];
    } else {
        isActivated = false;
    }
});
</script>

<style scoped lang="scss">
.console {
    height: calc(100vh - 90px);
    .route-button {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
        :deep(.el-button) {
            --el-button-text-color: #005eeb;
        }
        :deep(button:nth-child(3)) {
            --el-button-text-color: #f56c6c;
        }
    }
    #console-content {
        margin-top: 20px;
        background-color: rgb(30, 30, 30);
        height: calc(100vh - 195px);
        overflow: auto;
        padding: 1px;
        border-radius: 4px;

        :deep(p) {
            margin: 1px;
            word-wrap: break-word;
            word-break: break-all;
            font-size: 14px;
            white-space: pre-wrap;
        }
    }

    .send-container {
        margin-top: 8px;
        position: absolute;
        width: 100%;
        display: flex;
        align-items: center;
        .button {
            margin-left: 8px;
        }

        .wiki-result {
            // border-top: 1px solid #eee;
            // padding: 16px;
            // background: transparent;
            display: flex;
        }

        .wiki-title {
            // font-size: 20px;
            // margin-bottom: 8px;
        }

        .wiki-snippet {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.54);
            margin-left: auto;
        }
    }
}
</style>
