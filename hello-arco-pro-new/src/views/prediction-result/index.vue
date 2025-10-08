<template>
  <div class="container">
    <Breadcrumb :items="['menu.predictionResult', 'menu.predictionResult.index']" />
    <a-card class="general-card" :bordered="false">
      <template #title>
        <div class="title">预测结果</div>
      </template>
      
      <!-- 搜索表单 -->
      <div class="search-form">
        <a-form :model="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item field="name" label="任务名称">
            <a-input
              v-model="searchForm.name"
              placeholder="请输入任务名称"
              allow-clear
            />
          </a-form-item>
          <a-form-item field="status" label="状态">
            <a-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              allow-clear
            >
              <a-option value="running">运行中</a-option>
              <a-option value="completed">已完成</a-option>
              <a-option value="failed">失败</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              查询
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button @click="handleReset">
              重置
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      
      <!-- 数据表格 -->
      <a-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
        <template #accuracy="{ record }">
          <span v-if="record.status === 'completed'" class="accuracy-text">
            {{ record.accuracy ? `${(record.accuracy * 100).toFixed(2)}%` : '暂无数据' }}
          </span>
          <span v-else>--</span>
        </template>
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            @click="handleView(record)"
          >
            查看
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="handleDownload(record)"
            :disabled="record.status !== 'completed'"
          >
            下载
          </a-button>
          <a-popconfirm
            content="确定要删除这个结果吗？"
            @ok="handleDelete(record)"
          >
            <a-button
              type="text"
              size="small"
              status="danger"
            >
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      
      <!-- 结果详情弹窗 -->
      <a-modal
        :visible="detailModalVisible"
        @update:visible="detailModalVisible = $event"
        title="预测结果详情"
        :width="800"
        @cancel="handleDetailCancel"
      >
        <div v-if="currentResult" class="result-detail">
          <a-descriptions :column="2" :title="'基本信息'">
            <a-descriptions-item label="任务名称">{{ currentResult.name }}</a-descriptions-item>
            <a-descriptions-item label="模型名称">{{ currentResult.modelName }}</a-descriptions-item>
            <a-descriptions-item label="数据集名称">{{ currentResult.datasetName }}</a-descriptions-item>
            <a-descriptions-item label="预测长度">{{ currentResult.predictionLength }}</a-descriptions-item>
            <a-descriptions-item label="置信度">{{ currentResult.confidence ? `${(currentResult.confidence * 100).toFixed(2)}%` : '--' }}</a-descriptions-item>
            <a-descriptions-item label="准确率">{{ currentResult.accuracy ? `${(currentResult.accuracy * 100).toFixed(2)}%` : '--' }}</a-descriptions-item>
            <a-descriptions-item label="创建时间">{{ currentResult.createdAt }}</a-descriptions-item>
            <a-descriptions-item label="完成时间">{{ currentResult.completedAt }}</a-descriptions-item>
          </a-descriptions>
          
          <a-divider>预测结果图表</a-divider>
          <div class="chart-container">
            <v-chart
              :option="chartOption"
              :loading="chartLoading"
              style="height: 400px;"
            />
          </div>
          
          <a-divider>预测数据</a-divider>
          <a-table
            :columns="resultColumns"
            :data="currentResult.predictions"
            :pagination="{ pageSize: 10 }"
          />
        </div>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { Message } from '@arco-design/web-vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
// Using local mock data in this view; API imports removed to avoid unused-import warnings
// @ts-ignore: SFC default export typing
import Breadcrumb from '../../components/breadcrumb/index.vue';

// 注册ECharts组件
use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

// 搜索表单
const searchForm = reactive({
  name: '',
  status: undefined
});

// 表格数据
const tableData = ref([
  {
    id: '1',
    name: '销售预测任务1',
    modelName: 'LSTM模型',
    datasetName: '销售历史数据',
    status: 'completed',
    accuracy: 0.923,
    createdAt: '2023-11-15 10:30:00',
    completedAt: '2023-11-15 10:45:00'
  },
  {
    id: '2',
    name: '流量预测任务',
    modelName: 'GRU模型',
    datasetName: '网站流量数据',
    status: 'completed',
    accuracy: 0.895,
    createdAt: '2023-11-14 16:45:00',
    completedAt: '2023-11-14 17:00:00'
  },
  {
    id: '3',
    name: '库存预测任务',
    modelName: 'Transformer模型',
    datasetName: '库存历史数据',
    status: 'running',
    accuracy: null,
    createdAt: '2023-11-15 09:15:00',
    completedAt: null
  }
]);

// 表格列配置
const columns = [
  { title: '任务名称', dataIndex: 'name', width: 200 },
  { title: '模型名称', dataIndex: 'modelName', width: 150 },
  { title: '数据集名称', dataIndex: 'datasetName', width: 150 },
  { title: '状态', slotName: 'status', width: 100 },
  { title: '准确率', slotName: 'accuracy', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
  { title: '完成时间', dataIndex: 'completedAt', width: 180 },
  { title: '操作', slotName: 'operations', width: 200, fixed: 'right' as const }
];

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: tableData.value.length
});

// 加载状态
const loading = ref(false);

// 详情弹窗
const detailModalVisible = ref(false);
const currentResult = ref<any>(null);
const chartLoading = ref(false);

