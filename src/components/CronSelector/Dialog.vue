<template>
    <el-dialog class="dialog" :title="t('components.cronSelector.title')" draggable append-to-body align-center :close-on-click-modal="false" width="680px">
        <el-tabs type="border-card">
            <el-tab-pane>
                <template #label>
                    <span class="icon">
                        <el-icon><Calendar /></el-icon> {{ t('components.cronSelector.seconds.name') }}
                    </span>
                </template>
                <el-scrollbar class="tabBody" :max-height="maxHeight">
                    <el-row>
                        <el-radio v-model="state.second.cronEvery" label="1">{{ t('components.cronSelector.seconds.every') }} </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.second.cronEvery" label="2">
                            {{ t('components.cronSelector.seconds.interval.prefix') }}
                            <el-input-number v-model="state.second.incrementIncrement" :min="0" :max="59"></el-input-number>
                            {{ t('components.cronSelector.seconds.interval.middle') }}
                            <el-input-number v-model="state.second.incrementStart" :min="0" :max="59"></el-input-number>
                            {{ t('components.cronSelector.seconds.interval.suffix') }}
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio class="long" v-model="state.second.cronEvery" label="3"
                            >{{ t('components.cronSelector.seconds.specific') }}
                            <el-select multiple v-model="state.second.specificSpecific">
                                <el-option v-for="(val, index) in 60" :key="index" :value="val - 1">{{ val - 1 }} </el-option>
                            </el-select>
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.second.cronEvery" label="4"
                            >{{ t('components.cronSelector.seconds.cycle.prefix') }}
                            <el-input-number v-model="state.second.rangeStart" :min="0" :max="59"></el-input-number>
                            {{ t('components.cronSelector.seconds.cycle.middle') }}
                            <el-input-number v-model="state.second.rangeEnd" :min="0" :max="59"></el-input-number>
                            {{ t('components.cronSelector.seconds.cycle.suffix')[2] }}
                        </el-radio>
                    </el-row>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <span class="icon"><el-icon><Calendar /></el-icon> {{ t('components.cronSelector.minutes.name') }}</span>
                </template>
                <el-scrollbar class="tabBody" :max-height="maxHeight">
                    <el-row>
                        <el-radio v-model="state.minute.cronEvery" label="1">{{ t('components.cronSelector.minutes.every') }} </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.minute.cronEvery" label="2"
                            >{{ t('components.cronSelector.minutes.interval.prefix') }}
                            <el-input-number v-model="state.minute.incrementIncrement" :min="0" :max="59"></el-input-number>
                            {{ t('components.cronSelector.minutes.interval.middle') }}
                            <el-input-number v-model="state.minute.incrementStart" :min="0" :max="59"></el-input-number>
                            {{ t('components.cronSelector.minutes.interval.suffix') }}
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio class="long" v-model="state.minute.cronEvery" label="3"
                            >{{ t('components.cronSelector.minutes.specific') }}
                            <el-select multiple v-model="state.minute.specificSpecific">
                                <el-option v-for="(val, index) in 60" :key="index" :value="val - 1">{{ val - 1 }} </el-option>
                            </el-select>
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.minute.cronEvery" label="4"
                            >{{ t('components.cronSelector.minutes.cycle.prefix') }}
                            <el-input-number v-model="state.minute.rangeStart" :min="0" :max="59"></el-input-number>
                            {{ t('components.cronSelector.minutes.cycle.middle') }}
                            <el-input-number v-model="state.minute.rangeEnd" :min="0" :max="59"></el-input-number>
                            {{ t('components.cronSelector.minutes.cycle.suffix') }}
                        </el-radio>
                    </el-row>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <span class="icon"><el-icon><Calendar /></el-icon> {{ t('components.cronSelector.hours.name') }}</span>
                </template>
                <el-scrollbar class="tabBody" :max-height="maxHeight">
                    <el-row>
                        <el-radio v-model="state.hour.cronEvery" label="1">{{ t('components.cronSelector.hours.every') }} </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.hour.cronEvery" label="2"
                            >{{ t('components.cronSelector.hours.interval.prefix') }}
                            <el-input-number v-model="state.hour.incrementIncrement" :min="0" :max="23"></el-input-number>
                            {{ t('components.cronSelector.hours.interval.middle') }}
                            <el-input-number v-model="state.hour.incrementStart" :min="0" :max="23"></el-input-number>
                            {{ t('components.cronSelector.hours.interval.suffix') }}
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio class="long" v-model="state.hour.cronEvery" label="3"
                            >{{ t('components.cronSelector.hours.specific') }}
                            <el-select multiple v-model="state.hour.specificSpecific">
                                <el-option v-for="(val, index) in 24" :key="index" :value="val - 1">{{ val - 1 }} </el-option>
                            </el-select>
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.hour.cronEvery" label="4"
                            >{{ t('components.cronSelector.hours.cycle.prefix') }}
                            <el-input-number v-model="state.hour.rangeStart" :min="0" :max="23"></el-input-number>
                            {{ t('components.cronSelector.hours.cycle.middle') }}
                            <el-input-number v-model="state.hour.rangeEnd" :min="0" :max="23"></el-input-number>
                            {{ t('components.cronSelector.hours.cycle.suffix') }}
                        </el-radio>
                    </el-row>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <span class="icon"><el-icon><Calendar /></el-icon> {{ t('components.cronSelector.day.name') }}</span>
                </template>
                <el-scrollbar class="tabBody" :max-height="maxHeight">
                    <el-row>
                        <el-radio v-model="state.day.cronEvery" label="1">{{ t('components.cronSelector.day.every') }} </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.day.cronEvery" label="2"
                            >{{ t('components.cronSelector.day.intervalWeek.prefix') }}
                            <el-input-number v-model="state.week.incrementIncrement" :min="0" :max="6"></el-input-number>
                            {{ t('components.cronSelector.day.intervalWeek.middle') }}
                            <el-select v-model="state.week.incrementStart">
                                <el-option v-for="(val, index) in tm('components.cronSelector.weeks')" :key="index" :label="rt(val)" :value="index"></el-option>
                            </el-select>
                            {{ t('components.cronSelector.day.intervalWeek.suffix') }}
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.day.cronEvery" label="3"
                            >{{ t('components.cronSelector.day.intervalDay.prefix') }}
                            <el-input-number v-model="state.day.incrementIncrement" :min="1" :max="31"></el-input-number>
                            {{ t('components.cronSelector.day.intervalDay.middle') }}
                            <el-input-number v-model="state.day.incrementStart" :min="1" :max="31"></el-input-number>
                            {{ t('components.cronSelector.day.intervalDay.suffix') }}
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio class="long" v-model="state.day.cronEvery" label="4"
                            >{{ t('components.cronSelector.day.specificWeek') }}
                            <el-select multiple v-model="state.week.specificSpecific">
                                <el-option
                                    v-for="(val, index) in tm('components.cronSelector.weeks')"
                                    :key="index"
                                    :label="rt(val)"
                                    :value="['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][index]"
                                ></el-option>
                            </el-select>
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio class="long" v-model="state.day.cronEvery" label="5"
                            >{{ t('components.cronSelector.day.specificDay') }}
                            <el-select multiple v-model="state.day.specificSpecific">
                                <el-option v-for="(val, index) in 31" :key="index" :value="val">{{ val }} </el-option>
                            </el-select>
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.day.cronEvery" label="6">{{ t('components.cronSelector.day.lastDay') }} </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.day.cronEvery" label="7">{{ t('components.cronSelector.day.lastWeekday') }} </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.day.cronEvery" label="8"
                            >{{ t('components.cronSelector.day.lastWeek.prefix') }}
                            <el-select v-model="state.week.cronLastSpecificDomDay">
                                <el-option v-for="(val, index) in tm('components.cronSelector.weeks')" :key="index" :label="rt(val)" :value="index"></el-option>
                            </el-select>
                            {{ t('components.cronSelector.day.lastWeek.middle') }}
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.day.cronEvery" label="9">
                            {{ t('components.cronSelector.day.beforeEndMonth.prefix') }}
                            <el-input-number v-model="state.day.cronDaysBeforeEomMinus" :min="1" :max="31"></el-input-number>
                            {{ t('components.cronSelector.day.beforeEndMonth.middle') }}
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.day.cronEvery" label="10"
                            >{{ t('components.cronSelector.day.nearestWeekday.prefix') }}
                            <el-input-number v-model="state.day.cronDaysNearestWeekday" :min="1" :max="31"></el-input-number>
                            {{ t('components.cronSelector.day.nearestWeekday.middle') }}
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.day.cronEvery" label="11"
                            >{{ t('components.cronSelector.day.someWeekday.prefix') }}
                            <el-input-number v-model="state.week.cronNthDayNth" :min="1" :max="5"></el-input-number>
                            {{ t('components.cronSelector.day.someWeekday.middle') }}
                            <el-select v-model="state.week.cronNthDayDay" style="margin-left: 4px">
                                <el-option v-for="(val, index) in tm('components.cronSelector.weeks')" :key="index" :label="rt(val)" :value="index"></el-option>
                            </el-select>
                            {{ t('components.cronSelector.day.someWeekday.suffix') }}
                        </el-radio>
                    </el-row>
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <span class="icon"><el-icon><Calendar /></el-icon> {{ t('components.cronSelector.month.name') }}</span>
                </template>
                <el-scrollbar class="tabBody" :max-height="maxHeight">
                    <el-row>
                        <el-radio v-model="state.month.cronEvery" label="1">{{ t('components.cronSelector.month.every') }} </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.month.cronEvery" label="2"
                            >{{ t('components.cronSelector.month.interval.prefix') }}
                            <el-input-number v-model="state.month.incrementIncrement" :min="0" :max="12"></el-input-number>
                            {{ t('components.cronSelector.month.interval.middle') }}
                            <el-input-number v-model="state.month.incrementStart" :min="0" :max="12"></el-input-number>
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio class="long" v-model="state.month.cronEvery" label="3"
                            >{{ t('components.cronSelector.month.specific') }}
                            <el-select multiple v-model="state.month.specificSpecific">
                                <el-option v-for="(val, index) in 12" :key="index" :label="val" :value="val"></el-option>
                            </el-select>
                        </el-radio>
                    </el-row>
                    <el-row>
                        <el-radio v-model="state.month.cronEvery" label="4"
                            >{{ t('components.cronSelector.month.cycle.prefix') }}
                            <el-input-number v-model="state.month.rangeStart" :min="1" :max="12"></el-input-number>
                            {{ t('components.cronSelector.month.cycle.middle') }}
                            <el-input-number v-model="state.month.rangeEnd" :min="1" :max="12"></el-input-number>
                        </el-radio>
                    </el-row>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
        <div class="bottom">
            <div class="value">
                <span>{{ t('components.cronSelector.preview') }}&nbsp;</span>
                <el-tag type="primary">
                    {{ state.cron }}
                </el-tag>
            </div>
            <div>
                <el-button type="primary" @click="handleSave">{{ t('global.button.save') }}</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { i18n } from '~/plugins/i18n';
