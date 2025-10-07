<template>
  <div class="container">
    <a-card class="general-card" :bordered="false">
      <template #title>
        <div class="title">预测任务</div>
      </template>
      <template #extra>
        <a-button type="primary" @click="showCreateModal">
          <template #icon>
            <icon-plus />
          </template>
          提交预测任务
        </a-button>
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
              <a-option value="pending">待处理</a-option>
              <a-option value="running">运行中</a-option>
              <a-option value="completed">已完成</a-option>
              <a-option value="failed">失败</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">搜索</a-button>
            <a-button @click="handleReset">重置</a-button>
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
        <template #progress="{ record }">
          <a-progress
            :percent="record.progress"
            :size="'small'"
            :show-text="true"
          />
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
            @click="handleResults(record)"
            :disabled="record.status !== 'completed'"
          >
            结果
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
            content="确定要删除这个任务吗？"
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
    </a-card>

    <!-- 提交预测任务模态框 -->
    <a-modal
      :visible="createModalVisible"
      @update:visible="createModalVisible = $event"
      title="提交预测任务"
      :width="600"
      @ok="handleCreate"
      @cancel="handleCreateCancel"
    >
      <a-form :model="createForm" :rules="createRules" ref="createFormRef">
        <a-form-item label="任务名称" field="name">
          <a-input v-model="createForm.name" placeholder="请输入任务名称" />
        </a-form-item>
        <a-form-item label="数据集" field="datasetId">
          <a-select v-model="createForm.datasetId" placeholder="请选择数据集">
            <a-option
              v-for="dataset in datasetList"
              :key="dataset.id"
              :value="dataset.id"
            >
              {{ dataset.name }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="模型" field="modelId">
          <a-select v-model="createForm.modelId" placeholder="请选择模型">
            <a-option
              v-for="model in modelList"
              :key="model.id"
              :value="model.id"
            >
              {{ model.name }} ({{ model.type.toUpperCase() }})
            </a-option>
          </a-select>
        </a-form-item>
        <a-divider>预测参数</a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="预测长度" field="predictionLength">
              <a-input-number
                v-model="createForm.predictionLength"
                :min="1"
                :max="100"
                placeholder="请输入预测长度"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="置信度" field="confidence">
              <a-slider
                v-model="createForm.confidence"
                :min="0.5"
                :max="0.99"
                :step="0.01"
                :show-tooltip="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 预测结果模态框 -->
    <a-modal
      :visible="resultsModalVisible"
      @update:visible="resultsModalVisible = $event"
      title="预测结果"
      :width="800"
      @cancel="handleResultsCancel"
    >
      <div v-if="currentResults">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="任务ID">
            {{ currentResults.predictionId }}
          </a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="getStatusColor(currentResults.status)">
              {{ getStatusText(currentResults.status) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="RMSE">
            {{ currentResults.results.metrics.rmse.toFixed(4) }}
          </a-descriptions-item>
          <a-descriptions-item label="MAPE">
            {{ (currentResults.results.metrics.mape * 100).toFixed(2) }}%
          </a-descriptions-item>
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
          :data="currentResults.results.predictions"
          :pagination="{ pageSize: 10 }"
        />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconPlus } from '@arco-design/web-vue/es/icon';
import { queryPredictionList, createPrediction, getPredictionResults, deletePrediction, downloadPredictionResults } from '@/api/prediction';
import { queryDatasetList } from '@/api/dataset';
import { queryModelList } from '@/api/model';
import type { PredictionTaskRecord, PredictionParams, PredictionCreateParams, PredictionResult } from '@/api/prediction';
import type { DatasetRecord } from '@/api/dataset';
import type { ModelRecord } from '@/api/model';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

// 响应式数据
const loading = ref(false);
const chartLoading = ref(false);
const tableData = ref<PredictionTaskRecord[]>([]);
const datasetList = ref<DatasetRecord[]>([]);
const modelList = ref<ModelRecord[]>([]);
const createModalVisible = ref(false);
const resultsModalVisible = ref(false);
const currentResults = ref<PredictionResult | null>(null);

// 搜索表单
const searchForm = reactive({
  name: '',
  status: undefined as 'pending' | 'running' | 'completed' | 'failed' | undefined
});

// 创建表单
const createForm = reactive({
  name: '',
  datasetId: '',
  modelId: '',
  predictionLength: 10,
  confidence: 0.95
});

const createRules = {
  name: [{ required: true, message: '请输入任务名称' }],
  datasetId: [{ required: true, message: '请选择数据集' }],
  modelId: [{ required: true, message: '请选择模型' }],
  predictionLength: [{ required: true, message: '请输入预测长度' }]
};

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
});

