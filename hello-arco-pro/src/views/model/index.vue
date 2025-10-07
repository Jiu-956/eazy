<template>
  <div class="container">
    <a-card class="general-card" :bordered="false">
      <template #title>
        <div class="title">模型管理</div>
      </template>
      <template #extra>
        <a-button type="primary" @click="showCreateModal">
          <template #icon>
            <icon-plus />
          </template>
          创建模型
        </a-button>
      </template>
      
      <!-- 搜索表单 -->
      <div class="search-form">
        <a-form :model="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item field="name" label="模型名称">
            <a-input
              v-model="searchForm.name"
              placeholder="请输入模型名称"
              allow-clear
            />
          </a-form-item>
          <a-form-item field="type" label="模型类型">
            <a-select
              v-model="searchForm.type"
              placeholder="请选择模型类型"
              allow-clear
            >
              <a-option value="lstm">LSTM</a-option>
              <a-option value="gru">GRU</a-option>
              <a-option value="transformer">Transformer</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="status" label="状态">
            <a-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              allow-clear
            >
              <a-option value="training">训练中</a-option>
              <a-option value="ready">就绪</a-option>
              <a-option value="error">错误</a-option>
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
        <template #type="{ record }">
          <a-tag :color="getTypeColor(record.type)">
            {{ record.type.toUpperCase() }}
          </a-tag>
        </template>
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>
        <template #accuracy="{ record }">
          <a-progress
            :percent="Math.round(record.accuracy * 100)"
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
            @click="handleTrain(record)"
            :disabled="record.status !== 'ready'"
          >
            训练
          </a-button>
          <a-button
            type="text"
            size="small"
            @click="handleDownload(record)"
            :disabled="record.status !== 'ready'"
          >
            下载
          </a-button>
          <a-popconfirm
            content="确定要删除这个模型吗？"
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

    <!-- 创建模型模态框 -->
    <a-modal
      :visible="createModalVisible"
      @update:visible="createModalVisible = $event"
      title="创建模型"
      :width="600"
      @ok="handleCreate"
      @cancel="handleCreateCancel"
    >
      <a-form :model="createForm" :rules="createRules" ref="createFormRef">
        <a-form-item label="模型名称" field="name">
          <a-input v-model="createForm.name" placeholder="请输入模型名称" />
        </a-form-item>
        <a-form-item label="模型类型" field="type">
          <a-select v-model="createForm.type" placeholder="请选择模型类型">
            <a-option value="lstm">LSTM</a-option>
            <a-option value="gru">GRU</a-option>
            <a-option value="transformer">Transformer</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述" field="description">
          <a-textarea
            v-model="createForm.description"
            placeholder="请输入模型描述"
            :rows="3"
          />
        </a-form-item>
        <a-divider>模型参数</a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="输入长度" field="inputLength">
              <a-input-number
                v-model="createForm.inputLength"
                :min="1"
                :max="1000"
                placeholder="请输入输入长度"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="输出长度" field="outputLength">
              <a-input-number
                v-model="createForm.outputLength"
                :min="1"
                :max="100"
                placeholder="请输入输出长度"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="隐藏层大小" field="hiddenSize">
              <a-input-number
                v-model="createForm.hiddenSize"
                :min="32"
                :max="512"
                placeholder="请输入隐藏层大小"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="层数" field="numLayers">
              <a-input-number
                v-model="createForm.numLayers"
                :min="1"
                :max="10"
                placeholder="请输入层数"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="Dropout" field="dropout">
          <a-slider
            v-model="createForm.dropout"
            :min="0"
            :max="0.5"
            :step="0.1"
            :show-tooltip="true"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 训练模型模态框 -->
    <a-modal
      :visible="trainModalVisible"
      @update:visible="trainModalVisible = $event"
      title="训练模型"
      :width="500"
      @ok="handleTrainSubmit"
      @cancel="handleTrainCancel"
    >
      <a-form :model="trainForm" :rules="trainRules" ref="trainFormRef">
        <a-form-item label="数据集" field="datasetId">
          <a-select v-model="trainForm.datasetId" placeholder="请选择数据集">
            <a-option
              v-for="dataset in datasetList"
              :key="dataset.id"
              :value="dataset.id"
            >
              {{ dataset.name }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="训练轮数" field="epochs">
          <a-input-number
            v-model="trainForm.epochs"
            :min="1"
            :max="1000"
            placeholder="请输入训练轮数"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconPlus } from '@arco-design/web-vue/es/icon';
import { queryModelList, createModel, trainModel, deleteModel, downloadModel } from '@/api/model';
import { queryDatasetList } from '@/api/dataset';
import type { ModelRecord, ModelParams, ModelCreateParams } from '@/api/model';
import type { DatasetRecord } from '@/api/dataset';

