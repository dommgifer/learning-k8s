const client = require('prom-client');
const express = require('express');
const Redis = require('ioredis');

const app = express();
const PORT = 3000;

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Redis 連線狀態指標
const redisStatusGauge = new client.Gauge({
  name: 'redis_connection_status',
  help: 'Redis connection status: 1 for connected, 0 for not connected',
});

let redisStatusMessage = '❌ 尚未連線';
let redisConnected = false;

// 建立 Redis client 並設定自動重連機制
const redis = new Redis({
  host: redisHost,
  port: redisPort,
  lazyConnect: false, // 啟動時立即連線
  retryStrategy: (times) => {
    const delay = Math.min(times * 1000, 10000); // 最多延遲 10 秒
    console.warn(`🔄 Redis 連線失敗，第 ${times} 次重試，等待 ${delay}ms`);
    return delay;
  },
  reconnectOnError: (err) => {
    console.warn(`⚠️ Redis 錯誤：${err.message}`);
    return true; // 一律重連
  },
});

// 事件監聽：成功連線
redis.on('ready', () => {
  redisConnected = true;
  redisStatusGauge.set(1);
  redisStatusMessage = '✅ Redis 已連線';
  console.log(redisStatusMessage);
});

// 事件監聽：斷線
redis.on('end', () => {
  redisConnected = false;
  redisStatusGauge.set(0);
  redisStatusMessage = '❌ Redis 已斷線';
  console.warn(redisStatusMessage);
});

// 事件監聽：錯誤
redis.on('error', (err) => {
  redisConnected = false;
  redisStatusGauge.set(0);
  redisStatusMessage = `❌ Redis 錯誤: ${err.message}`;
  // `retryStrategy` 已處理重連
});

console.log(`🔧 正在連接 Redis: ${redisHost}:${redisPort}`);

// HTTP 根路由：顯示 Redis 狀態
app.get('/', (req, res) => {
  res.send(redisStatusMessage);
});

// Prometheus metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`🚀 listening... http://localhost:${PORT}`);
});