// 表格列配置
const columns = [
  { title: 'ID', dataIndex: 'id', width: 200 },
  { title: '任务名称', dataIndex: 'name', width: 200 },
  { title: '状态', slotName: 'status', width: 100 },
  { title: '进度', slotName: 'progress', width: 150 },
  { title: '预测长度', dataIndex: 'parameters.predictionLength', width: 100 },
  { title: '置信度', dataIndex: 'parameters.confidence', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
  { title: '完成时间', dataIndex: 'completedAt', width: 180 },
  { title: '操作', slotName: 'operations', width: 200, fixed: 'right' as const }
];

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
  if (!currentResults.value) return {};
  
  const predictions = currentResults.value.results.predictions;
  const timestamps = predictions.map(p => p.timestamp);
  const values = predictions.map(p => p.value);
  const upperBounds = predictions.map(p => p.upperBound);
  const lowerBounds = predictions.map(p => p.lowerBound);
  
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

// 方法
const loadData = async () => {
  loading.value = true;
  try {
    const params: PredictionParams = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchForm
    };
    const res = await queryPredictionList(params);
    tableData.value = res.data.list;
    pagination.total = res.data.total;
  } catch (error) {
    Message.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

const loadDatasetList = async () => {
  try {
    const res = await queryDatasetList({ current: 1, pageSize: 1000 });
    datasetList.value = res.data.list.filter(item => item.status === 'ready');
  } catch (error) {
    Message.error('加载数据集列表失败');
  }
};

const loadModelList = async () => {
  try {
    const res = await queryModelList({ current: 1, pageSize: 1000 });
    modelList.value = res.data.list.filter(item => item.status === 'ready');
  } catch (error) {
    Message.error('加载模型列表失败');
  }
};

const handleSearch = () => {
  pagination.current = 1;
  loadData();
};

const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    status: undefined
  });
  pagination.current = 1;
  loadData();
};

const handlePageChange = (page: number) => {
  pagination.current = page;
  loadData();
};

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  pagination.current = 1;
  loadData();
};

const showCreateModal = () => {
  createModalVisible.value = true;
  Object.assign(createForm, {
    name: '',
    datasetId: '',
    modelId: '',
    predictionLength: 10,
    confidence: 0.95
  });
};

const handleCreate = async () => {
  try {
    const params: PredictionCreateParams = {
      name: createForm.name,
      datasetId: createForm.datasetId,
      modelId: createForm.modelId,
      parameters: {
        predictionLength: createForm.predictionLength,
        confidence: createForm.confidence
      }
    };
    
    await createPrediction(params);
    Message.success('任务提交成功');
    createModalVisible.value = false;
    loadData();
  } catch (error) {
    Message.error('任务提交失败');
  }
};

const handleCreateCancel = () => {
  createModalVisible.value = false;
};

const handleView = (record: PredictionTaskRecord) => {
  Message.info('查看功能待实现');
};

const handleResults = async (record: PredictionTaskRecord) => {
  try {
    chartLoading.value = true;
    const res = await getPredictionResults(record.id);
    currentResults.value = res.data;
    resultsModalVisible.value = true;
  } catch (error) {
    Message.error('获取结果失败');
  } finally {
    chartLoading.value = false;
  }
};

const handleResultsCancel = () => {
  resultsModalVisible.value = false;
  currentResults.value = null;
};

const handleDownload = async (record: PredictionTaskRecord) => {
  try {
    const response = await downloadPredictionResults(record.id);
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.name}_results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    Message.error('下载失败');
  }
};

const handleDelete = async (record: PredictionTaskRecord) => {
  try {
    await deletePrediction(record.id);
    Message.success('删除成功');
    loadData();
  } catch (error) {
    Message.error('删除失败');
  }
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'orange',
    running: 'blue',
    completed: 'green',
    failed: 'red'
  };
  return colors[status] || 'gray';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: '待处理',
    running: '运行中',
    completed: '已完成',
    failed: '失败'
  };
  return texts[status] || status;
};

// 生命周期
onMounted(() => {
  loadData();
  loadDatasetList();
  loadModelList();
});
</script>

<style scoped>
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

.chart-container {
  margin: 20px 0;
}
</style>
