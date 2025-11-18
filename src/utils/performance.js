/**
 * 性能优化工具函数
 */

// extraOptions 缓存
const extraOptionsCache = new Map();
const MAX_CACHE_SIZE = 1000;

/**
 * 优化的 extraOptions，带缓存机制
 */
export function cachedExtraOptions(description) {
  if (!description) {
    return {};
  }
  
  // 如果已经是对象，直接返回（不需要缓存）
  if (typeof description === 'object' && description !== null) {
    return description;
  }
  
  // 检查缓存
  if (extraOptionsCache.has(description)) {
    return extraOptionsCache.get(description);
  }
  
  let rtn = {};
  try {
    rtn = JSON.parse(description);
  } catch (error) {
    console.error(error, description);
    rtn.description = description;
  }
  
  // 限制缓存大小，使用 LRU 策略
  if (extraOptionsCache.size >= MAX_CACHE_SIZE) {
    const firstKey = extraOptionsCache.keys().next().value;
    extraOptionsCache.delete(firstKey);
  }
  extraOptionsCache.set(description, rtn);
  
  return rtn;
}

/**
 * 浅拷贝函数（比深拷贝快很多）
 */
export function shallowClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return [...obj];
  }
  
  return { ...obj };
}

/**
 * 优化的深拷贝函数
 * 优先使用结构化克隆，降级到 JSON 方法
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 使用结构化克隆（现代浏览器支持，性能更好）
  if (typeof structuredClone !== 'undefined') {
    try {
      return structuredClone(obj);
    } catch (e) {
      // 降级到 JSON 方法
    }
  }
  
  // 降级方案
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 判断是否需要深拷贝
 * 如果对象结构简单，可以使用浅拷贝
 */
export function needsDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }
  
  // 简单对象可以使用浅拷贝
  if (Array.isArray(obj)) {
    return obj.some(item => typeof item === 'object' && item !== null);
  }
  
  // 检查是否有嵌套对象
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return true;
    }
  }
  
  return false;
}

/**
 * 智能拷贝：根据对象结构选择浅拷贝或深拷贝
 */
export function smartClone(obj) {
  if (needsDeepClone(obj)) {
    return deepClone(obj);
  }
  return shallowClone(obj);
}

/**
 * 使用 requestIdleCallback 或 setTimeout 分批处理
 */
export function processInBatches(items, processor, batchSize = 10, callback) {
  let index = 0;
  const total = items.length;
  
  function processBatch() {
    const end = Math.min(index + batchSize, total);
    
    for (let i = index; i < end; i++) {
      processor(items[i], i);
    }
    
    index = end;
    
    if (index < total) {
      // 使用 requestIdleCallback 或 setTimeout
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(processBatch, { timeout: 1000 });
      } else {
        setTimeout(processBatch, 0);
      }
    } else if (callback) {
      callback();
    }
  }
  
  processBatch();
}

/**
 * 防抖函数（用于优化频繁调用）
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 性能监控装饰器
 */
