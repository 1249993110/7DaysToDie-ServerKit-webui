<template>
    <div class="live-chat">
        <RouterButton :names="['chat.liveChat', 'chat.chatRecord']"></RouterButton>
        <el-card class="card" shadow="always">
            <div class="filter-container">
                <el-select
                    v-model="selectedChatTypes"
                    multiple
                    :placeholder="t('views.chat.tableHeader.chatType')"
                    style="width: 300px"
                >
                    <el-option :label="t('views.chat.chatType.globalAll')" value="GlobalAll" />
                    <el-option :label="t('views.chat.chatType.globalPlayerOnly')" value="GlobalPlayerOnly" />
                    <el-option :label="t('views.chat.chatType.friends')" value="Friends" />
                    <el-option :label="t('views.chat.chatType.party')" value="Party" />
                    <el-option :label="t('views.chat.chatType.whisper')" value="Whisper" />
                </el-select>
            </div>
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

const selectedChatTypes = ref(['GlobalPlayerOnly']);

let allMessages = [];

onMounted(async () => {
    const saved = localStorage.getItem('livechat-filter-chatTypes');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            const validTypes = ['GlobalAll', 'GlobalPlayerOnly', 'Friends', 'Party', 'Whisper'];
            const isValid = Array.isArray(parsed) && parsed.every(type => validTypes.includes(type));
            
            if (isValid && parsed.length > 0) {
                selectedChatTypes.value = parsed;
            } else {
                localStorage.removeItem('livechat-filter-chatTypes');
                selectedChatTypes.value = ['GlobalPlayerOnly'];
            }
        } catch (e) {
            console.error('Failed to parse saved filter preferences:', e);
            localStorage.removeItem('livechat-filter-chatTypes');
            selectedChatTypes.value = ['GlobalPlayerOnly'];
        }
    }
    
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

const rerenderMessages = () => {
    const element = document.getElementById('live-chat-content');
    if (element) {
        element.innerHTML = '';
    }
    
    for (let i = 0; i < allMessages.length; i++) {
        appendMessage(allMessages[i], true);
    }
    
    setTimeout(() => {
        const { height } = useElementSize(document.getElementById('live-chat-content'));
        scrollbarRef.value.setScrollTop(height.value);
    }, 0);
};

watch(selectedChatTypes, async (newValue) => {
    localStorage.setItem('livechat-filter-chatTypes', JSON.stringify(newValue));
    pageNumber = 1;
    len = 0;
    allMessages = [];
    const element = document.getElementById('live-chat-content');
    if (element) {
        element.innerHTML = '';
    }
    await getData(50);
    const { height } = useElementSize(document.getElementById('live-chat-content'));
    scrollbarRef.value.setScrollTop(height.value);
}, { deep: true });

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
    if (chatMessage.chatType === 'Whisper') {
        return;
    }

    let shouldDisplay = false;
    
    if (chatMessage.chatType === 'Global') {
        const isSystemMessage = chatMessage.entityId === -1;
        
        if (selectedChatTypes.value.includes('GlobalAll')) {
            shouldDisplay = true;
        } else if (selectedChatTypes.value.includes('GlobalPlayerOnly') && !isSystemMessage) {
            shouldDisplay = true;
        }
    } else {
        shouldDisplay = selectedChatTypes.value.includes(chatMessage.chatType);
    }
    
    if (!shouldDisplay) {
        return null;
    }

    const message = chatMessage.createdAt + "   '" + chatMessage.senderName + "': " + chatMessage.message;

    const element = document.getElementById('live-chat-content');

    let color;
    switch (chatMessage.chatType) {
        // Global
        case 'Global':
            color = 'var(--el-text-color-regular)';
            break;
        // Friends
        case 'Friends':
            color = '#006400';
            break;
        // Party
        case 'Party':
            color = '#FFD700';
            break;
        default:
            color = 'black';
    }

    const p = document.createElement('p');
    p.style = `color: ${color}`;
    p.innerHTML = `<font>${message}</font>`;

    if (prepend) {
        element.prepend(p);
    } else {
        element.appendChild(p);
    }

    return p;
};

emitter.on(eventTypes.OnChatMessage, (chatMessage) => {
    allMessages.push(chatMessage);
    if (allMessages.length > 500) {
        allMessages.shift();
    }
    
    if (!isActivated) {
        if (messageBuffer.length > 100) {
            messageBuffer.shift();
        }
        messageBuffer.push(chatMessage);
    } else {
        const el = appendMessage(chatMessage);
        if (el) {
            el.scrollIntoView();
        }
    }
});

let pageNumber = 1;
let len = 0;
const getData = async (pageSize) => {
    const params = { pageNumber: pageNumber, pageSize: pageSize, order: 'createdAt', desc: true };

    const types = selectedChatTypes.value;
    const hasGlobalAll = types.includes('GlobalAll');
    const hasGlobalPlayerOnly = types.includes('GlobalPlayerOnly');
    const hasFriends = types.includes('Friends');
    const hasParty = types.includes('Party');
    const hasWhisper = types.includes('Whisper');

    if ((hasGlobalAll || hasGlobalPlayerOnly) && !hasFriends && !hasParty && !hasWhisper) {
        params.chatType = 'Global';
    }
    if (!hasGlobalAll && !hasGlobalPlayerOnly) {
        const nonGlobalTypes = types.filter(t => t !== 'GlobalAll' && t !== 'GlobalPlayerOnly');
        if (nonGlobalTypes.length === 1) {
            params.chatType = nonGlobalTypes[0];
        }
    }

    if (hasGlobalPlayerOnly && !hasGlobalAll) {
        params.excludeSystemMessages = true;
    }

    const data = await api.getChatRecord(params);
    len = data.items.length;
    for (let i = 0; i < len; i++) {
        allMessages.unshift(data.items[i]);
        appendMessage(data.items[i], true);
    }
};

const canLoadMore = () => {
    return len > 0;
};

const scrollbarRef = ref();
</script>

<style scoped lang="scss">
.live-chat {
    .card {
        margin-top: 20px;
        :deep(.el-card__body) {
            .filter-container {
                margin-bottom: 12px;
            }

            .live-chat-container {
                height: calc(100vh - 300px);
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
