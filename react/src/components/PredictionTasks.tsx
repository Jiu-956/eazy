import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { 
  Play, 
  Pause, 
  Square, 
  MoreHorizontal, 
  Plus, 
  Calendar, 
  Clock, 
  Brain,
  Database,
  Eye,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  Timer
} from "lucide-react"

interface PredictionTask {
  id: string
  name: string
  description: string
  model: string
  dataset: string
  status: "pending" | "running" | "completed" | "failed" | "paused"
  progress: number
  createdAt: string
  estimatedTime?: string
  completedAt?: string
  accuracy?: number
}

const mockTasks: PredictionTask[] = [
  {
    id: "1",
    name: "图像分类预测",
    description: "对新上传的产品图片进行分类预测",
    model: "图像分类模型 v2.1",
    dataset: "产品图片数据集",
    status: "running",
    progress: 65,
    createdAt: "2024-01-15 14:30:00",
    estimatedTime: "还需 15 分钟"
  },
  {
    id: "2", 
    name: "用户行为预测",
    description: "基于历史数据预测用户购买行为",
    model: "推荐系统模型 v3.0",
    dataset: "用户行为数据集",
    status: "completed",
    progress: 100,
    createdAt: "2024-01-15 09:15:00",
    completedAt: "2024-01-15 10:45:00",
    accuracy: 92.5
  },
  {
    id: "3",
    name: "文本情感分析",
    description: "分析客户评论的情感倾向",
    model: "情感分析模型 v1.3",
    dataset: "客户评论数据",
    status: "pending",
    progress: 0,
    createdAt: "2024-01-15 16:00:00",
    estimatedTime: "预计 30 分钟"
  },
  {
    id: "4",
    name: "销售预测任务",
    description: "预测下季度销售趋势",
    model: "时间序列预测 v1.0",
    dataset: "历史销售数据",
    status: "failed",
    progress: 45,
    createdAt: "2024-01-14 11:20:00"
  }
]

