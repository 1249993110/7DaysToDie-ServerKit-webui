<template>
    <div class="live-chat">
        <RouterButton
            :buttons="[
                {
                    value: '实时聊天',
                    path: '/chat/live-chat',
                },
                {
                    value: '聊天记录',
                    path: '/chat/chat-record',
                },
            ]"
        >
        </RouterButton>
        <el-card class="card" shadow="always">
            <div class="live-chat-container">
                <el-scrollbar always>
                    <div id="live-chat-content"></div>
                </el-scrollbar>
            </div>
            <div class="send-container">
                <el-input placeholder="请输入内容" v-model="message" clearable @keyup.enter.native="sendMessage"> </el-input>
                <el-button class="button" type="primary" @click="sendMessage">发送消息</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'LiveChat',
};
</script>

<script setup>
import { sendGlobalMessage } from '~/api/server';
import { emitter, eventTypes } from '~/utils/event-hub';
import * as api from '~/api/chat-record';
import { getSettings } from '~/api/settings.js';

let contentCount = 0;
const contentMaxCount = 1000;
const message = ref('');

const sendMessage = async () => {
    if (!!message.value) {
        const globalSettings = await getSettings('GlobalSettings');
        await sendGlobalMessage(message.value, globalSettings.serverName);
        message.value = '';
    }
};

let messageBuffer = [];
let isActivated = false;
onActivated(() => {
    isActivated = true;
    messageBuffer.forEach((item) => {
        appendMessage(item);
    });
    messageBuffer = [];
});
onDeactivated(() => {
    isActivated = false;
});

const appendMessage = (chatMessage) => {
    const message = chatMessage.createdAt + "   '" + chatMessage.senderName + "': " + chatMessage.message;

    const element = document.getElementById('live-chat-content');
    if (contentCount > contentMaxCount) {
        element.removeChild(element.firstElementChild);
    } else {
        contentCount++;
    }

    let color;
    switch (chatMessage.chatType) {
        // Global
        case 0:
            color = 'black';
            break;
        // Friends
        case 1:
            color = '#006400';
            break;
        // Party
        case 2:
            color = '#FFD700';
            break;
        // Whisper
        case 3:
            color = '#00C814';
            break;
        default:
            color = 'black';
    }

    if (chatMessage.entityId <= 0) {
        color = 'red';
    }

    const p = document.createElement('p');
    p.innerHTML = `<font color="${color}">${message}</font>`;

    element.appendChild(p);
    p.scrollIntoView();
};

emitter.on(eventTypes.OnChatMessage, (chatMessage) => {
    if (!isActivated) {
        if (messageBuffer.length > 100) {
            messageBuffer.shift();
        }
        messageBuffer.push(chatMessage);
    } else {
        appendMessage(chatMessage);
    }
});

onMounted(async () => {
    const data = await api.getChatRecord({ pageNumber: 1, pageSize: 20 });
    const len = data.items.length;
    for (let i = len - 1; i >= 0; i--) {
        appendMessage(data.items[i]);
    }
});
</script>

<style scoped lang="scss">
.live-chat {
    .card {
        margin-top: 20px;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            .live-chat-container {
                height: calc(100vh - 240px);
            }
        }

        #live-chat-content {
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
}
</style>
