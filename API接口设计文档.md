# 时序数据预测系统 API 接口设计文档

## 基础信息
- **API版本**: v1.0
- **基础URL**: `http://localhost:8000/api/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证相关接口

### 1. 用户注册
- **接口路径**: `POST /auth/register`
- **请求参数**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "注册成功",
  "data": {
    "userId": "string",
    "username": "string",
    "email": "string"
  }
}
```

### 2. 用户登录
- **接口路径**: `POST /auth/login`
- **请求参数**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "登录成功",
  "data": {
    "token": "string",
    "refreshToken": "string",
    "expiresIn": 3600
  }
}
```

### 3. 获取用户信息
- **接口路径**: `GET /auth/user-info`
- **请求头**: `Authorization: Bearer {token}`
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "获取成功",
  "data": {
    "userId": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## 数据集管理接口

### 4. 获取数据集列表
- **接口路径**: `GET /datasets`
- **请求头**: `Authorization: Bearer {token}`
- **查询参数**:
  - `page`: 页码 (默认: 1)
  - `pageSize`: 每页数量 (默认: 10)
  - `status`: 状态筛选 (uploading, processing, ready, error)
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "datasetId": "string",
        "name": "string",
        "description": "string",
        "status": "string",
        "size": 1024,
        "recordCount": 1000,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 5. 上传数据集
- **接口路径**: `POST /datasets/upload`
- **请求头**: `Authorization: Bearer {token}`
- **请求类型**: `multipart/form-data`
- **请求参数**:
  - `file`: 文件 (支持 .csv, .json, .xlsx, .tfb)
  - `name`: 数据集名称
  - `description`: 数据集描述
  - `format`: 数据格式 (csv, json, xlsx, tfb)
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "上传成功",
  "data": {
    "datasetId": "string",
    "uploadId": "string",
    "status": "uploading"
  }
}
```

### 6. 数据集格式转换
- **接口路径**: `POST /datasets/{datasetId}/convert`
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "targetFormat": "tfb",
  "options": {
    "timeColumn": "timestamp",
    "valueColumns": ["value1", "value2"]
  }
}
```
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "转换成功",
  "data": {
    "convertedDatasetId": "string",
    "status": "processing"
  }
}
```

## 模型管理接口

### 7. 获取模型列表
- **接口路径**: `GET /models`
- **请求头**: `Authorization: Bearer {token}`
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `type`: 模型类型 (lstm, gru, transformer)
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "modelId": "string",
        "name": "string",
        "type": "string",
        "description": "string",
        "status": "ready",
        "accuracy": 0.95,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 10
  }
}
```

### 8. 获取模型详情
- **接口路径**: `GET /models/{modelId}`
- **请求头**: `Authorization: Bearer {token}`
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "获取成功",
  "data": {
    "modelId": "string",
    "name": "string",
    "type": "string",
    "description": "string",
    "status": "ready",
    "accuracy": 0.95,
    "parameters": {
      "inputLength": 100,
      "outputLength": 10,
      "hiddenSize": 128
    },
    "metrics": {
      "mse": 0.01,
      "mae": 0.05,
      "r2": 0.95
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## 预测任务接口

### 9. 提交预测任务
- **接口路径**: `POST /predictions`
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
```json
{
  "name": "string",
  "datasetId": "string",
  "modelId": "string",
  "parameters": {
    "predictionLength": 10,
    "confidence": 0.95
  }
}
```
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "任务提交成功",
  "data": {
    "predictionId": "string",
    "status": "pending",
    "estimatedTime": 300
  }
}
```

### 10. 获取预测任务列表
- **接口路径**: `GET /predictions`
- **请求头**: `Authorization: Bearer {token}`
- **查询参数**:
  - `page`: 页码
  - `pageSize`: 每页数量
  - `status`: 状态筛选 (pending, running, completed, failed)
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "获取成功",
  "data": {
    "list": [
      {
        "predictionId": "string",
        "name": "string",
        "status": "completed",
        "datasetId": "string",
        "modelId": "string",
        "progress": 100,
        "createdAt": "2024-01-01T00:00:00Z",
        "completedAt": "2024-01-01T00:05:00Z"
      }
    ],
    "total": 20
  }
}
```

### 11. 获取预测结果
- **接口路径**: `GET /predictions/{predictionId}/results`
- **请求头**: `Authorization: Bearer {token}`
- **响应数据**:
```json
{
  "code": 20000,
  "msg": "获取成功",
  "data": {
    "predictionId": "string",
    "status": "completed",
    "results": {
      "predictions": [
        {
          "timestamp": "2024-01-01T00:00:00Z",
          "value": 100.5,
          "confidence": 0.95,
          "upperBound": 105.2,
          "lowerBound": 95.8
        }
      ],
      "metrics": {
        "rmse": 2.5,
        "mape": 0.05
      }
    },
    "visualization": {
      "chartData": "base64_encoded_image"
    }
  }
}
```

## 错误码定义

| 错误码 | 说明 |
|--------|------|
| 20000 | 成功 |
| 40001 | 参数错误 |
| 40002 | 认证失败 |
| 40003 | 权限不足 |
| 40004 | 资源不存在 |
| 50001 | 服务器内部错误 |
| 50002 | 数据库错误 |
| 50003 | 文件处理错误 |
| 50004 | 模型预测错误 |

## 数据格式说明

### TFB格式规范
```json
{
  "metadata": {
    "name": "dataset_name",
    "description": "dataset_description",
    "version": "1.0.0",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "schema": {
    "timeColumn": "timestamp",
    "valueColumns": ["value1", "value2"],
    "timeFormat": "ISO8601"
  },
  "data": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "value1": 100.5,
      "value2": 200.3
    }
  ]
}
```

## 接口测试建议

1. 使用Postman或Apifox创建接口测试集合
2. 设置环境变量存储baseURL和token
3. 创建自动化测试脚本验证接口功能
4. 使用Mock数据模拟后端响应进行前端开发
