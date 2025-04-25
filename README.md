# Kubernetes 學習專案

這是一個用於學習 Kubernetes 的教學專案，專注於監控和網路策略的實作。本專案展示了一個使用 Node.js 應用程式，搭配 Redis 和 Prometheus 監控的實際範例。

## 專案組件

### 應用程式
- **Node.js Exporter**: 一個使用 Express.js 建立的指標輸出器，功能包括：
  - 連接 Redis
  - 提供 Prometheus 指標
  - 回報 Redis 連線狀態
- **Redis**: 示範用的 Redis 實例

### Kubernetes 資源
1. **部署和服務**
   - Node.js 指標應用程式
   - Redis 資料庫

2. **監控**
   - Prometheus 整合用的 ServiceMonitor
   - 自定義指標匯出

3. **網路策略**
   - 全域拒絕策略（基本安全）
   - 允許外部存取指標應用程式
   - 允許指標應用程式與 Redis 通訊

## 目錄結構
```
learning-k8s/
├── nodejs-exporter/     # Node.js 應用程式和 Dockerfile
├── app-yaml/            # K8s 部署和服務設定檔
├── servicemonitor/      # Prometheus ServiceMonitor 設定
└── networkpolicy/       # 網路策略定義
```

## 前置需求
- Kubernetes 叢集
- Prometheus Operator（用於監控）
- 支援 NetworkPolicy 的 CNI

## 使用方式

1. 部署 Redis：
```bash
kubectl apply -f app-yaml/redis-deployment.yaml
kubectl apply -f app-yaml/redis-svc.yaml
```

2. 部署指標應用程式：
```bash
kubectl apply -f app-yaml/app-deployment.yaml
kubectl apply -f app-yaml/app-svc.yaml
```

3. 套用監控：
```bash
kubectl apply -f servicemonitor/servicemonitor.yaml
```

4. 套用網路策略：
```bash
kubectl apply -f networkpolicy/deny-all.yaml
kubectl apply -f networkpolicy/allow-external-to-app.yaml
kubectl apply -f networkpolicy/allow-nodejs.yaml
```

## 學習目標
- 了解 Kubernetes 部署和服務
- 實作 Prometheus 監控
- 設定網路策略以加強安全性
- 使用多容器應用程式
- 容器編排基礎

## 授權
本專案僅供教育用途。