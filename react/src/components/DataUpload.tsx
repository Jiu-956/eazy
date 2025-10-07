import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { 
  Upload, 
  FileText, 
  Image, 
  Database, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Download,
  Eye
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "uploading" | "completed" | "error"
  preview?: string
}

export function DataUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    dataType: "",
    tags: ""
  })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9)
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "uploading"
      }

      setUploadedFiles(prev => [...prev, newFile])

      // 模拟文件上传进度
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { 
                  ...f, 
                  progress: Math.min(f.progress + Math.random() * 30, 100),
                  status: f.progress >= 100 ? "completed" : "uploading"
                }
              : f
          )
        )
      }, 500)

      // 停止进度更新
      setTimeout(() => {
        clearInterval(interval)
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? { ...f, progress: 100, status: "completed" }
              : f
          )
        )
      }, 3000)
    })
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />
    if (type.includes('csv') || type.includes('excel')) return <Database className="h-5 w-5" />
    return <FileText className="h-5 w-5" />
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 处理数据集创建逻辑
    console.log("Creating dataset:", uploadForm, uploadedFiles)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">数据上传</h1>
        <p className="text-muted-foreground">
          上传您的数据集用于模型训练和预测
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 上传区域 */}
        <Card>
          <CardHeader>
            <CardTitle>文件上传</CardTitle>
            <CardDescription>
              支持 CSV, JSON, TXT, ZIP 等格式，单个文件最大 100MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">拖拽文件到此处</h3>
              <p className="text-muted-foreground mb-4">
                或者点击选择文件
              </p>
              <Input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".csv,.json,.txt,.zip,.xlsx,.xls"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  选择文件
                </label>
              </Button>
              
              <div className="mt-6 text-left">
                <h4 className="text-sm font-medium mb-2">支持的文件类型:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">CSV</Badge>
                  <Badge variant="secondary">JSON</Badge>
                  <Badge variant="secondary">TXT</Badge>
                  <Badge variant="secondary">ZIP</Badge>
                  <Badge variant="secondary">Excel</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 数据集信息 */}
        <Card>
          <CardHeader>
            <CardTitle>数据集信息</CardTitle>
            <CardDescription>
              填写数据集的基本信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataset-name">数据集名称</Label>
                <Input
                  id="dataset-name"
                  placeholder="请输入数据集名称"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataset-type">数据类型</Label>
                <Select value={uploadForm.dataType} onValueChange={(value) => setUploadForm({ ...uploadForm, dataType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择数据类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tabular">表格数据</SelectItem>
                    <SelectItem value="image">图像数据</SelectItem>
                    <SelectItem value="text">文本数据</SelectItem>
                    <SelectItem value="time-series">时间序列</SelectItem>
                    <SelectItem value="mixed">混合数据</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataset-description">描述</Label>
                <Textarea
                  id="dataset-description"
                  placeholder="请描述您的数据集..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataset-tags">标签</Label>
                <Input
                  id="dataset-tags"
                  placeholder="用逗号分隔多个标签"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={uploadedFiles.length === 0 || !uploadForm.name}
              >
                创建数据集
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 上传文件列表 */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>上传文件</CardTitle>
            <CardDescription>
              {uploadedFiles.length} 个文件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.progress}%</span>
                    </div>
                    
                    <Progress value={file.progress} className="mt-2" />
                  </div>
                </div>
              ))}
            </div>
            
            {uploadedFiles.some(f => f.status === "completed") && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  文件上传完成！您可以继续添加更多文件或创建数据集。
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* 数据预处理建议 */}
      <Card>
        <CardHeader>
          <CardTitle>数据预处理建议</CardTitle>
          <CardDescription>
            为了获得更好的模型性能，请注意以下几点
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">数据质量</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 确保数据完整性，减少缺失值</li>
                <li>• 检查数据的一致性和准确性</li>
                <li>• 处理异常值和噪声数据</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">数据格式</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• CSV文件请包含列标题</li>
                <li>• 数值数据使用统一的格式</li>
                <li>• 文本数据使用UTF-8编码</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">数据规模</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 训练数据量建议不少于1000条</li>
                <li>• 保持类别数据的平衡性</li>
                <li>• 合理划分训练集和测试集</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">安全性</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 移除个人敏感信息</li>
                <li>• 确保数据使用合规性</li>
                <li>• 数据传输采用加密保护</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}