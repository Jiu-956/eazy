<template>
  <div class="container">
    <Breadcrumb :items="['menu.upload', 'menu.upload.index']" />
    <a-card class="general-card" :bordered="false">
      <template #title>
        <div class="title">数据上传</div>
      </template>
      
      <!-- 上传区域 -->
      <div class="upload-container">
        <div class="upload-content">
          <icon-upload class="upload-icon" />
          <div class="upload-text">点击或拖拽文件到此处上传</div>
          <div class="upload-hint">支持CSV、JSON、XLSX、TFB格式文件</div>
          <a-upload
            :file-list="fileList"
            @update:file-list="fileList = $event"
            :auto-upload="false"
            :limit="1"
            accept=".csv,.json,.xlsx,.tfb"
          >
            <a-button type="primary" class="upload-button">
              选择文件
            </a-button>
          </a-upload>
        </div>
        
        <!-- 最近上传记录 -->
        <div class="recent-uploads" v-if="recentUploads.length > 0">
          <a-divider>
            <span class="divider-text">最近上传</span>
          </a-divider>
          <a-table
            :columns="recentUploadColumns"
            :data="recentUploads"
            :pagination="false"
            size="small"
          />
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import { IconUpload } from '@arco-design/web-vue/es/icon';
import { uploadDataset } from '@/api/dataset';
import type { FileItem } from '@arco-design/web-vue/es/upload/interface';
import type { DatasetUploadParams } from '@/api/dataset';
import Breadcrumb from '@/components/breadcrumb/index.vue';

// 文件列表
const fileList = ref<FileItem[]>([]);

// 最近上传记录（模拟数据）
const recentUploads = ref([
  {
    id: '1',
    fileName: '销售数据_2023.csv',
    uploadTime: '2023-11-15 10:30',
    status: '就绪',
    size: '2.5 MB'
  },
  {
    id: '2',
    fileName: '预测模型参数.json',
    uploadTime: '2023-11-14 16:45',
    status: '就绪',
    size: '0.8 MB'
  }
]);

// 最近上传表格列配置
const recentUploadColumns = [
  { title: '文件名', dataIndex: 'fileName', width: 300 },
  { title: '上传时间', dataIndex: 'uploadTime', width: 180 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '文件大小', dataIndex: 'size', width: 100 }
];

// 处理文件上传
const handleUpload = async () => {
  if (fileList.value.length === 0) {
    Message.error('请选择文件');
    return;
  }
  
  try {
    const file = fileList.value[0].originFile;
    const fileName = file.name;
    const format = fileName.split('.').pop() || '';
    
    const params: DatasetUploadParams = {
      file,
      name: fileName.replace(`.${format}`, ''),
      description: '通过数据上传页面上传的文件',
      format
    };
    
    await uploadDataset(params);
    Message.success('上传成功');
    fileList.value = [];
    
    // 更新最近上传记录（实际应该从后端获取）
    recentUploads.value.unshift({
      id: Date.now().toString(),
      fileName,
      uploadTime: new Date().toLocaleString('zh-CN'),
      status: '处理中',
      size: formatFileSize(file.size)
    });
    
    if (recentUploads.value.length > 5) {
      recentUploads.value.pop();
    }
  } catch (error) {
    Message.error('上传失败');
  }
};

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}

.title {
  font-size: 20px;
  font-weight: 500;
}

.upload-container {
  padding: 40px 0;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  border: 2px dashed var(--color-border-2);
  border-radius: 8px;
  background-color: var(--color-fill-1);
  transition: all 0.3s;
  
  &:hover {
    border-color: var(--color-primary-6);
    background-color: var(--color-primary-1);
  }
}

.upload-icon {
  font-size: 48px;
  color: var(--color-text-4);
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: var(--color-text-2);
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  color: var(--color-text-4);
  margin-bottom: 24px;
}

.upload-button {
  min-width: 120px;
}

.recent-uploads {
  margin-top: 40px;
}

.divider-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-2);
}
</style>