import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  FileText,
  Database,
  Calendar,
  User
} from "lucide-react"

interface Dataset {
  id: string
  name: string
  description: string
  type: string
  size: string
  records: number
  createdAt: string
  createdBy: string
  status: "active" | "processing" | "error"
}

const mockDatasets: Dataset[] = [
  {
    id: "1",
    name: "客户行为数据集",
    description: "包含用户购买行为、浏览记录等信息",
    type: "CSV",
    size: "15.2 MB",
    records: 10000,
    createdAt: "2024-01-15",
    createdBy: "张三",
    status: "active"
  },
  {
    id: "2",
    name: "产品销售数据",
    description: "历史销售数据，包含产品信息和销量统计",
    type: "JSON",
    size: "8.7 MB",
    records: 5500,
    createdAt: "2024-01-10",
    createdBy: "李四",
    status: "active"
  },
  {
    id: "3",
    name: "图像分类数据集",
    description: "包含多类别图像的训练和测试数据",
    type: "ZIP",
    size: "234.5 MB",
    records: 15000,
    createdAt: "2024-01-08",
    createdBy: "王五",
    status: "processing"
  },
  {
    id: "4",
    name: "文本情感分析数据",
    description: "社交媒体文本数据，用于情感分析模型训练",
    type: "TXT",
    size: "45.3 MB",
    records: 25000,
    createdAt: "2024-01-05",
    createdBy: "赵六",
    status: "active"
  }
]

export function DatasetManagement() {
  const [datasets, setDatasets] = useState<Dataset[]>(mockDatasets)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: Dataset["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">活跃</Badge>
      case "processing":
        return <Badge variant="secondary">处理中</Badge>
      case "error":
        return <Badge variant="destructive">错误</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const handleDeleteDataset = (id: string) => {
    setDatasets(datasets.filter(d => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">数据集管理</h1>
          <p className="text-muted-foreground">
            管理和查看您的训练数据集
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          上传数据集
        </Button>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索数据集..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 数据集列表 */}
      <Card>
        <CardHeader>
          <CardTitle>数据集列表</CardTitle>
          <CardDescription>
            共 {filteredDatasets.length} 个数据集
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>记录数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>创建者</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDatasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{dataset.name}</div>
                      <div className="text-sm text-muted-foreground">{dataset.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{dataset.type}</Badge>
                  </TableCell>
                  <TableCell>{dataset.size}</TableCell>
                  <TableCell>{dataset.records.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(dataset.status)}</TableCell>
                  <TableCell>{dataset.createdAt}</TableCell>
                  <TableCell>{dataset.createdBy}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedDataset(dataset)}>
                          <Eye className="mr-2 h-4 w-4" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          下载
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDeleteDataset(dataset.id)}
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

      {/* 数据集详情对话框 */}
      <Dialog open={!!selectedDataset} onOpenChange={() => setSelectedDataset(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDataset?.name}</DialogTitle>
            <DialogDescription>
              数据集详细信息
            </DialogDescription>
          </DialogHeader>
          
          {selectedDataset && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">文件类型</p>
                        <p className="text-sm text-muted-foreground">{selectedDataset.type}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">文件大小</p>
                        <p className="text-sm text-muted-foreground">{selectedDataset.size}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">创建时间</p>
                        <p className="text-sm text-muted-foreground">{selectedDataset.createdAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">创建者</p>
                        <p className="text-sm text-muted-foreground">{selectedDataset.createdBy}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">描述</h4>
                <p className="text-sm text-muted-foreground">{selectedDataset.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">数据统计</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{selectedDataset.records.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">总记录数</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">字段数</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">98.5%</p>
                      <p className="text-sm text-muted-foreground">数据完整性</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  下载数据集
                </Button>
                <Button>
                  <Eye className="mr-2 h-4 w-4" />
                  预览数据
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}