export function PredictionTasks() {
  const [tasks, setTasks] = useState<PredictionTask[]>(mockTasks)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState<PredictionTask | null>(null)
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    model: "",
    dataset: ""
  })

  const getStatusBadge = (status: PredictionTask["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">等待中</Badge>
      case "running":
        return <Badge variant="default" className="bg-blue-500">运行中</Badge>
      case "completed":
        return <Badge variant="default" className="bg-green-500">已完成</Badge>
      case "failed":
        return <Badge variant="destructive">失败</Badge>
      case "paused":
        return <Badge variant="outline">已暂停</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const getStatusIcon = (status: PredictionTask["status"]) => {
    switch (status) {
      case "pending":
        return <Timer className="h-4 w-4 text-gray-500" />
      case "running":
        return <Play className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "paused":
        return <Pause className="h-4 w-4 text-orange-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const handleCreateTask = () => {
    const task: PredictionTask = {
      id: (tasks.length + 1).toString(),
      ...newTask,
      status: "pending",
      progress: 0,
      createdAt: new Date().toLocaleString(),
      estimatedTime: "预计 25 分钟"
    }
    setTasks([...tasks, task])
    setNewTask({ name: "", description: "", model: "", dataset: "" })
    setShowCreateDialog(false)
  }

  const handleTaskAction = (taskId: string, action: "start" | "pause" | "stop" | "delete") => {
    setTasks(prev => {
      switch (action) {
        case "delete":
          return prev.filter(t => t.id !== taskId)
        case "start":
          return prev.map(t => t.id === taskId ? { ...t, status: "running" as const } : t)
        case "pause":
          return prev.map(t => t.id === taskId ? { ...t, status: "paused" as const } : t)
        case "stop":
          return prev.map(t => t.id === taskId ? { ...t, status: "pending" as const, progress: 0 } : t)
        default:
          return prev
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">预测任务</h1>
          <p className="text-muted-foreground">
            管理和监控您的预测任务
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              创建任务
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建预测任务</DialogTitle>
              <DialogDescription>
                配置新的预测任务参数
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">任务名称</Label>
                <Input
                  id="task-name"
                  placeholder="请输入任务名称"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-model">选择模型</Label>
                <Select value={newTask.model} onValueChange={(value) => setNewTask({ ...newTask, model: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择预测模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image-classifier">图像分类模型 v2.1</SelectItem>
                    <SelectItem value="sentiment-analysis">情感分析模型 v1.3</SelectItem>
                    <SelectItem value="recommendation">推荐系统模型 v3.0</SelectItem>
                    <SelectItem value="time-series">时间序列预测 v1.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-dataset">选择数据集</Label>
                <Select value={newTask.dataset} onValueChange={(value) => setNewTask({ ...newTask, dataset: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择数据集" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product-images">产品图片数据集</SelectItem>
                    <SelectItem value="user-behavior">用户行为数据集</SelectItem>
                    <SelectItem value="customer-reviews">客户评论数据</SelectItem>
                    <SelectItem value="sales-history">历史销售数据</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-description">任务描述</Label>
                <Textarea
                  id="task-description"
                  placeholder="请描述预测任务的目标和要求"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateTask} disabled={!newTask.name || !newTask.model || !newTask.dataset}>
                  创建任务
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 任务统计 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总任务数</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">运行中</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === "running").length}
                </p>
              </div>
              <Play className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">已完成</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">等待中</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tasks.filter(t => t.status === "pending").length}
                </p>
              </div>
              <Timer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 任务列表 */}
      <Card>
        <CardHeader>
          <CardTitle>任务列表</CardTitle>
          <CardDescription>
            查看和管理所有预测任务
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>任务信息</TableHead>
                <TableHead>模型</TableHead>
                <TableHead>数据集</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>进度</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <div className="font-medium">{task.name}</div>
                        <div className="text-sm text-muted-foreground">{task.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{task.model}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{task.dataset}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(task.status)}
                      {task.estimatedTime && (
                        <div className="text-xs text-muted-foreground">{task.estimatedTime}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{task.progress}%</span>
                        {task.accuracy && <span>准确率: {task.accuracy}%</span>}
                      </div>
                      <Progress value={task.progress} className="w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{task.createdAt}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                          <Eye className="mr-2 h-4 w-4" />
                          查看详情
                        </DropdownMenuItem>
                        {task.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleTaskAction(task.id, "start")}>
                            <Play className="mr-2 h-4 w-4" />
                            开始
                          </DropdownMenuItem>
                        )}
                        {task.status === "running" && (
                          <DropdownMenuItem onClick={() => handleTaskAction(task.id, "pause")}>
                            <Pause className="mr-2 h-4 w-4" />
                            暂停
                          </DropdownMenuItem>
                        )}
                        {(task.status === "running" || task.status === "paused") && (
                          <DropdownMenuItem onClick={() => handleTaskAction(task.id, "stop")}>
                            <Square className="mr-2 h-4 w-4" />
                            停止
                          </DropdownMenuItem>
                        )}
                        {task.status === "completed" && (
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            下载结果
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleTaskAction(task.id, "delete")}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 任务详情对话框 */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTask?.name}</DialogTitle>
            <DialogDescription>
              预测任务详细信息
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">任务状态</p>
                  <div className="mt-1">{getStatusBadge(selectedTask.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium">执行进度</p>
                  <div className="mt-1">
                    <Progress value={selectedTask.progress} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-1">{selectedTask.progress}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">使用模型</p>
                  <p className="text-sm text-muted-foreground">{selectedTask.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">数据集</p>
                  <p className="text-sm text-muted-foreground">{selectedTask.dataset}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">创建时间</p>
                  <p className="text-sm text-muted-foreground">{selectedTask.createdAt}</p>
                </div>
                {selectedTask.completedAt && (
                  <div>
                    <p className="text-sm font-medium">完成时间</p>
                    <p className="text-sm text-muted-foreground">{selectedTask.completedAt}</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">任务描述</p>
                <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              </div>
              
              {selectedTask.status === "completed" && selectedTask.accuracy && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm font-medium text-green-800 mb-2">预测结果</h4>
                  <div className="text-sm text-green-700">
                    <p>预测准确率: {selectedTask.accuracy}%</p>
                    <p>处理样本数: 10,000 条</p>
                    <p>预测时间: 1小时15分钟</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                {selectedTask.status === "completed" && (
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    下载结果
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  关闭
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}