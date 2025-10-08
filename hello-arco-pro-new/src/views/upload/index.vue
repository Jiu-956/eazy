<template>
  <div class="container">
    <Breadcrumb :items="['menu.upload', 'menu.upload.index']" />

    <div class="layout">
      <!-- 左侧：大上传区 -->
      <a-card class="left-card" :bordered="false">
        <template #title>
          <div class="card-title">文件上传</div>
        </template>

        <div
          class="upload-area"
          :class="{ 'drag-over': dragOver }"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop="handleDrop"
        >
          <div class="upload-drop">
            <icon-upload class="big-icon" />
            <div class="drop-title">拖拽文件到此处</div>
            <div class="drop-sub">或者点击选择文件</div>

            <a-upload
              :auto-upload="false"
              :limit="1"
              accept=".csv,.json,.xlsx,.zip"
              :file-list="fileList"
              @update:file-list="updateFileList"
            >
              <a-button type="primary" class="choose-btn">
                <template #icon><icon-folder /></template>
                选择文件
              </a-button>
            </a-upload>

            <div class="supported">支持的文件类型：
              <a-tag size="small">CSV</a-tag>
              <a-tag size="small">JSON</a-tag>
              <a-tag size="small">TXT</a-tag>
              <a-tag size="small">ZIP</a-tag>
              <a-tag size="small">Excel</a-tag>
            </div>
          </div>
        </div>

        <!-- 已选文件展示（简洁） -->
        <div v-if="fileList.length > 0" class="selected-file-compact">
          <div class="meta">
            <div class="name">{{ fileList[0].name }}</div>
            <div class="size">{{ formatFileSize(fileList[0].originFile?.size || 0) }}</div>
          </div>
          <div class="actions">
            <a-button size="small" type="outline" status="danger" @click="removeFile">移除</a-button>
            <a-button size="small" type="primary" :loading="uploading" @click="handleUpload">{{ uploading ? '上传中...' : '上传' }}</a-button>
          </div>
        </div>
      </a-card>

      <!-- 右侧：数据集信息表单 -->
      <a-card class="right-card" :bordered="false">
        <template #title>
          <div class="card-title">数据集信息</div>
          <div class="card-sub">填写数据集的基本信息</div>
        </template>

        <a-form :model="datasetForm" label-col="6" wrapper-col="18" layout="vertical">
          <a-form-item label="数据集名称" :required="true">
            <a-input v-model="datasetForm.name" placeholder="请输入数据集名称" />
          </a-form-item>

          <a-form-item label="数据类型">
            <a-select v-model="datasetForm.type" placeholder="选择数据类型">
              <a-select-option value="tabular">表格数据</a-select-option>
              <a-select-option value="image">图像数据</a-select-option>
              <a-select-option value="text">文本数据</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="描述">
            <!-- 使用普通输入并通过样式模拟多行，以兼容现有类型定义 -->
            <a-input v-model="datasetForm.description" placeholder="请描述您的数据集..." class="textarea-like" />
          </a-form-item>

          <a-form-item label="标签">
            <a-input v-model="datasetForm.tags" placeholder="用逗号分隔多个标签" />
          </a-form-item>

          <div class="create-row">
            <a-button type="primary" long :loading="creating" @click="createDataset">创建数据集</a-button>
          </div>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
import { uploadDataset } from '@/api/dataset';
import type { FileItem } from '@arco-design/web-vue/es/upload/interface';
import type { DatasetUploadParams } from '@/api/dataset';
import Breadcrumb from '@/components/breadcrumb/index.vue';

const fileList = ref<FileItem[]>([]);
const dragOver = ref(false);
const uploading = ref(false);
const creating = ref(false);

const datasetForm = reactive({
  name: '',
  type: '',
  description: '',
  tags: '',
});

// 最近上传记录
const recentUploads = ref([
  {
    id: '1',
    fileName: '销售数据_2023.csv',
    uploadTime: '2023-11-15 10:30',
    status: '就绪',
    size: '2.5 MB',
  },
  {
    id: '2',
    fileName: '预测模型参数.json',
    uploadTime: '2023-11-14 16:45',
    status: '就绪',
    size: '0.8 MB',
  },
]);