import { Calendar } from '@element-plus/icons-vue';

const { t, tm, rt } = i18n.global;

const props = defineProps({
    cronValue: {
        type: String,
    },
    maxHeight: {
        type: [Number, String],
    },
});

const state = reactive({
    second: {
        cronEvery: '1',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: [],
    },
    minute: {
        cronEvery: '1',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: [],
    },
    hour: {
        cronEvery: '1',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: [],
    },
    day: {
        cronEvery: '1',
        incrementStart: 1,
        incrementIncrement: 1,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: [],
        cronDaysBeforeEomMinus: 0,
        cronDaysNearestWeekday: 0,
    },
    week: {
        cronEvery: '1',
        incrementStart: 1,
        incrementIncrement: 1,
        specificSpecific: [],
        cronLastSpecificDomDay: 1,
        cronNthDayDay: 1,
        cronNthDayNth: 1,
    },
    month: {
        cronEvery: '1',
        incrementStart: 3,
        incrementIncrement: 5,
        rangeStart: 0,
        rangeEnd: 0,
        specificSpecific: [],
    },
    secondsText: computed(() => {
        let seconds = '';
        let cronEvery = state.second.cronEvery;
        switch (cronEvery.toString()) {
            case '1':
                seconds = '*';
                break;
            case '2':
                seconds = state.second.incrementStart + '/' + state.second.incrementIncrement;
                break;
            case '3':
                state.second.specificSpecific.map((val) => {
                    seconds += val + ',';
                });
                seconds = seconds.slice(0, -1);
                break;
            case '4':
                seconds = state.second.rangeStart + '-' + state.second.rangeEnd;
                break;
        }
        return seconds;
    }),
    minutesText: computed(() => {
        let minutes = '';
        let cronEvery = state.minute.cronEvery;
        switch (cronEvery.toString()) {
            case '1':
                minutes = '*';
                break;
            case '2':
                minutes = state.minute.incrementStart + '/' + state.minute.incrementIncrement;
                break;
            case '3':
                state.minute.specificSpecific.map((val) => {
                    minutes += val + ',';
                });
                minutes = minutes.slice(0, -1);
                break;
            case '4':
                minutes = state.minute.rangeStart + '-' + state.minute.rangeEnd;
                break;
        }
        return minutes;
    }),
    hoursText: computed(() => {
        let hours = '';
        let cronEvery = state.hour.cronEvery;
        switch (cronEvery.toString()) {
            case '1':
                hours = '*';
                break;
            case '2':
                hours = state.hour.incrementStart + '/' + state.hour.incrementIncrement;
                break;
            case '3':
                state.hour.specificSpecific.map((val) => {
                    hours += val + ',';
                });
                hours = hours.slice(0, -1);
                break;
            case '4':
                hours = state.hour.rangeStart + '-' + state.hour.rangeEnd;
                break;
        }
        return hours;
    }),
    daysText: computed(() => {
        let days = '';
        let cronEvery = state.day.cronEvery;
        switch (cronEvery.toString()) {
            case '1':
                break;
            case '2':
            case '4':
            case '11':
            case '8':
                days = '?';
                break;
            case '3':
                days = state.day.incrementStart + '/' + state.day.incrementIncrement;
                break;
            case '5':
                state.day.specificSpecific.map((val) => {
                    days += val + ',';
                });
                days = days.slice(0, -1);
                break;
            case '6':
                days = 'L';
                break;
            case '7':
                days = 'LW';
                break;
            case '9':
                days = 'L-' + state.day.cronDaysBeforeEomMinus;
                break;
            case '10':
                days = state.day.cronDaysNearestWeekday + 'W';
                break;
        }
        return days;
    }),
    weeksText: computed(() => {
        let weeks = '';
        let cronEvery = state.day.cronEvery;
        switch (cronEvery.toString()) {
            case '1':
            case '3':
            case '5':
                weeks = '?';
                break;
            case '2':
                weeks = state.week.incrementStart + '/' + state.week.incrementIncrement;
                break;
            case '4':
                state.week.specificSpecific.map((val) => {
                    weeks += val + ',';
                });
                weeks = weeks.slice(0, -1);
                break;
            case '6':
            case '7':
            case '9':
            case '10':
                weeks = '?';
                break;
            case '8':
                weeks = state.week.cronLastSpecificDomDay + 'L';
                break;
            case '11':
                weeks = state.week.cronNthDayDay + '#' + state.week.cronNthDayNth;
                break;
        }
        return weeks;
    }),
    monthsText: computed(() => {
        let months = '';
        let cronEvery = state.month.cronEvery;
        switch (cronEvery.toString()) {
            case '1':
                months = '*';
                break;
            case '2':
                months = state.month.incrementStart + '/' + state.month.incrementIncrement;
                break;
            case '3':
                state.month.specificSpecific.map((val) => {
                    months += val + ',';
                });
                months = months.slice(0, -1);
                break;
            case '4':
                months = state.month.rangeStart + '-' + state.month.rangeEnd;
                break;
        }
        return months;
    }),
    cron: computed(() => {
        return `${state.secondsText || '*'} ${state.minutesText || '*'} ${state.hoursText || '*'} ${state.daysText || '*'} ${state.monthsText || '*'} ${state.weeksText || '?'}`;
    }),
});

