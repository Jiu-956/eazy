<template>
  <div class="container">
    <a-card class="general-card" :bordered="false">
      <template #title>
        <div class="title">数据集管理</div>
      </template>
      <template #extra>
        <a-button type="primary" @click="showUploadModal">
          <template #icon>
            <icon-upload />
          </template>
          上传数据集
        </a-button>
      </template>
      
      <!-- 搜索表单 -->
      <div class="search-form">
        <a-form :model="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item field="name" label="数据集名称">
            <a-input
              v-model="searchForm.name"
              placeholder="请输入数据集名称"
              allow-clear
            />
          </a-form-item>
          <a-form-item field="status" label="状态">
            <a-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              allow-clear
            >
              <a-option value="uploading">上传中</a-option>
              <a-option value="processing">处理中</a-option>
              <a-option value="ready">就绪</a-option>
              <a-option value="error">错误</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="format" label="格式">
            <a-select
              v-model="searchForm.format"
              placeholder="请选择格式"
              allow-clear
            >
              <a-option value="csv">CSV</a-option>
              <a-option value="json">JSON</a-option>
              <a-option value="xlsx">XLSX</a-option>
              <a-option value="tfb">TFB</a-option>
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
        <template #format="{ record }">
          <a-tag color="blue">{{ record.format.toUpperCase() }}</a-tag>
        </template>
        <template #size="{ record }">
          {{ formatFileSize(record.size) }}
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
            @click="handleConvert(record)"
            :disabled="record.status !== 'ready'"
          >
            转换
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
            content="确定要删除这个数据集吗？"
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

    <!-- 上传数据集模态框 -->
    <a-modal
      :visible="uploadModalVisible"
      @update:visible="uploadModalVisible = $event"
      title="上传数据集"
      :width="600"
      @ok="handleUpload"
      @cancel="handleUploadCancel"
    >
      <a-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef">
        <a-form-item label="数据集名称" field="name">
          <a-input v-model="uploadForm.name" placeholder="请输入数据集名称" />
        </a-form-item>
        <a-form-item label="描述" field="description">
          <a-textarea
            v-model="uploadForm.description"
            placeholder="请输入数据集描述"
            :rows="3"
          />
        </a-form-item>
        <a-form-item label="数据格式" field="format">
          <a-select v-model="uploadForm.format" placeholder="请选择数据格式">
            <a-option value="csv">CSV</a-option>
            <a-option value="json">JSON</a-option>
            <a-option value="xlsx">XLSX</a-option>
            <a-option value="tfb">TFB</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="文件" field="file">
          <a-upload
            :file-list="uploadForm.fileList"
            @update:file-list="uploadForm.fileList = $event"
            :auto-upload="false"
            :limit="1"
            accept=".csv,.json,.xlsx,.tfb"
          >
            <template #upload-button>
              <div class="upload-area">
                <icon-upload />
                <div>点击或拖拽文件到此处上传</div>
              </div>
            </template>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 格式转换模态框 -->
    <a-modal
      :visible="convertModalVisible"
      @update:visible="convertModalVisible = $event"
      title="格式转换"
      :width="500"
      @ok="handleConvertSubmit"
      @cancel="handleConvertCancel"
    >
      <a-form :model="convertForm" :rules="convertRules" ref="convertFormRef">
        <a-form-item label="目标格式" field="targetFormat">
          <a-select v-model="convertForm.targetFormat" placeholder="请选择目标格式">
            <a-option value="tfb">TFB</a-option>
            <a-option value="csv">CSV</a-option>
            <a-option value="json">JSON</a-option>
            <a-option value="xlsx">XLSX</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时间列" field="timeColumn">
          <a-input v-model="convertForm.timeColumn" placeholder="请输入时间列名" />
        </a-form-item>
        <a-form-item label="数值列" field="valueColumns">
          <a-input v-model="convertForm.valueColumns" placeholder="请输入数值列名，多个用逗号分隔" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
// icons are auto-registered by unplugin-vue-components, no manual import needed
import { queryDatasetList, uploadDataset, convertDatasetFormat, deleteDataset, downloadDataset } from '@/api/dataset';
import type { DatasetRecord, DatasetParams, DatasetUploadParams, DatasetConvertParams } from '@/api/dataset';

// 响应式数据
const loading = ref(false);
const tableData = ref<DatasetRecord[]>([]);
const uploadModalVisible = ref(false);
const convertModalVisible = ref(false);
const currentRecord = ref<DatasetRecord | null>(null);

