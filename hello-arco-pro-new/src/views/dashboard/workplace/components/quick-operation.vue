<template>
  <a-card
    class="general-card"
    :title="$t('workplace.quick.operation')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 0 20px' }"
  >
    <template #extra>
      <a-link>{{ $t('workplace.quickOperation.setup') }}</a-link>
    </template>
    <a-row :gutter="8">
      <a-col v-for="link in links" :key="link.text" :span="8" class="wrapper">
        <div class="icon" @click="handleClick(link.route)">
          <component :is="link.icon" />
        </div>
        <a-typography-paragraph class="text" @click="handleClick(link.route)">
          {{ $t(link.text) }}
        </a-typography-paragraph>
      </a-col>
    </a-row>
    <a-divider class="split-line" style="margin: 0" />
  </a-card>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const links = [
    {
      text: 'workplace.datasetManagement',
      icon: 'icon-storage',
      route: '/dataset/index',
    },
    {
      text: 'workplace.modelManagement',
      icon: 'icon-robot',
      route: '/model/index',
    },
    {
      text: 'workplace.predictionTasks',
      icon: 'icon-trend-chart',
      route: '/prediction/index',
    },
    {
      text: 'workplace.dataVisualization',
      icon: 'icon-apps',
      route: '/visualization/data-analysis',
    },
    { text: 'workplace.userCenter', icon: 'icon-user', route: '/user/info' },
  ];

  const handleClick = (route: string) => {
    if (route) {
      router.push(route);
    }
  };
</script>

<style scoped lang="less"></style>
