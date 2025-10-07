import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Clock, 
  Database, 
  Activity,
  Settings,
  Play,
  Pause,
  Download
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface Model {
  id: string
  name: string
  type: string
  version: string
  accuracy: number
  status: "active" | "training" | "stopped" | "error"
  description: string
  trainedAt: string
  datasetSize: number
  parameters: number
}

const mockModels: Model[] = [
  {
    id: "1",
    name: "图像分类模型",
    type: "CNN",
    version: "v2.1",
    accuracy: 94.5,
    status: "active",
    description: "基于ResNet架构的图像分类模型，支持1000个类别的识别",
    trainedAt: "2024-01-15",
    datasetSize: 50000,
    parameters: 25000000
  },
  {
    id: "2",
    name: "情感分析模型",
    type: "LSTM",
    version: "v1.3",
    accuracy: 89.2,
    status: "active",
    description: "用于文本情感分析的循环神经网络模型",
    trainedAt: "2024-01-12",
    datasetSize: 100000,
    parameters: 15000000
  },
  {
    id: "3",
    name: "推荐系统模型",
    type: "CF",
    version: "v3.0",
    accuracy: 87.8,
    status: "training",
    description: "基于协同过滤的商品推荐模型",
    trainedAt: "2024-01-10",
    datasetSize: 200000,
    parameters: 8000000
  },
  {
    id: "4",
    name: "时间序列预测",
    type: "Transformer",
    version: "v1.0",
    accuracy: 92.1,
    status: "active",
    description: "基于Transformer架构的时间序列预测模型",
    trainedAt: "2024-01-08",
    datasetSize: 75000,
    parameters: 30000000
  }
]

const trainingHistory = [
  { epoch: 1, loss: 0.8, accuracy: 65 },
  { epoch: 5, loss: 0.6, accuracy: 72 },
  { epoch: 10, loss: 0.45, accuracy: 78 },
  { epoch: 15, loss: 0.35, accuracy: 83 },
  { epoch: 20, loss: 0.28, accuracy: 87 },
  { epoch: 25, loss: 0.22, accuracy: 90 },
  { epoch: 30, loss: 0.18, accuracy: 92 },
  { epoch: 35, loss: 0.15, accuracy: 94 },
  { epoch: 40, loss: 0.13, accuracy: 94.5 }
]

const performanceMetrics = [
  { name: "精确率", value: 94.2 },
  { name: "召回率", value: 93.8 },
  { name: "F1分数", value: 94.0 },
  { name: "AUC", value: 96.5 }
]

export function ModelInfo() {
  const [selectedModel, setSelectedModel] = useState<Model>(mockModels[0])

  const getStatusBadge = (status: Model["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">运行中</Badge>
      case "training":
        return <Badge variant="secondary" className="bg-blue-500">训练中</Badge>
      case "stopped":
        return <Badge variant="outline">已停止</Badge>
      case "error":
        return <Badge variant="destructive">错误</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">模型信息</h1>
        <p className="text-muted-foreground">
          查看和管理您的AI模型
        </p>
      </div>

      {/* 模型选择 */}
      <Card>
        <CardHeader>
          <CardTitle>模型列表</CardTitle>
          <CardDescription>选择要查看的模型</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockModels.map((model) => (
              <Card 
                key={model.id} 
                className={`cursor-pointer transition-colors ${
                  selectedModel.id === model.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedModel(model)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Brain className="h-5 w-5 text-primary" />
                    {getStatusBadge(model.status)}
                  </div>
                  <h3 className="font-semibold">{model.name}</h3>
                  <p className="text-sm text-muted-foreground">{model.type} {model.version}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>准确率</span>
                      <span>{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 模型详情 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>基本信息</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">模型名称</p>
              <p className="text-sm text-muted-foreground">{selectedModel.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">模型类型</p>
              <p className="text-sm text-muted-foreground">{selectedModel.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium">版本</p>
              <p className="text-sm text-muted-foreground">{selectedModel.version}</p>
            </div>
            <div>
              <p className="text-sm font-medium">训练时间</p>
              <p className="text-sm text-muted-foreground">{selectedModel.trainedAt}</p>
            </div>
            <div>
              <p className="text-sm font-medium">状态</p>
              <div className="mt-1">{getStatusBadge(selectedModel.status)}</div>
            </div>
          </CardContent>
        </Card>

        {/* 性能指标 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>性能指标</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{metric.name}</span>
                    <span>{metric.value}%</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 资源统计 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>资源统计</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatNumber(selectedModel.parameters)}</div>
              <p className="text-sm text-muted-foreground">模型参数</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(selectedModel.datasetSize)}</div>
              <p className="text-sm text-muted-foreground">训练样本</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2.3GB</div>
              <p className="text-sm text-muted-foreground">模型大小</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细信息标签页 */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="training" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="training">训练历史</TabsTrigger>
              <TabsTrigger value="architecture">模型架构</TabsTrigger>
              <TabsTrigger value="config">配置参数</TabsTrigger>
              <TabsTrigger value="actions">模型操作</TabsTrigger>
            </TabsList>
            
            <TabsContent value="training" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">训练过程</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trainingHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="epoch" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="loss" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="损失"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="准确率"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="architecture" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">模型架构</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
{`模型: ${selectedModel.name}
架构: ${selectedModel.type}
版本: ${selectedModel.version}

层结构:
├── 输入层: 224x224x3
├── 卷积层1: 64个3x3卷积核
├── 池化层1: 2x2最大池化
├── 卷积层2: 128个3x3卷积核
├── 池化层2: 2x2最大池化
├── 全连接层1: 512个神经元
├── Dropout: 0.5
└── 输出层: 1000个神经元 (Softmax)`}
                  </pre>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="config" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">配置参数</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="text-sm font-medium mb-2">训练参数</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>学习率:</span>
                          <span>0.001</span>
                        </div>
                        <div className="flex justify-between">
                          <span>批次大小:</span>
                          <span>32</span>
                        </div>
                        <div className="flex justify-between">
                          <span>训练轮次:</span>
                          <span>100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>优化器:</span>
                          <span>Adam</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="text-sm font-medium mb-2">模型参数</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>激活函数:</span>
                          <span>ReLU</span>
                        </div>
                        <div className="flex justify-between">
                          <span>正则化:</span>
                          <span>L2 (0.01)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>损失函数:</span>
                          <span>交叉熵</span>
                        </div>
                        <div className="flex justify-between">
                          <span>验证集比例:</span>
                          <span>20%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">模型操作</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button className="h-auto flex-col space-y-2 p-6">
                    <Play className="h-6 w-6" />
                    <span>启动模型</span>
                    <span className="text-xs text-muted-foreground">开始模型推理服务</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex-col space-y-2 p-6">
                    <Pause className="h-6 w-6" />
                    <span>停止模型</span>
                    <span className="text-xs text-muted-foreground">停止模型推理服务</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex-col space-y-2 p-6">
                    <Download className="h-6 w-6" />
                    <span>下载模型</span>
                    <span className="text-xs text-muted-foreground">下载模型文件</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex-col space-y-2 p-6">
                    <Settings className="h-6 w-6" />
                    <span>模型配置</span>
                    <span className="text-xs text-muted-foreground">修改模型参数</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex-col space-y-2 p-6">
                    <Zap className="h-6 w-6" />
                    <span>模型调优</span>
                    <span className="text-xs text-muted-foreground">优化模型性能</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex-col space-y-2 p-6">
                    <Clock className="h-6 w-6" />
                    <span>定时任务</span>
                    <span className="text-xs text-muted-foreground">设置定时重训练</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}