import { useState } from "react"
import { Layout } from "./components/Layout"
import { AuthForm } from "./components/AuthForm"
import { Dashboard } from "./components/Dashboard"
import { DatasetManagement } from "./components/DatasetManagement"
import { ModelInfo } from "./components/ModelInfo"
import { DataUpload } from "./components/DataUpload"
import { PredictionTasks } from "./components/PredictionTasks"
import { PredictionResults } from "./components/PredictionResults"

interface User {
  name: string
  email: string
  avatar?: string
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setActiveTab("dashboard")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "datasets":
        return <DatasetManagement />
      case "models":
        return <ModelInfo />
      case "upload":
        return <DataUpload />
      case "tasks":
        return <PredictionTasks />
      case "results":
        return <PredictionResults />
      default:
        return <Dashboard />
    }
  }

  // 如果用户未登录，显示登录表单
  if (!user) {
    return <AuthForm onLogin={handleLogin} />
  }

  // 用户已登录，显示主应用界面
  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      user={user}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  )
}