watch(
    () => props.cronValue,
    (newCron) => {
        if (typeof newCron !== 'string' || !newCron) return false;
        let crons = newCron.split(' ');
        const offset = crons.length === 5 ? -1 : 0;
        // parse seconds
        let secondsText = crons.length === 5 ? '0' : crons[0].trim();
        if (secondsText === '*') {
            state.second.cronEvery = '1';
        } else if (secondsText.includes('/')) {
            state.second.cronEvery = '2';
            let secondsTexts = secondsText.split('/');
            state.second.incrementStart = parseInt(secondsTexts[0]);
            state.second.incrementIncrement = parseInt(secondsTexts[1]);
        } else if (secondsText.includes(',') || isFinite(secondsText)) {
            state.second.cronEvery = '3';
            state.second.specificSpecific = secondsText.split(',').map((item) => parseInt(item));
        } else if (secondsText.includes('-')) {
            state.second.cronEvery = '4';
            let secondsTexts = secondsText.split('-');
            state.second.rangeStart = parseInt(secondsTexts[0]);
            state.second.rangeEnd = parseInt(secondsTexts[1]);
        }
        // parse minutes
        let minutesText = crons[1 + offset].trim();
        if (minutesText === '*') {
            state.minute.cronEvery = '1';
        } else if (minutesText.includes('/')) {
            state.minute.cronEvery = '2';
            let minutesTexts = minutesText.split('/');
            state.minute.incrementStart = parseInt(minutesTexts[0]);
            state.minute.incrementIncrement = parseInt(minutesTexts[1]);
        } else if (minutesText.includes(',') || isFinite(minutesText)) {
            state.minute.cronEvery = '3';
            state.minute.specificSpecific = minutesText.split(',').map((item) => parseInt(item));
        } else if (minutesText.includes('-')) {
            state.minute.cronEvery = '4';
            let minutesTexts = minutesText.split('-');
            state.minute.rangeStart = parseInt(minutesTexts[0]);
            state.minute.rangeEnd = parseInt(minutesTexts[1]);
        }
        // parse hours
        let hoursText = crons[2 + offset].trim();
        if (hoursText === '*') {
            state.hour.cronEvery = '1';
        } else if (hoursText.includes('/')) {
            state.hour.cronEvery = '2';
            let hoursTexts = hoursText.split('/');
            state.hour.incrementStart = parseInt(hoursTexts[0]);
            state.hour.incrementIncrement = parseInt(hoursTexts[1]);
        } else if (hoursText.includes(',') || isFinite(hoursText)) {
            state.hour.cronEvery = '3';
            state.hour.specificSpecific = hoursText.split(',').map((item) => parseInt(item));
        } else if (hoursText.includes('-')) {
            state.hour.cronEvery = '4';
            let hoursTexts = hoursText.split('-');
            state.hour.rangeStart = parseInt(hoursTexts[0]);
            state.hour.rangeEnd = parseInt(hoursTexts[1]);
        }
        // parse days weeks
        let daysText = crons[3 + offset].trim();
        let weeksText = crons[5 + offset].trim();
        if (daysText.includes('/')) {
            state.day.cronEvery = '3';
            let daysTexts = daysText.split('/');
            state.day.incrementStart = parseInt(daysTexts[0]);
            state.day.incrementIncrement = parseInt(daysTexts[1]);
        } else if (daysText.includes(',') || isFinite(daysText)) {
            state.day.cronEvery = '5';
            state.day.specificSpecific = daysText.split(',').map((item) => parseInt(item));
        } else if (daysText === 'L') {
            state.day.cronEvery = '6';
        } else if (daysText === 'LW') {
            state.day.cronEvery = '7';
        } else if (daysText.startsWith('L-')) {
            state.day.cronEvery = '9';
            state.day.cronDaysBeforeEomMinus = parseInt(daysText.replaceAll('L-', ''));
        } else if (daysText.endsWith('W')) {
            state.day.cronEvery = '10';
            state.day.cronDaysNearestWeekday = parseInt(daysText.replaceAll('W', ''));
        } else if (daysText === '?') {
            if (weeksText.includes('/')) {
                state.day.cronEvery = '2';
                let weeksTexts = weeksText.split('/');
                state.week.incrementStart = parseInt(weeksTexts[0]);
                state.week.incrementIncrement = parseInt(weeksTexts[1]);
            } else if (weeksText.includes(',') || isFinite(weeksText)) {
                state.day.cronEvery = '4';
                state.week.specificSpecific = weeksText.split(',').map((item) => item);
            } else if (weeksText.includes('#')) {
                state.day.cronEvery = '11';
                let weeksTexts = weeksText.split('#');
                state.week.cronNthDayDay = parseInt(weeksTexts[0]);
                state.week.cronNthDayNth = parseInt(weeksTexts[1]);
            } else if (weeksText.endsWith('L')) {
                state.day.cronEvery = '8';
                state.week.cronLastSpecificDomDay = parseInt(weeksText.replaceAll('L', ''));
            }
        } else {
            state.day.cronEvery = '1';
        }

        // parse months
        let monthsText = crons[4 + offset].trim();
        if (monthsText === '*') {
            state.month.cronEvery = '1';
        } else if (monthsText.includes('/')) {
            state.month.cronEvery = '2';
            let monthsTexts = monthsText.split('/');
            state.month.incrementStart = parseInt(monthsTexts[0]);
            state.month.incrementIncrement = parseInt(monthsTexts[1]);
        } else if (monthsText.includes(',') || isFinite(monthsText)) {
            state.month.cronEvery = '3';
            state.month.specificSpecific = monthsText.split(',').map((item) => parseInt(item));
        } else if (monthsText.includes('-')) {
            state.month.cronEvery = '4';
            let monthsTexts = monthsText.split('-');
            state.month.rangeStart = parseInt(monthsTexts[0]);
            state.month.rangeEnd = parseInt(monthsTexts[1]);
        }
    },
    {
        immediate: true,
    }
);

const reset = (data) => {
    for (let i in data) {
        if (data[i] instanceof Object) {
            reset(data[i]);
        } else {
            switch (typeof data[i]) {
                case 'object':
                    data[i] = [];
                    break;
                case 'string':
                    data[i] = '';
                    break;
            }
        }
    }
};

const emit = defineEmits(['save']);

const handleSave = () => {
    emit('save', state.cron);
};
</script>

<style lang="scss">
.dialog {
    .icon {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .el-tabs {
        box-shadow: none;
    }

    .tabBody {
        .el-row {
            margin: 20px 0;

            .long {
                .el-select {
                    width: 200px;
                }
            }

            .el-input-number {
                width: 130px;
            }
        }
    }

    .bottom {
        width: 100%;
        margin-top: 5px;
        display: flex;
        align-items: center;
        justify-content: space-around;

        .value {
            float: left;
            font-size: 14px;
            vertical-align: middle;

            span:nth-child(1) {
                color: red;
            }
        }
    }

    .el-select {
        width: 200px;
    }
}
</style>
