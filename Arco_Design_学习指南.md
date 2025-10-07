# Arco Design 学习指南

## 1. Arco Design 基础概念

### 1.1 设计语言
- **设计原则**: 清晰、一致、高效、美观
- **设计系统**: 基于原子设计理论，从原子到分子再到组织
- **色彩系统**: 主色、功能色、中性色、语义色
- **字体系统**: 字体族、字号、行高、字重

### 1.2 组件分类
- **基础组件**: Button, Input, Select, Checkbox, Radio 等
- **布局组件**: Grid, Layout, Space, Divider 等
- **导航组件**: Menu, Breadcrumb, Pagination, Tabs 等
- **数据展示**: Table, List, Card, Descriptions, Tree 等
- **反馈组件**: Message, Notification, Modal, Drawer 等
- **数据录入**: Form, Upload, DatePicker, TimePicker 等

## 2. 项目结构分析

### 2.1 当前项目结构
```
src/
├── components/          # 全局组件
│   ├── breadcrumb/     # 面包屑组件
│   ├── chart/          # 图表组件
│   ├── footer/         # 页脚组件
│   ├── global-setting/ # 全局设置
│   ├── menu/           # 菜单组件
│   ├── message-box/    # 消息盒子
│   ├── navbar/         # 导航栏
│   └── tab-bar/        # 标签栏
├── views/              # 页面组件
│   ├── dashboard/      # 仪表板
│   ├── form/           # 表单页面
│   ├── list/           # 列表页面
│   ├── login/          # 登录页面
│   ├── profile/        # 个人资料
│   └── visualization/  # 可视化页面
├── api/                # API接口
├── store/              # 状态管理
├── router/             # 路由配置
├── hooks/              # 组合式函数
└── utils/              # 工具函数
```

### 2.2 关键配置文件
- `config/vite.config.base.ts` - Vite基础配置
- `config/plugin/arcoResolver.ts` - Arco组件自动导入
- `config/plugin/arcoStyleImport.ts` - 样式按需导入

## 3. 核心组件使用示例

### 3.1 表单组件
```vue
<template>
  <a-form
    :model="form"
    :rules="rules"
    @submit="handleSubmit"
    layout="vertical"
  >
    <a-form-item label="用户名" field="username">
      <a-input v-model="form.username" placeholder="请输入用户名" />
    </a-form-item>
    <a-form-item label="密码" field="password">
      <a-input-password v-model="form.password" placeholder="请输入密码" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const form = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }]
};

const handleSubmit = (data: any) => {
  console.log('提交数据:', data);
};
</script>
```

### 3.2 数据表格
```vue
<template>
  <a-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    @page-change="handlePageChange"
  >
    <template #status="{ record }">
      <a-tag :color="record.status === 'active' ? 'green' : 'red'">
        {{ record.status }}
      </a-tag>
    </template>
    <template #operations="{ record }">
      <a-button type="text" @click="handleEdit(record)">编辑</a-button>
      <a-button type="text" status="danger" @click="handleDelete(record)">删除</a-button>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '名称', dataIndex: 'name' },
  { title: '状态', slotName: 'status' },
  { title: '操作', slotName: 'operations' }
];

const data = ref([
  { id: 1, name: '数据集1', status: 'active' },
  { id: 2, name: '数据集2', status: 'inactive' }
]);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 100
});

const handlePageChange = (page: number) => {
  pagination.current = page;
};
</script>
```

### 3.3 图表组件
```vue
<template>
  <div class="chart-container">
    <v-chart
      :option="chartOption"
      :loading="loading"
      @click="handleChartClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

const loading = ref(false);

const chartOption = computed(() => ({
  title: {
    text: '时序数据预测'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '实际值',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230]
    },
    {
      name: '预测值',
      type: 'line',
      data: [110, 125, 105, 140, 95, 220]
    }
  ]
}));

const handleChartClick = (params: any) => {
  console.log('图表点击:', params);
};
</script>
```

## 4. 主题定制

### 4.1 全局样式变量
```less
// 在 assets/style/global.less 中定义
@primary-color: #165dff;
@success-color: #00b42a;
@warning-color: #ff7d00;
@error-color: #f53f3f;

// 自定义组件样式
.custom-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### 4.2 组件样式覆盖
```vue
<template>
  <a-card class="custom-card">
    <template #title>自定义卡片</template>
    内容
  </a-card>
</template>

<style scoped>
.custom-card {
  :deep(.arco-card-header) {
    background: linear-gradient(90deg, #165dff, #246eff);
    color: white;
  }
}
</style>
```

## 5. 响应式设计

### 5.1 断点系统
```typescript
// 在 hooks/responsive.ts 中
import { ref, onMounted, onUnmounted } from 'vue';

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
};

export function useResponsive() {
  const screenSize = ref('lg');
  
  const updateScreenSize = () => {
    const width = window.innerWidth;
    if (width < breakpoints.sm) screenSize.value = 'xs';
    else if (width < breakpoints.md) screenSize.value = 'sm';
    else if (width < breakpoints.lg) screenSize.value = 'md';
    else if (width < breakpoints.xl) screenSize.value = 'lg';
    else if (width < breakpoints.xxl) screenSize.value = 'xl';
    else screenSize.value = 'xxl';
  };
  
  onMounted(() => {
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateScreenSize);
  });
  
  return { screenSize };
}
```

### 5.2 响应式布局
```vue
<template>
  <a-row :gutter="16">
    <a-col :xs="24" :sm="12" :md="8" :lg="6">
      <a-card>卡片1</a-card>
    </a-col>
    <a-col :xs="24" :sm="12" :md="8" :lg="6">
      <a-card>卡片2</a-card>
    </a-col>
  </a-row>
</template>
```

## 6. 国际化支持

### 6.1 语言配置
```typescript
// 在 locale/index.ts 中
import { createI18n } from 'vue-i18n';
import zhCN from './zh-CN';
import enUS from './en-US';

const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
});

export default i18n;
```

### 6.2 组件中使用
```vue
<template>
  <div>
    <h1>{{ $t('dashboard.title') }}</h1>
    <a-button>{{ $t('common.submit') }}</a-button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
```

## 7. 性能优化

### 7.1 组件懒加载
```typescript
// 在 router/index.ts 中
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/dashboard/index.vue')
  }
];
```

### 7.2 按需导入
```typescript
// 在 config/plugin/arcoResolver.ts 中
import { ArcoResolver } from '@arco-plugins/vite-vue';

export default ArcoResolver({
  sideEffect: true
});
```

## 8. 学习资源

### 8.1 官方文档
- [Arco Design Vue](https://arco.design/vue/docs/start)
- [Arco Design Pro](https://pro.arco.design/)
- [设计资源](https://arco.design/docs/designlab)

### 8.2 实践建议
1. 先熟悉基础组件，再学习复杂组件
2. 多查看官方示例和最佳实践
3. 结合实际项目需求进行练习
4. 关注组件的API文档和属性说明
5. 学习如何自定义主题和样式

### 8.3 项目实践
1. 基于现有项目结构，添加新的页面和组件
2. 实现数据集管理、模型管理、预测任务等功能模块
3. 使用ECharts集成数据可视化
4. 优化用户体验和界面交互