// 最近上传表格列配置
const recentUploadColumns = [
  { 
    title: '文件名', 
    dataIndex: 'fileName',
    width: 300,
  },
  { title: '上传时间', dataIndex: 'uploadTime', width: 180 },
  { 
    title: '状态', 
    dataIndex: 'status', 
    width: 100,
    slotName: 'status'
  },
  { title: '文件大小', dataIndex: 'size', width: 100 },
];

// 获取文件扩展名
const getFileExtension = (fileName: string) => {
  return fileName.split('.').pop()?.toUpperCase() || 'FILE';
};

// 获取文件类型
const getFileType = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['csv', 'xlsx'].includes(ext)) return '数据表';
  if (ext === 'json') return 'JSON数据';
  if (ext === 'tfb') return '二进制文件';
  return '未知类型';
};

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

// 更新文件列表
const updateFileList = (newList: FileItem[]) => {
  if (newList.length > 1) {
    Message.warning('每次只能上传一个文件');
    return;
  }
  fileList.value = newList;
};

// 处理拖拽文件
const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  dragOver.value = false;

  if (!e.dataTransfer?.files.length) return;

  const file = e.dataTransfer.files[0];
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext && ['.csv', '.json', '.xlsx', '.tfb'].includes(`.${ext}`)) {
    fileList.value = [
      {
        uid: `${Date.now()}`,
        name: file.name,
        originFile: file,
      },
    ];
  } else {
    Message.error('不支持的文件格式');
  }
};

// 移除文件
const removeFile = () => {
  fileList.value = [];
};

// 处理文件上传
const handleUpload = async () => {
  if (fileList.value.length === 0) {
    Message.error('请选择文件');
    return;
  }

  try {
    uploading.value = true;
    const file = fileList.value[0].originFile;
    if (!file) {
      Message.error('文件读取失败');
      return;
    }

    const fileName = file.name;
    const format = fileName.split('.').pop() || '';

    const params: DatasetUploadParams = {
      file,
      name: fileName.replace(`.${format}`, ''),
      description: '通过数据上传页面上传的文件',
      format,
    };

    await uploadDataset(params);
    Message.success('上传成功');

    // 更新最近上传记录
    recentUploads.value.unshift({
      id: Date.now().toString(),
      fileName,
      uploadTime: new Date().toLocaleString('zh-CN'),
      status: '处理中',
      size: formatFileSize(file.size),
    });

    if (recentUploads.value.length > 5) {
      recentUploads.value.pop();
    }

    // 清空文件列表
    fileList.value = [];
  } catch (error) {
    Message.error('上传失败');
  } finally {
    uploading.value = false;
  }
};

// 创建数据集（表单 + 可选文件上传）
const createDataset = async () => {
  if (!datasetForm.name || datasetForm.name.trim() === '') {
    Message.warning('请填写数据集名称');
    return;
  }

  if (fileList.value.length === 0) {
    Message.warning('请先选择要上传的文件');
    return;
  }

  const file = fileList.value[0].originFile;
  if (!file) {
    Message.error('文件读取失败');
    return;
  }

  try {
    creating.value = true;
    const fileName = file.name;
    const format = fileName.split('.').pop() || '';

    const params: DatasetUploadParams = {
      file,
      name: datasetForm.name || fileName.replace(`.${format}`, ''),
      description: datasetForm.description || '',
      format,
      // tags/type may be optional on backend; include if present
      tags: datasetForm.tags ? datasetForm.tags.split(',').map((t) => t.trim()) : undefined,
      dataType: datasetForm.type || undefined,
    } as unknown as DatasetUploadParams;

    await uploadDataset(params);
    Message.success('创建数据集并上传成功');

    // 清理表单与文件
    datasetForm.name = '';
    datasetForm.type = '';
    datasetForm.description = '';
    datasetForm.tags = '';
    fileList.value = [];
  } catch (err) {
    Message.error('创建失败');
  } finally {
    creating.value = false;
  }
};
</script>

