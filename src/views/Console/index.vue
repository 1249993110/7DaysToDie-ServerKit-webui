<template>
    <div class="console">
        <RouterButton :names="['console']"> </RouterButton>
        <div id="console-content"></div>
        <div class="send-container">
            <el-input :placeholder="t('global.message.inputText')" v-model="command" clearable @keyup.enter.native="sendCommand"> </el-input>
            <el-button class="button" type="primary" @click="sendCommand">{{ t('global.button.send') }}</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'console',
};
</script>

<script setup>
import { executeConsoleCommand } from '~/api/server';

const { t } = useI18n();
const command = ref('');

const sendCommand = async () => {
    const data = await executeConsoleCommand(command.value, true);
    command.value = '';
    data.forEach((item) => {
        appendMessage(item, 'Assert');
    });
};

let messageBuffer = [];
let isActivated = false;
onActivated(() => {
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
</script>

<style scoped lang="scss">
.console {
    height: calc(100vh - 90px);
    #console-content {
        margin-top: 20px;
        background-color: rgb(30, 30, 30);
        height: calc(100vh - 200px);
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
        display: flex;

        .button {
            margin-left: 8px;
        }
    }
}
</style>
