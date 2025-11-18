# 性能监控使用指南

## 概述

已为 vue-form 组件添加了完整的性能监控系统，可以实时监控组件渲染性能，帮助识别性能瓶颈。

## 功能特性

### 1. 自动性能监控
- 监控组件生命周期钩子（beforeCreate, created, beforeMount, mounted, beforeUpdate, updated）
- 监控关键方法执行时间（validateScheme, setModel, setSortProperties, renderFun）
- 自动记录性能指标并输出警告

### 2. 性能统计
- 记录每个组件的渲染次数
- 计算总耗时、平均耗时、最小耗时、最大耗时
- 支持按组件名称查询统计信息

### 3. 性能报告
- 自动输出性能报告
- 支持手动触发性能报告
- 可在浏览器 Performance 面板中查看详细时间线

## 使用方法

### 基本使用

性能监控默认在开发环境启用，生产环境自动关闭。无需额外配置即可使用。

### 查看性能警告

当方法执行时间超过 100ms 时，会在控制台输出警告：

```
[Performance] [vue-form] validateScheme 耗时: 234.56ms
```

### 获取性能统计

在浏览器控制台中：

```javascript
// 导入性能监控器
import { performanceMonitor } from '@/utils/performance';

// 获取 vue-form 组件的性能统计
const stats = performanceMonitor.getComponentStats('vue-form');
console.log(stats);
// {
//   count: 5,
//   total: "1234.56",
//   average: "246.91",
//   min: "120.34",
//   max: "456.78",
//   timings: [...]
// }

// 获取所有组件的性能统计
const allStats = performanceMonitor.getAllStats();
console.log(allStats);

// 输出性能报告
performanceMonitor.report();
```

### 配置性能监控

```javascript
import { performanceMonitor } from '@/utils/performance';

// 启用/禁用性能监控
performanceMonitor.enabled = true; // 或 false

// 设置警告阈值（ms）
performanceMonitor.threshold = 200; // 超过 200ms 才警告

// 设置日志级别
performanceMonitor.logLevel = 'log'; // 'log', 'warn', 'error', 'none'

// 清除所有统计数据
performanceMonitor.clear();
```

### 手动监控特定方法

```javascript
import { performanceMonitor } from '@/utils/performance';

// 方法 1: 使用 start/end
const key = performanceMonitor.start('my-operation');
// ... 执行操作
performanceMonitor.end(key, {
  componentName: 'my-component',
  data: { operation: 'data-processing' }
});

// 方法 2: 使用 measure
const result = performanceMonitor.measure('my-operation', () => {
  // 执行操作
  return someResult;
}, this);
```

## 监控的关键方法

### Form.vue
- `validateScheme()`: Schema 验证和模型初始化
- `setModel()`: 递归构建表单模型（仅在顶层监控）
- `setSortProperties()`: 属性排序

### FormItem.vue
- `init()`: 组件初始化（异步请求）
- `render()`: 组件渲染
- `renderFun()`: 渲染函数（仅在顶层监控）

## 性能指标说明

### 组件统计信息
- **count**: 执行次数
- **total**: 总耗时（ms）
- **average**: 平均耗时（ms）
- **min**: 最小耗时（ms）
- **max**: 最大耗时（ms）
- **timings**: 详细的执行时间记录数组

### 性能阈值建议
- **< 50ms**: 优秀
- **50-100ms**: 良好
- **100-200ms**: 可接受
- **> 200ms**: 需要优化

## 使用 Performance API

性能监控会自动使用浏览器 Performance API 记录时间线，可以在 Chrome DevTools 的 Performance 面板中查看：

1. 打开 Chrome DevTools
2. 切换到 Performance 面板
3. 点击 Record 开始录制
4. 操作表单
5. 停止录制
6. 在时间线中查找标记的性能指标

## 生产环境

性能监控在生产环境默认关闭，不会影响生产性能。如需在生产环境启用（用于监控），可以：

```javascript
// 在应用入口处
import { performanceMonitor } from '@/utils/performance';

if (process.env.NODE_ENV === 'production') {
  // 生产环境启用（可选）
  performanceMonitor.enabled = true;
  performanceMonitor.logLevel = 'none'; // 不输出日志，只记录数据
}
```

## 示例输出

### 控制台警告
```
[Performance] [vue-form] validateScheme 耗时: 234.56ms {propertiesCount: 50, modelKeysCount: 50}
[Performance] [vue-form-item] renderFun-name 耗时: 12.34ms {prop: "name", type: "string"}
```

### 性能报告
```
[Performance Report]
vue-form: {
  渲染次数: 5,
  总耗时: "1234.56ms",
  平均耗时: "246.91ms",
  最小耗时: "120.34ms",
  最大耗时: "456.78ms"
}

vue-form-item: {
  渲染次数: 250,
  总耗时: "3456.78ms",
  平均耗时: "13.83ms",
  最小耗时: "2.34ms",
  最大耗时: "45.67ms"
}
```

## 注意事项

1. **性能开销**: 性能监控本身有轻微的性能开销，生产环境建议关闭
2. **内存使用**: 统计数据会占用内存，定期调用 `clear()` 清除
3. **浏览器兼容性**: Performance API 在现代浏览器中支持良好
4. **递归监控**: 为避免重复监控，递归方法只在顶层调用时监控

## 故障排查

### 没有看到性能警告
- 检查 `performanceMonitor.enabled` 是否为 `true`
- 检查执行时间是否超过 `threshold` 阈值
- 检查 `logLevel` 设置

### 统计数据不准确
- 确保在正确的时机调用 `start()` 和 `end()`
- 检查是否有未结束的计时器

### 内存占用过高
- 定期调用 `performanceMonitor.clear()` 清除统计数据
- 减少监控的数据量