// 搜索表单
const searchForm = reactive({
  name: '',
  status: undefined as 'uploading' | 'processing' | 'ready' | 'error' | undefined,
  format: undefined as 'csv' | 'json' | 'xlsx' | 'tfb' | undefined
});

// 上传表单
const uploadForm = reactive({
  name: '',
  description: '',
  format: 'csv' as 'csv' | 'json' | 'xlsx' | 'tfb',
  fileList: [] as any[]
});

const uploadRules = {
  name: [{ required: true, message: '请输入数据集名称' }],
  format: [{ required: true, message: '请选择数据格式' }],
  file: [{ required: true, message: '请选择文件' }]
};

// 转换表单
const convertForm = reactive({
  targetFormat: 'tfb' as 'tfb' | 'csv' | 'json' | 'xlsx',
  timeColumn: 'timestamp',
  valueColumns: 'value'
});

const convertRules = {
  targetFormat: [{ required: true, message: '请选择目标格式' }],
  timeColumn: [{ required: true, message: '请输入时间列名' }],
  valueColumns: [{ required: true, message: '请输入数值列名' }]
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
  { title: '描述', dataIndex: 'description', width: 300 },
  { title: '状态', slotName: 'status', width: 100 },
  { title: '格式', slotName: 'format', width: 80 },
  { title: '大小', slotName: 'size', width: 100 },
  { title: '记录数', dataIndex: 'recordCount', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
  { title: '操作', slotName: 'operations', width: 200, fixed: 'right' as const }
];

// 方法
const loadData = async () => {
  loading.value = true;
  try {
    const params: DatasetParams = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchForm
    };
    const res = await queryDatasetList(params);
    tableData.value = res.data.list;
    pagination.total = res.data.total;
  } catch (error) {
    Message.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.current = 1;
  loadData();
};

const handleReset = () => {
  Object.assign(searchForm, {
    name: '',
    status: undefined,
    format: undefined
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

const showUploadModal = () => {
  uploadModalVisible.value = true;
  Object.assign(uploadForm, {
    name: '',
    description: '',
    format: 'csv',
    fileList: []
  });
};

const handleUpload = async () => {
  if (uploadForm.fileList.length === 0) {
    Message.error('请选择文件');
    return;
  }
  
  try {
    const file = uploadForm.fileList[0].originFile;
    const params: DatasetUploadParams = {
      file,
      name: uploadForm.name,
      description: uploadForm.description,
      format: uploadForm.format
    };
    
    await uploadDataset(params);
    Message.success('上传成功');
    uploadModalVisible.value = false;
    loadData();
  } catch (error) {
    Message.error('上传失败');
  }
};

const handleUploadCancel = () => {
  uploadModalVisible.value = false;
};

const handleView = (record: DatasetRecord) => {
  Message.info('查看功能待实现');
};

const handleConvert = (record: DatasetRecord) => {
  currentRecord.value = record;
  convertModalVisible.value = true;
  Object.assign(convertForm, {
    targetFormat: 'tfb',
    timeColumn: 'timestamp',
    valueColumns: 'value'
  });
};

const handleConvertSubmit = async () => {
  if (!currentRecord.value) return;
  
  try {
    const params: DatasetConvertParams = {
      targetFormat: convertForm.targetFormat,
      options: {
        timeColumn: convertForm.timeColumn,
        valueColumns: convertForm.valueColumns.split(',').map(s => s.trim())
      }
    };
    
    await convertDatasetFormat(currentRecord.value.id, params);
    Message.success('转换任务已提交');
    convertModalVisible.value = false;
    loadData();
  } catch (error) {
    Message.error('转换失败');
  }
};

const handleConvertCancel = () => {
  convertModalVisible.value = false;
};

const handleDownload = async (record: DatasetRecord) => {
  try {
    const response = await downloadDataset(record.id);
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.name}.${record.format}`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    Message.error('下载失败');
  }
};

const handleDelete = async (record: DatasetRecord) => {
  try {
    await deleteDataset(record.id);
    Message.success('删除成功');
    loadData();
  } catch (error) {
    Message.error('删除失败');
  }
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    uploading: 'orange',
    processing: 'blue',
    ready: 'green',
    error: 'red'
  };
  return colors[status] || 'gray';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    uploading: '上传中',
    processing: '处理中',
    ready: '就绪',
    error: '错误'
  };
  return texts[status] || status;
};

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

// 生命周期
onMounted(() => {
  loadData();
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

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: 2px dashed var(--color-border-2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: var(--color-primary-6);
  background: var(--color-primary-1);
}
</style>