<style scoped lang="less">
.container {
  /* 与其他页面保持一致的容器样式 */
  padding: 20px;
  background: transparent;
  min-height: auto;
}

.title {
  font-size: 20px;
  font-weight: 500;
  color: var(--color-text-1);
  display: flex;
  align-items: center;
  gap: 10px;
  
  .title-icon {
    font-size: 24px;
    color: var(--color-primary);
  }
}

.general-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: none;
  /* 使用系统/主题的填充色，避免在页面内硬编码过亮的白色 */
  background: var(--color-fill-1);
}

.upload-wrapper {
  padding: 24px 0;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  border: 2px dashed var(--color-border-2);
  border-radius: 12px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  max-width: 880px;
  margin: 0 auto; /* 居中容器 */
  text-align: center; /* 文本居中 */

  &.drag-over {
    border-color: var(--color-primary-6);
    /* 背景由全局主题/暗色模式控制，不在组件内硬编码 */
    &::before {
      opacity: 1;
      animation: gradientMove 2s linear infinite;
    }
  }
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-primary-light-3), var(--color-primary), var(--color-primary-light-3));
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s;
  }
}

.upload-icon-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  /* 更中性的图标底色，避免太强烈的渐变 */
  background: linear-gradient(135deg, var(--color-fill-2) 0%, var(--color-fill-3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
}

.upload-icon {
  font-size: 40px;
  color: var(--color-primary);
}

.upload-text {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-1);
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 14px;
  color: var(--color-text-3);
  margin-bottom: 24px;
}

.upload-button {
  min-width: 160px;
  height: 44px;
  border-radius: 6px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light-2) 100%);
  border: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 8px auto 0 auto; /* 水平居中 */
  padding: 0 18px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(22, 93, 255, 0.18);
  }
}

.selected-file {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid var(--color-border-2);
  border-radius: 8px;
  background-color: var(--color-bg-2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: fadeIn 0.5s ease;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.file-icon-container {
  position: relative;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--color-primary-light-1) 0%, var(--color-primary-light-3) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .file-icon {
    font-size: 24px;
    color: var(--color-primary);
  }
  
  .file-extension {
    position: absolute;
    bottom: -6px;
    right: -6px;
    background: var(--color-primary);
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
  }
}

.file-details {
  display: flex;
    flex-direction: column;
    gap: 4px;
}

.file-name {
  font-weight: 500;
  color: var(--color-text-1);
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-3);
  
  .file-type {
    background: var(--color-fill-2);
    padding: 2px 8px;
    border-radius: 4px;
  }
}

.file-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center; /* 按钮居中 */
}

.recent-uploads {
  margin-top: 40px;
  animation: fadeIn 0.6s ease;
}

.divider-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-1);
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.arco-table-th) {
  background-color: var(--color-fill-1);
  font-weight: 500;
}

:deep(.arco-table-tr:hover) {
  background-color: var(--color-fill-1);
}

.table-file-name {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .file-icon {
    font-size: 16px;
    color: var(--color-primary);
  }
  
  .file-name-text {
    font-weight: 500;
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
  
  .upload-content {
    padding: 40px 20px;
  }
  
  .selected-file {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .file-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

<style scoped lang="less">
.layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
.left-card, .right-card {
  border-radius: 8px;
  width: 100%;
}
.left-card {
  flex: 1.6;
}
.right-card {
  flex: 1;
}
.upload-area {
  padding: 40px 24px;
  border: 1px dashed var(--color-border-2);
  border-radius: 10px;
  text-align: center;
}
.big-icon {
  font-size: 48px;
  color: var(--color-primary);
  margin-bottom: 12px;
}
.drop-title {
  font-weight: 600;
  font-size: 18px;
  color: var(--color-text-1);
  margin-top: 6px;
}
.drop-sub {
  color: var(--color-text-3);
  margin-bottom: 18px;
}
.choose-btn {
  margin-top: 8px;
}
.supported {
  margin-top: 18px;
  color: var(--color-text-3);
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}
.selected-file-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.create-row {
  margin-top: 18px;
}
.textarea-like {
  min-height: 110px;
  padding: 12px;
}
</style>