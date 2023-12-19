<template>
    <div ref="pieChartRef" :style="{ height: height, width: width }" />
</template>
<script setup>
import * as echarts from 'echarts';

const pieChartRef = ref();
const props = defineProps({
    width: {
        type: String,
        default: '100%',
    },
    height: {
        type: String,
        default: '200px',
    },
    option: {
        type: Object, // { title , current, max, unit }
        required: true,
    },
});

function formatNumber(val) {
    return Number(val.toFixed(2));
}

function initChart() {
    let myChart = echarts.getInstanceByDom(pieChartRef.value);
    if (myChart === null || myChart === undefined) {
        myChart = echarts.init(pieChartRef.value);
    }

    const theme = 'light';
    const option = {
        title: [
            {
                text: `{a|${props.option.current}/}{b|${props.option.max} ${props.option.unit || ''}}`,
                textStyle: {
                    rich: {
                        a: {
                            fontSize: '22',
                        },
                        b: {
                            fontSize: '14',
                            padding: [5, 0, 0, 0],
                        },
                    },

                    color: theme === 'dark' ? '#ffffff' : '#0f0f0f',
                    lineHeight: 25,
                    // fontSize: 20,
                    fontWeight: 500,
                },
                left: '50%',
                top: '42%',
                // subtext: props.option.title,
                // subtextStyle: {
                //     color: theme === 'dark' ? '#BBBFC4' : '#646A73',
                //     fontSize: 13,
                // },
                textAlign: 'center',
            },
        ],
        polar: {
            radius: ['71%', '80%'],
            center: ['50%', '50%'],
        },
        angleAxis: {
            max: 100,
            show: false,
        },
        radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
        },
        series: [
            {
                type: 'bar',
                roundCap: true,
                barWidth: 30,
                showBackground: true,
                coordinateSystem: 'polar',
                backgroundStyle: {
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 94, 235, 0.05)',
                },
                color: [
                    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        {
                            offset: 0,
                            color: 'rgba(81, 192, 255, .1)',
                        },
                        {
                            offset: 1,
                            color: '#4261F6',
                        },
                    ]),
                ],
                label: {
                    show: false,
                },
                data: [props.option.current / props.option.max * 100],
            },
            {
                type: 'pie',
                radius: ['0%', '60%'],
                center: ['50%', '50%'],
                label: {
                    show: false,
                },
                color: theme === 'dark' ? '#16191D' : '#fff',
                data: [
                    {
                        value: 0,
                        itemStyle: {
                            shadowColor: theme === 'dark' ? '#16191D' : 'rgba(0, 94, 235, 0.1)',
                            shadowBlur: 5,
                        },
                    },
                ],
            },
        ],
    };

    // 渲染数据
    myChart.setOption(option, true);
}

function changeChartSize() {
    echarts.getInstanceByDom(pieChartRef.value)?.resize();
}

watch(
    () => props.option,
    (val) => {
        if (val) {
            nextTick(() => {
                initChart();
            });
        }
    }
);

onMounted(() => {
    initChart();
    window.addEventListener('resize', changeChartSize);
});

onBeforeUnmount(() => {
    echarts.getInstanceByDom(pieChartRef.value).dispose();
    window.removeEventListener('resize', changeChartSize);
});
</script>

<style lang="scss" scoped></style>