// 响应式数据
const loading = ref(false);
const tableData = ref<ModelRecord[]>([]);
const datasetList = ref<DatasetRecord[]>([]);
const createModalVisible = ref(false);
const trainModalVisible = ref(false);
const currentRecord = ref<ModelRecord | null>(null);

// 搜索表单
const searchForm = reactive({
  name: '',
  type: undefined as 'lstm' | 'gru' | 'transformer' | undefined,
  status: undefined as 'training' | 'ready' | 'error' | undefined
});

// 创建表单
const createForm = reactive({
  name: '',
  type: 'lstm' as 'lstm' | 'gru' | 'transformer',
  description: '',
  inputLength: 100,
  outputLength: 10,
  hiddenSize: 128,
  numLayers: 2,
  dropout: 0.2
});

const createRules = {
  name: [{ required: true, message: '请输入模型名称' }],
  type: [{ required: true, message: '请选择模型类型' }],
  inputLength: [{ required: true, message: '请输入输入长度' }],
  outputLength: [{ required: true, message: '请输入输出长度' }],
  hiddenSize: [{ required: true, message: '请输入隐藏层大小' }],
  numLayers: [{ required: true, message: '请输入层数' }]
};

// 训练表单
const trainForm = reactive({
  datasetId: '',
  epochs: 100
});

const trainRules = {
  datasetId: [{ required: true, message: '请选择数据集' }],
  epochs: [{ required: true, message: '请输入训练轮数' }]
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
  { title: '名称', dataIndex: 'name', width: 200 },
  { title: '类型', slotName: 'type', width: 100 },
  { title: '状态', slotName: 'status', width: 100 },
  { title: '准确率', slotName: 'accuracy', width: 150 },
  { title: 'MSE', dataIndex: 'metrics.mse', width: 100 },
  { title: 'MAE', dataIndex: 'metrics.mae', width: 100 },
  { title: 'R²', dataIndex: 'metrics.r2', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
  { title: '操作', slotName: 'operations', width: 200, fixed: 'right' as const }
];

// 方法
const loadData = async () => {
  loading.value = true;
  try {
    const params: ModelParams = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchForm
    };
    const res = await queryModelList(params);
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

const handleSearch = () => {
  pagination.current = 1;
  loadData();
};

const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    type: undefined,
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
    type: 'lstm',
    description: '',
    inputLength: 100,
    outputLength: 10,
    hiddenSize: 128,
    numLayers: 2,
    dropout: 0.2
  });
};

const handleCreate = async () => {
  try {
    const params: ModelCreateParams = {
      name: createForm.name,
      type: createForm.type,
      description: createForm.description,
      parameters: {
        inputLength: createForm.inputLength,
        outputLength: createForm.outputLength,
        hiddenSize: createForm.hiddenSize,
        numLayers: createForm.numLayers,
        dropout: createForm.dropout
      }
    };
    
    await createModel(params);
    Message.success('创建成功');
    createModalVisible.value = false;
    loadData();
  } catch (error) {
    Message.error('创建失败');
  }
};

const handleCreateCancel = () => {
  createModalVisible.value = false;
};

const handleView = (record: ModelRecord) => {
  Message.info('查看功能待实现');
};

const handleTrain = (record: ModelRecord) => {
  currentRecord.value = record;
  trainModalVisible.value = true;
  Object.assign(trainForm, {
    datasetId: '',
    epochs: 100
  });
};

const handleTrainSubmit = async () => {
  if (!currentRecord.value) return;
  
  try {
    await trainModel(currentRecord.value.id, {
      datasetId: trainForm.datasetId,
      epochs: trainForm.epochs
    });
    Message.success('训练任务已提交');
    trainModalVisible.value = false;
    loadData();
  } catch (error) {
    Message.error('训练失败');
  }
};

const handleTrainCancel = () => {
  trainModalVisible.value = false;
};

const handleDownload = async (record: ModelRecord) => {
  try {
    const response = await downloadModel(record.id);
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.name}.pkl`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    Message.error('下载失败');
  }
};

const handleDelete = async (record: ModelRecord) => {
  try {
    await deleteModel(record.id);
    Message.success('删除成功');
    loadData();
  } catch (error) {
    Message.error('删除失败');
  }
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    lstm: 'blue',
    gru: 'green',
    transformer: 'purple'
  };
  return colors[type] || 'gray';
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    training: 'orange',
    ready: 'green',
    error: 'red'
  };
  return colors[status] || 'gray';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    training: '训练中',
    ready: '就绪',
    error: '错误'
  };
  return texts[status] || status;
};

// 生命周期
onMounted(() => {
  loadData();
  loadDatasetList();
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
</style>
