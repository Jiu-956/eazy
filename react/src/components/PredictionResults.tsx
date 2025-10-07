import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { 
  BarChart3, 
  Download, 
  Eye, 
  Share2, 
  Filter,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  Scatter,
  ScatterChart
} from "recharts"

interface PredictionResult {
  id: string
  taskName: string
  model: string
  completedAt: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  totalSamples: number
  correctPredictions: number
  status: "success" | "warning" | "error"
  downloadUrl?: string
}

const mockResults: PredictionResult[] = [
  {
    id: "1",
    taskName: "图像分类预测",
    model: "图像分类模型 v2.1",
    completedAt: "2024-01-15 15:45:00",
    accuracy: 94.5,
    precision: 93.8,
    recall: 94.2,
    f1Score: 94.0,
    totalSamples: 10000,
    correctPredictions: 9450,
    status: "success"
  },
  {
    id: "2",
    taskName: "用户行为预测",
    model: "推荐系统模型 v3.0",
    completedAt: "2024-01-15 10:45:00",
    accuracy: 92.5,
    precision: 91.2,
    recall: 93.1,
    f1Score: 92.1,
    totalSamples: 5000,
    correctPredictions: 4625,
    status: "success"
  },
  {
    id: "3",
    taskName: "文本情感分析",
    model: "情感分析模型 v1.3",
    completedAt: "2024-01-14 16:30:00",
    accuracy: 89.2,
    precision: 88.5,
    recall: 87.9,
    f1Score: 88.2,
    totalSamples: 8000,
    correctPredictions: 7136,
    status: "warning"
  },
  {
    id: "4",
    taskName: "销售预测任务",
    model: "时间序列预测 v1.0",
    completedAt: "2024-01-14 11:20:00",
    accuracy: 76.8,
    precision: 75.2,
    recall: 78.1,
    f1Score: 76.6,
    totalSamples: 3000,
    correctPredictions: 2304,
    status: "error"
  }
]

// 模拟预测数据分布
const predictionDistribution = [
  { name: "类别A", predicted: 2500, actual: 2400 },
  { name: "类别B", predicted: 2100, actual: 2200 },
  { name: "类别C", predicted: 1800, actual: 1750 },
  { name: "类别D", predicted: 1600, actual: 1650 },
]

// 置信度分布
const confidenceData = [
  { range: "90-100%", count: 6800 },
  { range: "80-90%", count: 1800 },
  { range: "70-80%", count: 900 },
  { range: "60-70%", count: 300 },
  { range: "<60%", count: 200 },
]

// 错误分析数据
const errorAnalysis = [
  { type: "假阳性", count: 350, percentage: 6.2 },
  { type: "假阴性", count: 200, percentage: 3.5 },
  { type: "类别混淆", count: 180, percentage: 3.2 },
  { type: "边界模糊", count: 120, percentage: 2.1 },
]

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6']

export function PredictionResults() {
  const [selectedResult, setSelectedResult] = useState<PredictionResult | null>(null)
  const [selectedTab, setSelectedTab] = useState("overview")

  const getStatusBadge = (status: PredictionResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-500">优秀</Badge>
      case "warning":
        return <Badge variant="default" className="bg-orange-500">良好</Badge>
      case "error":
        return <Badge variant="destructive">需改进</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const getStatusIcon = (status: PredictionResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">预测结果</h1>
          <p className="text-muted-foreground">
            查看和分析预测任务的执行结果
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            筛选
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 结果统计 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总预测任务</p>
                <p className="text-2xl font-bold">{mockResults.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">平均准确率</p>
                <p className="text-2xl font-bold text-green-600">
                  {(mockResults.reduce((acc, r) => acc + r.accuracy, 0) / mockResults.length).toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">成功任务</p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockResults.filter(r => r.status === "success").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总预测样本</p>
                <p className="text-2xl font-bold text-purple-600">
                  {mockResults.reduce((acc, r) => acc + r.totalSamples, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 结果列表 */}
      <Card>
        <CardHeader>
          <CardTitle>预测结果列表</CardTitle>
          <CardDescription>
            查看所有已完成的预测任务结果
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>任务信息</TableHead>
                <TableHead>模型</TableHead>
                <TableHead>准确率</TableHead>
                <TableHead>样本数量</TableHead>
                <TableHead>完成时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-[120px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{result.taskName}</div>
                        <div className="text-sm text-muted-foreground">
                          正确预测: {result.correctPredictions.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{result.model}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{result.accuracy}%</span>
                      <span className="text-xs text-muted-foreground">
                        P: {result.precision}% | R: {result.recall}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{result.totalSamples.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(result.completedAt)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(result.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedResult(result)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 结果详情对话框 */}
      <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedResult?.taskName} - 详细分析</DialogTitle>
            <DialogDescription>
              预测结果的深度分析和可视化展示
            </DialogDescription>
          </DialogHeader>
          
          {selectedResult && (
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="performance">性能分析</TabsTrigger>
                <TabsTrigger value="distribution">分布分析</TabsTrigger>
                <TabsTrigger value="errors">错误分析</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">基本指标</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">{selectedResult.accuracy}%</p>
                          <p className="text-sm text-muted-foreground">准确率</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-600">{selectedResult.precision}%</p>
                          <p className="text-sm text-muted-foreground">精确率</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-purple-600">{selectedResult.recall}%</p>
                          <p className="text-sm text-muted-foreground">召回率</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-orange-600">{selectedResult.f1Score}%</p>
                          <p className="text-sm text-muted-foreground">F1分数</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">预测统计</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">总样本数</span>
                          <span className="font-medium">{selectedResult.totalSamples.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">正确预测</span>
                          <span className="font-medium text-green-600">{selectedResult.correctPredictions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">错误预测</span>
                          <span className="font-medium text-red-600">
                            {(selectedResult.totalSamples - selectedResult.correctPredictions).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">完成时间</span>
                          <span className="font-medium">{formatDate(selectedResult.completedAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">预测效果评估</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {selectedResult.status === "success" ? "优秀" : selectedResult.status === "warning" ? "良好" : "需改进"}
                          </div>
                          <p className="text-sm text-muted-foreground">整体评级</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">2小时15分</div>
                          <p className="text-sm text-muted-foreground">执行时间</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">98.5%</div>
                          <p className="text-sm text-muted-foreground">模型置信度</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">预测vs实际对比</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={predictionDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="predicted" fill="#3b82f6" name="预测值" />
                          <Bar dataKey="actual" fill="#22c55e" name="实际值" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">置信度分布</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={confidenceData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="count"
                            label={({ name, percentage }) => `${name}: ${percentage || 0}%`}
                          >
                            {confidenceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="distribution" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">预测结果分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <ScatterChart data={predictionDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="predicted" name="预测值" />
                        <YAxis dataKey="actual" name="实际值" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="预测准确性" data={predictionDistribution} fill="#3b82f6" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="errors" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">错误类型分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {errorAnalysis.map((error, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                            <div>
                              <p className="font-medium">{error.type}</p>
                              <p className="text-sm text-muted-foreground">{error.count} 个样本</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{error.percentage}%</p>
                            <p className="text-sm text-muted-foreground">错误率</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}