export function withPerformanceMonitor(func, name) {
  return function(...args) {
    const start = performance.now();
    const result = func.apply(this, args);
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 100) {
      console.warn(`[Performance] ${name || func.name} 执行时间: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  };
}

/**
 * 性能监控器类
 */
class PerformanceMonitor {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.threshold = options.threshold || 100; // 超过此时间（ms）才警告
    this.logLevel = options.logLevel || 'warn'; // 'log', 'warn', 'error', 'none'
    this.metrics = new Map(); // 存储性能指标
    this.componentTimings = new Map(); // 组件渲染时间
  }

  /**
   * 开始计时
   */
  start(label) {
    if (!this.enabled) return;
    const key = `${label}_${Date.now()}_${Math.random()}`;
    this.metrics.set(key, {
      label,
      startTime: performance.now(),
      startMark: performance.mark ? performance.mark(`${label}-start`) : null
    });
    return key;
  }

  /**
   * 结束计时
   */
  end(key, options = {}) {
    if (!this.enabled) return null;
    
    const metric = this.metrics.get(key);
    if (!metric) {
      console.warn(`[Performance] 未找到计时器: ${key}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    if (performance.mark && performance.measure) {
      try {
        performance.mark(`${metric.label}-end`);
        performance.measure(metric.label, `${metric.label}-start`, `${metric.label}-end`);
      } catch (e) {
        // 忽略错误
      }
    }

    const result = {
      label: metric.label,
      duration: duration.toFixed(2),
      durationMs: duration,
      timestamp: Date.now()
    };

    // 记录到组件时间
    if (options.componentName) {
      if (!this.componentTimings.has(options.componentName)) {
        this.componentTimings.set(options.componentName, []);
      }
      this.componentTimings.get(options.componentName).push(result);
    }

    // 根据阈值和日志级别输出
    if (duration > this.threshold) {
      const message = `[Performance] ${metric.label} 耗时: ${duration.toFixed(2)}ms`;
      if (this.logLevel === 'warn') {
        console.warn(message, options.data || '');
      } else if (this.logLevel === 'error') {
        console.error(message, options.data || '');
      } else if (this.logLevel === 'log') {
        console.log(message, options.data || '');
      }
    }

    this.metrics.delete(key);
    return result;
  }

  /**
   * 测量函数执行时间
   */
  measure(label, func, context = null) {
    if (!this.enabled) {
      return func.apply(context, Array.from(arguments).slice(3));
    }
    
    const key = this.start(label);
    try {
      const result = func.apply(context, Array.from(arguments).slice(3));
      this.end(key);
      return result;
    } catch (error) {
      this.end(key, { error: true });
      throw error;
    }
  }

  /**
   * 获取组件性能统计
   */
  getComponentStats(componentName) {
    const timings = this.componentTimings.get(componentName) || [];
    if (timings.length === 0) return null;

    const durations = timings.map(t => t.durationMs);
    return {
      count: timings.length,
      total: durations.reduce((a, b) => a + b, 0).toFixed(2),
      average: (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2),
      min: Math.min(...durations).toFixed(2),
      max: Math.max(...durations).toFixed(2),
      timings: timings
    };
  }

  /**
   * 获取所有性能统计
   */
  getAllStats() {
    const stats = {};
    this.componentTimings.forEach((timings, componentName) => {
      stats[componentName] = this.getComponentStats(componentName);
    });
    return stats;
  }

  /**
   * 清除所有统计数据
   */
  clear() {
    this.metrics.clear();
    this.componentTimings.clear();
  }

  /**
   * 输出性能报告
   */
  report() {
    if (!this.enabled) return;
    
    const stats = this.getAllStats();
    console.group('[Performance Report]');
    Object.keys(stats).forEach(componentName => {
      const stat = stats[componentName];
      console.log(`\n${componentName}:`, {
        渲染次数: stat.count,
        总耗时: `${stat.total}ms`,
        平均耗时: `${stat.average}ms`,
        最小耗时: `${stat.min}ms`,
        最大耗时: `${stat.max}ms`
      });
    });
    console.groupEnd();
  }
}

// 创建全局性能监控实例
export const performanceMonitor = new PerformanceMonitor({
  enabled: process.env.NODE_ENV !== 'production', // 生产环境默认关闭
  threshold: 100,
  logLevel: 'warn'
});

/**
 * Vue 组件性能监控 Mixin
 */
export const performanceMixin = {
  data() {
    return {
      _performanceKeys: {}
    };
  },
  beforeCreate() {
    if (!performanceMonitor.enabled) return;
    const componentName = this.$options.name || 'Anonymous';
    const key = performanceMonitor.start(`[${componentName}] beforeCreate`);
    this._performanceKeys.beforeCreate = key;
  },
  created() {
    if (!performanceMonitor.enabled) return;
    if (this._performanceKeys.beforeCreate) {
      performanceMonitor.end(this._performanceKeys.beforeCreate, {
        componentName: this.$options.name || 'Anonymous'
      });
    }
    const componentName = this.$options.name || 'Anonymous';
    const key = performanceMonitor.start(`[${componentName}] created`);
    this._performanceKeys.created = key;
  },
  beforeMount() {
    if (!performanceMonitor.enabled) return;
    if (this._performanceKeys.created) {
      performanceMonitor.end(this._performanceKeys.created, {
        componentName: this.$options.name || 'Anonymous'
      });
    }
    const componentName = this.$options.name || 'Anonymous';
    const key = performanceMonitor.start(`[${componentName}] beforeMount`);
    this._performanceKeys.beforeMount = key;
  },
  mounted() {
    if (!performanceMonitor.enabled) return;
    if (this._performanceKeys.beforeMount) {
      performanceMonitor.end(this._performanceKeys.beforeMount, {
        componentName: this.$options.name || 'Anonymous'
      });
    }
    const componentName = this.$options.name || 'Anonymous';
    const key = performanceMonitor.start(`[${componentName}] mounted`);
    this._performanceKeys.mounted = key;
    
    // 使用 nextTick 测量首次渲染完成时间
    this.$nextTick(() => {
      if (this._performanceKeys.mounted) {
        performanceMonitor.end(this._performanceKeys.mounted, {
          componentName: this.$options.name || 'Anonymous',
          data: { 
            propsCount: Object.keys(this.$props || {}).length,
            dataKeysCount: Object.keys(this.$data || {}).length
          }
        });
      }
    });
  },
  beforeUpdate() {
    if (!performanceMonitor.enabled) return;
    const componentName = this.$options.name || 'Anonymous';
    const key = performanceMonitor.start(`[${componentName}] beforeUpdate`);
    this._performanceKeys.beforeUpdate = key;
  },
  updated() {
    if (!performanceMonitor.enabled) return;
    if (this._performanceKeys.beforeUpdate) {
      performanceMonitor.end(this._performanceKeys.beforeUpdate, {
        componentName: this.$options.name || 'Anonymous'
      });
    }
  },
  beforeDestroy() {
    if (!performanceMonitor.enabled) return;
    const componentName = this.$options.name || 'Anonymous';
    const key = performanceMonitor.start(`[${componentName}] beforeDestroy`);
    this._performanceKeys.beforeDestroy = key;
  },
  destroyed() {
    if (!performanceMonitor.enabled) return;
    if (this._performanceKeys.beforeDestroy) {
      performanceMonitor.end(this._performanceKeys.beforeDestroy, {
        componentName: this.$options.name || 'Anonymous'
      });
    }
  }
};

/**
 * 清除 extraOptions 缓存
 */
export function clearExtraOptionsCache() {
  extraOptionsCache.clear();
}

// 导出性能监控器实例，方便外部配置
export { PerformanceMonitor };

