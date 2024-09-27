<template>
    <div class="live-chat">
        <RouterButton :names="['chat.liveChat', 'chat.chatRecord']"></RouterButton>
        <el-card class="card" shadow="always">
            <div class="live-chat-container">
                <el-scrollbar always ref="scrollbarRef">
                    <div id="live-chat-content"></div>
                </el-scrollbar>
            </div>
            <div class="send-container">
                <el-input :placeholder="t('global.message.inputText')" v-model="message" clearable @keyup.enter.native="sendMessage"> </el-input>
                <el-button class="button" type="primary" @click="sendMessage">{{ t('playerOperation.sendMessage') }}</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'chat.liveChat',
};
</script>

<script setup>
import { sendGlobalMessage } from '~/api/server';
import * as api from '~/api/chat-record';

const { t } = useI18n();
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

const appendMessage = (chatMessage, prepend = false) => {
    const message = chatMessage.createdAt + "   '" + chatMessage.senderName + "': " + chatMessage.message;

    const element = document.getElementById('live-chat-content');

    let color;
    switch (chatMessage.chatType) {
        // Global
        case 'Global':
            color = 'black';
            break;
        // Friends
        case 'Friends':
            color = '#006400';
            break;
        // Party
        case 'Party':
            color = '#FFD700';
            break;
        // Whisper
        case 'Whisper':
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

    if (prepend) {
        element.prepend(p);
    } else {
        element.appendChild(p);
    }

    return p;
};

emitter.on(eventTypes.OnChatMessage, (chatMessage) => {
    if (!isActivated) {
        if (messageBuffer.length > 100) {
            messageBuffer.shift();
        }
        messageBuffer.push(chatMessage);
    } else {
        const el = appendMessage(chatMessage);
        el.scrollIntoView();
    }
});

let pageNumber = 1;
let len = 0;
const getData = async (pageSize) => {
    const data = await api.getChatRecord({ pageNumber: pageNumber, pageSize: pageSize, order: 'createdAt', desc: true });
    len = data.items.length;
    for (let i = 0; i < len; i++) {
        appendMessage(data.items[i], true);
    }
};

const canLoadMore = () => {
    return len > 0;
};

const scrollbarRef = ref();

onMounted(async () => {
    await getData(50);

    const { height } = useElementSize(document.getElementById('live-chat-content'));
    scrollbarRef.value.setScrollTop(height.value);
    useInfiniteScroll(
        scrollbarRef.value.wrapRef,
        async () => {
            pageNumber++;
            await getData(10);
            scrollbarRef.value.setScrollTop(1);
        },
        { direction: 'top', distance: 0, canLoadMore: canLoadMore }
    );
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
