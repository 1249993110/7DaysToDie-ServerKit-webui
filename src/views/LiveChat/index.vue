<template>
    <div class="live-chat">
        <RouterButton
            :buttons="[
                {
                    label: '实时聊天',
                    path: '/live-chat',
                },
            ]"
        >
        </RouterButton>
        <el-card shadow="always">
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
import dayjs from 'dayjs';
import { sendGlobalMessage } from '~/api/server';
import { emitter, eventTypes } from '~/utils/event-hub';

let contentCount = 0;
const contentMaxCount = 1000;
const message = ref('');

const sendMessage = async () => {
    if (!!message.value) {
        await sendGlobalMessage(message.value);
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
    const message = dayjs().format("YYYY-MM-DD HH:mm:ss   '") + chatMessage.senderName + "': " + chatMessage.message;

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
</script>

<style scoped lang="scss">
.live-chat {
    .el-card {
        margin-top: 20px;
        background-color: #ffffffaf;
        :deep(.el-card__body) {
            .live-chat-container {
                height: calc(100vh - 260px);
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