// 结果表格列配置
const resultColumns = [
  { title: '时间', dataIndex: 'timestamp', width: 200 },
  { title: '预测值', dataIndex: 'value', width: 100 },
  { title: '置信度', dataIndex: 'confidence', width: 100 },
  { title: '上界', dataIndex: 'upperBound', width: 100 },
  { title: '下界', dataIndex: 'lowerBound', width: 100 }
];

// 图表配置
const chartOption = computed(() => {
  if (!currentResult.value || !currentResult.value.predictions) return {};
  
  const predictions = currentResult.value.predictions;
  const timestamps = predictions.map((p: any) => p.timestamp);
  const values = predictions.map((p: any) => p.value);
  const upperBounds = predictions.map((p: any) => p.upperBound);
  const lowerBounds = predictions.map((p: any) => p.lowerBound);
  
  return {
    title: {
      text: '时序数据预测结果'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['预测值', '上界', '下界']
    },
    xAxis: {
      type: 'category',
      data: timestamps,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '预测值',
        type: 'line',
        data: values,
        smooth: true,
        lineStyle: {
          color: '#165dff'
        }
      },
      {
        name: '上界',
        type: 'line',
        data: upperBounds,
        smooth: true,
        lineStyle: {
          color: '#00b42a',
          type: 'dashed'
        }
      },
      {
        name: '下界',
        type: 'line',
        data: lowerBounds,
        smooth: true,
        lineStyle: {
          color: '#f53f3f',
          type: 'dashed'
        }
      }
    ]
  };
});

// 生成模拟预测数据
const generateMockPredictions = () => {
  const predictions = [];
  const now = new Date();

  for (let i = 0; i < 10; ) {
    const date = new Date(now);
    date.setDate(date.getDate() + i + 1);

    const value = 100 + Math.random() * 50;
    const confidence = 0.9 + Math.random() * 0.1;

    predictions.push({
      timestamp: date.toLocaleDateString('zh-CN'),
      value: parseFloat(value.toFixed(2)),
      confidence: parseFloat(confidence.toFixed(2)),
      upperBound: parseFloat((value * (1 + (1 - confidence))).toFixed(2)),
      lowerBound: parseFloat((value * (1 - (1 - confidence))).toFixed(2))
    });

    i = i + 1;
  }

  return predictions;
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  try {
    // 实际项目中应该从后端获取数据
    // const res = await queryPredictionResultList({ ... });
    // tableData.value = res.data.list;
    // pagination.total = res.data.total;
    
    // 这里使用模拟数据
    let filteredData = [...tableData.value];
    
    if (searchForm.name) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchForm.name.toLowerCase())
      );
    }
    
    if (searchForm.status) {
      filteredData = filteredData.filter(item => item.status === searchForm.status);
    }
    
    pagination.total = filteredData.length;
    
  const { current, pageSize } = pagination;
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
    tableData.value = filteredData.slice(start, end);
  } catch (error) {
    Message.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

// 查看详情
const handleView = async (record: any) => {
  chartLoading.value = true;
  try {
    // 实际项目中应该从后端获取详情
    // const res = await getPredictionResults(record.id);
    // currentResult.value = res.data;
    
    // 这里使用模拟数据
    currentResult.value = {
      ...record,
      predictionLength: 10,
      confidence: 0.95,
      predictions: generateMockPredictions()
    };
    
    detailModalVisible.value = true;
  } catch (error) {
    Message.error('获取详情失败');
  } finally {
    chartLoading.value = false;
  }
};

// 下载结果
const handleDownload = async (record: any) => {
  try {
    // 实际项目中应该调用下载接口
    // await downloadPredictionResults(record.id);
    
    Message.success('下载成功');
  } catch (error) {
    Message.error('下载失败');
  }
};

// 删除结果
const handleDelete = async (record: any) => {
  try {
    // 实际项目中应该调用删除接口
    // await deletePrediction(record.id);
    
    // 这里从本地数据中删除
    const index = tableData.value.findIndex(item => item.id === record.id);
    if (index > -1) {
      tableData.value.splice(index, 1);
      pagination.total = tableData.value.length;
    }
    
    Message.success('删除成功');
  } catch (error) {
    Message.error('删除失败');
  }
};



// 获取状态颜色
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    running: 'blue',
    completed: 'green',
    failed: 'red'
  };
  return colors[status] || 'gray';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    running: '运行中',
    completed: '已完成',
    failed: '失败'
  };
  return texts[status] || status;
};

// 搜索
const handleSearch = () => {
  pagination.current = 1;
  loadData();
};

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    status: undefined
  });
  pagination.current = 1;
  loadData();
};

// 分页变化
const handlePageChange = (page: number) => {
  pagination.current = page;
  loadData();
};

// 每页条数变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  pagination.current = 1;
  loadData();
};

// 关闭详情弹窗
const handleDetailCancel = () => {
  detailModalVisible.value = false;
  currentResult.value = null;
};

// 初始加载
loadData();
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}

.title {
  font-size: 20px;
  font-weight: 500;
}

.search-form {
  margin-bottom: 20px;
  padding: 20px;
  background: var(--color-fill-2);
  border-radius: 6px;
}

.accuracy-text {
  color: var(--color-success-6);
  font-weight: 500;
}

.result-detail {
  max-height: 600px;
  overflow-y: auto;
}

.chart-container {
  margin: 20px 0;
}
</style>