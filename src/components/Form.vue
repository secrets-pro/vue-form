<template>
  <div v-if="Object.keys(currentModel).length" class="vue-form" v-show="show">
    <component
      :is="`${this.prefix}-form`"
      size="medium"
      :class="`vue-form ${this.trait ? 'trait' : ''}`"
      :model="currentModel"
      :ref="formId"
      :label-width="
        (this.prefix === 'el' ? schema.labelWidth + 'px' : schema.labelWidth) ||
        this.defaultWidth
      "
    >
      <vue-form-title
        v-if="split && propertiesSorted.length"
        :title="enRes.basicSetting || '基础设置'"
        :description="enRes.basicSettingTip || '部署配置中必要的参数内容'"
      />
      <div class="card form-card">
        <form-item-plugin
          v-for="prop in propertiesSorted"
          :key="prop.name"
          :labelWidth="labelWidth"
          v-model="currentModel[prop.name]"
          :config="prop"
          :prop="prop.name"
          @arrayInput="arrayInput"
          @deepInput="deepInput"
          @on-copy="copyed"
        ></form-item-plugin>
      </div>
      <div class="card form-card" v-if="Object.keys(lastKeysProperties).length">
        <vue-form-title
          v-if="split"
          :title="enRes.highSetting || '高级配置'"
          :description="enRes.highSettingTip || '除必要参数之外额外设置的内容'"
        />
        <!-- {{ lastKeysProperties[prop] }} -->
        <form-item-plugin
          v-for="prop in settingcp"
          :key="prop"
          :labelWidth="labelWidth"
          v-model="currentModel[prop]"
          :config="{
            ...lastKeysProperties[prop],
            required: true,
          }"
          :prop="prop"
          @arrayInput="arrayInput"
          @deepInput="deepInput"
          @on-copy="copyed"
          required
        ></form-item-plugin>
        <div v-if="!settings.length" style="padding: 12px">
          <div style="text-align: center">
            <slot name="text"> 没有可展示的配置项目，请点击设置按钮添加 </slot>
          </div>
        </div>
        <div style="text-align: center">
          <slot name="setting"></slot>
        </div>
      </div>
    </component>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
const letters = "abcdefghijklmn".split("");
// import { set, get, difference, debounce, omit, merge } from "lodash-es";
import set from "lodash-es/set";
import get from "lodash-es/get";
import difference from "lodash-es/difference";
import debounce from "lodash-es/debounce";
import omit from "lodash-es/omit";
import merge from "lodash-es/merge";
import { shallowClone, smartClone, performanceMonitor } from "../utils/performance";

import FormItemPlugin from "./FormItem.vue";
import setting, { optKey } from "../config";

const formatDate = setting.formatDate;
const extraOptions = setting.extraOptions;
let Title = {
  props: {
    title: String,
    description: String,
  },
  computed: {
    prefix() {
      return !setting.options.iView ? "el" : "i";
    },
  },
  render() {
    // let exp = extraOptions(description);
    let Tag = this.prefix + "-tooltip";
    let ButtonTag = this.prefix + "-button";
    let icon = this.prefix === "el" ? "el-icon-info" : "ios-information-circle";
    return (
      <div>
        <span class="vue-form-title">{this.title}</span>
        {this.description ? (
          <Tag
            class="item"
            effect="dark"
            placement="top"
            max-width="200"
            content={this.description}
          >
            <ButtonTag
              icon={icon} //  icon类型
              style={{
                padding: 0,
                border: 0,
                width: "auto",
                height: "auto",
                color: "#04a7b2",
                // marginTop:"-2px"
              }}
            ></ButtonTag>
          </Tag>
        ) : null}
      </div>
    );
  },
};
export default {
  components: { "form-item-plugin": FormItemPlugin, "vue-form-title": Title },
  provide() {
    return {
      Form: this,
    };
  },
  name: "vue-form",
  props: {
    schema: Object,
    request: {
      type: Function,
      default() {
        return () => {};
      },
    },
    trait: Boolean,
    model: {
      type: Object,
      default() {
        return {};
      },
    },
    show: {
      type: Boolean,
      default() {
        return true;
      },
    },
    initinal: {
      type: Boolean,
      default: true,
    },
    split: {
      type: Boolean,
      default: true,
    },
    labelWidth: {
      type: Number,
      default: 120,
    },
    readonly: Boolean,
  },
  beforeCreate() {
    this.$emit("on-create");
  },
  created() {
    // 开始测量组件创建到首次渲染完成的时间
    if (performanceMonitor.enabled) {
      this._renderStartTime = performance.now();
      this._firstRenderRecorded = false; // 标志，确保只记录首次渲染
    }
    // 优化：首次渲染不使用 debounce，直接执行以提高性能
    // 保存原始的 handleWatch 方法
    const originalHandleWatch = this.handleWatch.bind(this);
    // 创建 debounced 版本用于后续更新
    const debouncedHandleWatch = debounce(originalHandleWatch, 300);
    // 首次渲染直接执行，后续更新使用 debounce
    let isFirstRender = true;
    this.handleWatch = () => {
      if (isFirstRender) {
        // 首次渲染直接执行，不使用 debounce
        isFirstRender = false;
        originalHandleWatch();
        // handleWatch 执行完成后，等待 DOM 更新
        if (performanceMonitor.enabled && this._renderStartTime && !this._firstRenderRecorded) {
          this._firstRenderRecorded = true; // 标记已记录，避免重复记录
          this.$nextTick(() => {
            this.$nextTick(() => {
              const renderDuration = performance.now() - this._renderStartTime;
              // 记录到性能监控器
              const componentName = "vue-form";
              if (!performanceMonitor.componentTimings.has(componentName)) {
                performanceMonitor.componentTimings.set(componentName, []);
              }
              const timing = {
                label: "[vue-form] 首次渲染",
                duration: renderDuration.toFixed(2),
                durationMs: renderDuration,
                timestamp: Date.now()
              };
              performanceMonitor.componentTimings.get(componentName).push(timing);
              
              // 输出准确的首次渲染时间
              console.warn(`[Performance] [vue-form] 首次渲染完成 耗时: ${renderDuration.toFixed(2)}ms`, {
                字段数: this.propertiesSorted?.length || 0,
                实际耗时: `${renderDuration.toFixed(2)}ms`
              });
            });
          });
        }
      } else {
        // 后续更新使用 debounce
        debouncedHandleWatch();
      }
    };
    this.handleWatch();
  },
  mounted() {
    this.$emit("on-mounted");
  },
  computed: {
    defaultWidth() {
      return this.prefix === "el" ? `${this.labelWidth}px` : this.labelWidth;
    },
    settingcp() {
      let config = this.schema.properties;
      let s = this.settings;
      return s
        .filter((el) => Object.prototype.hasOwnProperty.call(config, el))
        .sort((a, b) => {
          if (!config[a]) {
            console.error(`属性${a}在schema中不存在对应配置`);
            return -1;
          }
          if (!config[b]) {
            console.error(`属性${b}在schema中不存在对应配置`);
            return -1;
          }
          let pa = extraOptions(config[a].description);
          let pb = extraOptions(config[b].description);
          return pa.index - pb.index;
        });
    },
    rowSize() {
      return !this.schema.layout
        ? 1
        : Math.ceil(
            Object.keys(this.currentModel).length / (24 / (this.schema.layout.span || 8))
          );
    },
    prefix() {
      return !setting.options.iView ? "el" : "i";
    },
  },
  watch: {
    schema(n) {
      this.settings = [];
      this.currentScheme = n;
      this.$emit("on-scheme-change");
      this.handleWatch();
    },
    model: {
      deep: true,
      handler(n, o) {
        // 优化：使用智能拷贝，根据对象结构选择浅拷贝或深拷贝
        this.initModel = smartClone(n);
        this.$emit("on-model-change");
        this.handleWatch();
      },
    },

    show(n, o) {
      // 当状态变化
      if (!this.once) {
        // 只会监听一次
        if (n === true && o === false) {
          this.once = true;
          this.visiableStatus = true;
        }
      }
    },
  },
  data() {
    return {
      enRes: setting.getEnResource(),
      modal: false,
      emptyProps: [],
      currentScheme: this.schema,
      currentModel: {},
      formId: this.randomId(),
      // 默认状态为show的初始值
      visiableStatus: this.show,
      rules: {},
      special: [],
      once: false,
      propertiesSorted: [],
      lastKeysProperties: [],
      settings: [],
      required: [],
      initModel: smartClone(this.model),
      lastestNeedOneProps: [],
    };
  },
  methods: {
    copyed(value) {
      this.$emit("on-copy", value);
    },
    handleWatch() {
      this.validateScheme();
      this.setSortProperties();
      this.$emit("on-change-end");
    },
    changeSetting(setting) {
      this.settings = setting;
    },

    getSetting() {
      return {
        settings: this.settings,
        lastKeysProperties: this.lastKeysProperties,
      };
    },
    setSortProperties() {
      const key = performanceMonitor.start("[vue-form] setSortProperties");
      // 优化：直接使用 properties，不需要深拷贝（因为后面会创建新对象）
      let properties = this.currentScheme.properties || {};
      // 对最外层properties进行排序（position越小排前面）
      // 确保 required 是数组格式，兼容 boolean 或其他类型
      const required = Array.isArray(this.currentScheme.required) 
        ? this.currentScheme.required 
        : [];
      let lastKeys = Object.keys(properties);
      
      // 优化：使用 Set 提高查找效率
      const requiredSet = new Set(required);
      lastKeys = lastKeys.filter(key => !requiredSet.has(key));

      // 优化：使用展开运算符创建新对象，避免深拷贝
      let propertiesSorted = required.map((el) => ({
        name: el,
        ...properties[el],
      }));
      let lastKeysProperties = {};
      lastKeys.forEach((el) => {
        lastKeysProperties[el] = {
          name: el,
          ...properties[el],
        };
      });

      // 优化：使用 Set 提高查找效率
      let settings = Object.keys(this.initModel || {});
      settings = settings.filter(key => !requiredSet.has(key));
      
      this.settings = settings;
      this.required = required;

      // 优化：直接赋值，避免不必要的 map/reduce 操作
      if (this.split) {
        this.propertiesSorted = propertiesSorted;
        this.lastKeysProperties = lastKeysProperties;
      } else {
        // 优化：直接合并数组，避免额外的 map 操作
        this.propertiesSorted = [
          ...propertiesSorted,
          ...Object.values(lastKeysProperties)
        ];
        this.lastKeysProperties = {};
      }
      if (key) {
        performanceMonitor.end(key, {
          componentName: "vue-form",
          data: {
            propertiesSortedCount: this.propertiesSorted.length,
            lastKeysPropertiesCount: Object.keys(this.lastKeysProperties).length
          }
        });
      }
    },
    // FIXME  优化
    arrayInput(key, value) {
      if (key.indexOf(".") > -1) {
        let keys = key.split(".");
        let lastKey = keys[keys.length - 1];
        keys.splice(keys.length - 1, 1);
        let obj = this.currentModel;
        for (let index in keys) {
          let curKey = keys[index];
          obj = obj[curKey];
        }
        this.$set(obj, lastKey, value);
      } else {
        this.$set(this.currentModel, key, value);
      }
    },
    deepInput(key, value) {
      set(this.currentModel, key, value);
      // JSON.parse(JSON.stringify(this.currentModel));
    },
    // 支持自定义数据转换
    getData(replacer) {
      let obj = JSON.parse(JSON.stringify(this.currentModel, replacer));
      let result = {};
      Object.keys(obj).forEach((el) => {
        let value = obj[el];
        if (value instanceof Date) {
          result[el] = formatDate(value, "yyyy-MM-dd");
        } else if (Array.isArray(value)) {
          // 空数组 或者 数组里的值都是空
          // if (value.length === 0 || value.join("").length === 0) {
          //   // empty
          // } else {
          //   result[el] = value;
          // }
          result[el] = value;
        } else if (value !== "") {
          result[el] = value;
        }
      });
      if (this.special.length) {
        this.special.forEach((el) => {
          let __temp__ = get(obj, el);
          if (__temp__) {
            let v = JSON.parse(JSON.stringify(__temp__));
            let value = {};
            v.forEach((els) => {
              let key = els.key;
              if (key) {
                delete els.key;
                // 这里判断一下 字符串
                if (Object.keys(els).length === 1) {
                  value[key] = els[Object.keys(els)[0]];
                } else {
                  value[key] = { ...els };
                }
              }
            });
            // result[el] = value;
            set(result, el, value);
          }
        });
      }
      result = this.removeOneOfOption(result);
      // 只返回配置的key
      let retn = {};
      if (this.split) {
        let ks = [].concat(this.required).concat(this.settings);
        ks.forEach((el) => {
          retn[el] = result[el];
        });
      } else {
        retn = result;
      }
      // 最后处理一下 emptyProps
      if (this.emptyProps.length) {
        for (let key of this.emptyProps) {
          retn = omit(retn, [key]);
        }
      }
      return retn;
    },
    // 移除记住oneof选项
    removeOneOfOption(result) {
      // console.log("==removeOneOfOption===", result);
      if (!result) {
        return result;
      }
      Object.keys(result).forEach((el) => {
        if (el.includes(optKey)) {
          delete result[el];
        } else if (typeof result[el] === "object") {
          this.removeOneOfOption(result[el]);
        }
      });
      return result;
    },
    randomId() {
      let y = new Date().getTime() + "";
      return y
        .substring(6)
        .split("")
        .map((el) => letters[el])
        .join("");
    },
    validate(string) {
      let resp = new Promise((resolve, reject) => {
        this.$refs[this.formId].validate((el) => {
          let res = el && this.validatelastestNeedOneProps();
          resolve(res);
        });
      });
      return resp;
    },
    async confirm() {
      await this.validate();
    },
    reset() {
      this.$refs[this.formId].resetFields();
    },
    setArrayModal(currentScheme, rules, parentProp, defaultValue) {
      const { items } = currentScheme;
      let _value = [];
      const minItems = currentScheme.minItems || 0;
      const needsInit = this.initinal && !(currentScheme.description && JSON.parse(currentScheme.description).url);
      
      if (items.type === "string") {
        set(currentScheme, "item", "");
        if (needsInit) {
          // 优化：直接创建数组，避免循环 push
          _value = Array(Math.max(1, minItems)).fill("");
        }
      } else if (items.type === "boolean") {
        set(currentScheme, "item", true);
        if (this.initinal) {
          // 优化：直接创建数组
          _value = Array(Math.max(1, minItems)).fill(true);
        }
      } else if (items.type === "number" || items.type === "integer") {
        set(currentScheme, "item", 0);
        if (this.initinal) {
          // 优化：直接创建数组
          _value = Array(Math.max(1, minItems)).fill(0);
        }
      } else if (items.type === "object") {
        if (defaultValue && Array.isArray(defaultValue) && defaultValue.length) {
          defaultValue.forEach((defaultValueItem, index) => {
            let obj = this.setModel(items, {}, `${parentProp}.${index}`);
            set(currentScheme, "item", obj);
            if (this.initinal) {
              _value.push(obj);
            }
          });
        } else {
          let obj = this.setModel(items, {}, parentProp);
          set(currentScheme, "item", obj);
          if (this.initinal) {
            _value.push(obj);
          }
        }
        
        // 优化：对于对象类型，只在需要时创建模板并批量克隆
        if (minItems > 1 && this.initinal && _value.length > 0) {
          const template = _value[0];
          // 优化：使用更高效的批量克隆方式
          // 对于简单对象结构，使用浅拷贝+深拷贝组合
          const remaining = minItems - 1;
          if (remaining > 0) {
            // 批量创建，减少函数调用开销
            for (let j = 0; j < remaining; j++) {
              // 优化：只在对象有嵌套结构时才使用深拷贝
              _value.push(smartClone(template));
            }
          }
        }
      }
      
      return _value;
    },
    setModel(currentScheme, rules, parentProp, _defaultValue) {
      // 只在顶层调用时监控性能
      const isTopLevel = !parentProp;
      const key = isTopLevel ? performanceMonitor.start("[vue-form] setModel") : null;
      
      let { properties, required, description } = currentScheme;
      if (!properties) {
        if (key) {
          performanceMonitor.end(key, { componentName: "vue-form" });
        }
        return {};
      }
      let model = {};
      let props = Object.keys(properties);
      // 优化：缓存 extraOptions 结果
      const extraOpts = extraOptions(description);
      let { lastestNeedOne, title } = extraOpts;
      let lastestNeedOneProps = [];
      let propTitles = [];
      
      // 优化：使用 Set 提高 required 查找效率
      // 确保 required 是数组格式，兼容 boolean 或其他类型
      const requiredArray = Array.isArray(required) ? required : [];
      const requiredSet = new Set(requiredArray);
      
      // 优化：预先计算 parentProp 路径前缀，避免重复字符串拼接
      const propPrefix = parentProp ? parentProp + "." : "";
      
      // lastestNeedOne 当前平级的属性至少满足一个 ，如果属性是object类型 则其所有属性都要有值
      props.forEach((el) => {
        let prop = el;
        let config = properties[el];
        
        // 优化：缓存 extraOptions 结果
        let configExtraOpts = null;
        if (lastestNeedOne) {
          configExtraOpts = extraOptions(config.description);
          propTitles.push(configExtraOpts.title);
          lastestNeedOneProps.push(propPrefix + prop);
        }

        // 优化：使用 Set 查找
        if (requiredSet.has(prop)) {
          config.required = true;
        }
        // 去掉其必填标志
        if (lastestNeedOne) {
          config.required = false;
        }

        // 优化：减少 get 调用次数，合并路径计算
        const propPath = propPrefix + el;
        let defaultValue = get(this.initModel || {}, propPath, undefined);

        if (defaultValue === undefined) {
          defaultValue = get(_defaultValue, el, undefined);
        }

        if (defaultValue === undefined) {
          defaultValue = config.defaultValue || config.default;
        }

        // 优化：复用之前的 get 结果
        let d = get(this.initModel || {}, propPath);
        if (d === false || d === 0) {
          defaultValue = d;
        }

        // 优化：预先判断是否有嵌套路径
        const hasNestedPath = prop.indexOf(".") > -1;
        
        if (config.type === "checkbox") {
          const value = defaultValue || [];
          set(model, prop, value);
          if (hasNestedPath) {
            model[prop] = value;
          }
        } else if (config.type === "integer" || config.type === "number") {
          const value = typeof defaultValue === "number" ? defaultValue : "";
          set(model, prop, value);
          if (hasNestedPath) {
            model[prop] = value;
          }
        } else if (config.type === "array") {
          // 数组类型
          // 设置默认的格式 config.items
          let _value = this.setArrayModal(config, rules, prop, defaultValue);
          // 优化：避免不必要的 merge 操作
          const finalValue = (defaultValue && Array.isArray(defaultValue) && defaultValue.length)
            ? defaultValue
            : (_value || "");
          set(model, prop, finalValue);
          if (hasNestedPath) {
            model[prop] = finalValue;
          }
        } else if (config.type === "boolean" || config.type === "bool") {
          if (config.children) {
            let values = this.setModel(
              { properties: config.children },
              config.children.rules || {},
              el
            );
            // 优化：使用 Object.assign 或直接赋值，避免 map
            Object.assign(model, values);
          }
          model[prop] = !!defaultValue;
        } else {
          const value = defaultValue || "";
          set(model, prop, value);
          if (hasNestedPath) {
            model[prop] = defaultValue;
          }

          if (config.children) {
            Object.keys(config.children).forEach((pProp) => {
              let values = this.setModel(
                { properties: config.children[pProp] },
                config.children[pProp].rules || {},
                pProp
              );
              // 优化：使用 Object.assign，避免 map
              Object.assign(model, values);
            });
          }
        }
        if (config.type === "object" && config.properties) {
          model[prop] = this.setModel(config, rules, prop, defaultValue);
        } else if (config.type === "object" && config.oneOf) {
          // if (el == "serviceType") {
          // 	console.log(
          // 		"====serviceType==setModel=",
          // 		config,
          // 		prop,
          // 		defaultValue
          // 	);
          // }
          // 通过比较属性key，确定选中的是哪一个。
          // 优化：缓存 extraOptions 结果
          const configExtraOpts = extraOptions(config.description);
          let configOneOfModelArray = [];
          let selectedIndex = configExtraOpts.default || 0;
          config.oneOf.forEach((oneOfItem) => {
            const oneOfItemMoel = this.setModel(oneOfItem, {}, prop, defaultValue);

            oneOfItem.defaultModel = oneOfItemMoel;
            configOneOfModelArray.push(oneOfItemMoel);
          });

          if (defaultValue) {
            // 优化：预先计算 defaultValueKeys，避免在循环中重复计算
            const defaultValueKeys = Object.keys(defaultValue);
            const defaultValueKeysSet = new Set(defaultValueKeys);
            configOneOfModelArray.forEach((modelItem, index) => {
              const modelItemKeys = Object.keys(modelItem);
              // 优化：使用 Set 进行快速比较
              if (modelItemKeys.length === defaultValueKeys.length) {
                const allMatch = modelItemKeys.every(key => defaultValueKeysSet.has(key));
                if (allMatch) {
                  selectedIndex = index;
                }
              }
            });
            if (selectedIndex > -1) {
              // 优化：使用 Object.assign 替代 merge（更快）
              config.oneOf[selectedIndex].defaultModel = Object.assign(
                {},
                config.oneOf[selectedIndex].defaultModel,
                defaultValue
              );
            }
          }
          if (selectedIndex > -1) {
            let defa = config.oneOf[selectedIndex].defaultModel;
            defa[`${prop}-option`] = selectedIndex;
            set(model, prop, defa || {});
          } else {
            if (defaultValue) {
              defaultValue[`${prop}-option`] = selectedIndex;
            }
            set(model, prop, defaultValue || {});
          }
        } else if (
          (config.type === "object" && !config.properties && !config.oneOf) ||
          config.additionalProperties
        ) {
          let properties = {};
          let w = "calc(50% - 18px)";
          if (config.additionalProperties) {
            if (config.additionalProperties.type === "object") {
              properties = {
                key: {
                  type: "string",
                  title: this.enRes.key || "键",
                  description: '{"title":"key"}',
                  "ui:options": {
                    width: w,
                  },
                  "ui:classes": ["vue-object-key"],
                },
                ...config.additionalProperties.properties,
              };
            } else if (config.additionalProperties.type === "string") {
              properties = {
                key: {
                  type: "textarea",
                  title: this.enRes.key || "键",
                  "ui:options": {
                    width: w,
                  },
                  "ui:classes": ["vue-object-key"],
                  required: config.required,
                },
                value: {
                  type: "textarea",
                  title: this.enRes.value || "值",
                  "ui:options": {
                    width: w,
                  },
                  "ui:classes": ["vue-object-value"],
                  required: config.required,
                },
              };
            }
          } else {
            properties = {
              key: {
                type: "textarea",
                title: this.enRes.key || "键",
                "ui:options": {
                  width: w,
                },
              },
              value: {
                type: "textarea",
                title: this.enRes.value || "值",
                "ui:options": {
                  width: w,
                },
              },
            };
          }
          config.type = "array";
          config.items = {
            type: "object",
            properties,
          };
          this.special.push(parentProp ? parentProp + "." + prop : prop);
          let _value = this.setArrayModal(config, rules, prop);
          if (
            defaultValue &&
            Object.keys(defaultValue).length &&
            !Array.isArray(defaultValue)
          ) {
            // 这里 有问题
            let __ks__ = Object.keys(defaultValue);
            let value = __ks__.map((k) => {
              let v = defaultValue[k];
              if (Object.prototype.toString.call(v) === "[object Object]") {
                return {
                  key: k,
                  ...defaultValue[k],
                };
              }
              return {
                key: k,
                value: defaultValue[k],
              };
            });
            set(model, prop, value || _value || []);
          } else {
            let v =
              defaultValue && Object.keys(defaultValue).length
                ? defaultValue
                : _value || [];
            set(model, prop, v);
          }

          if (hasNestedPath) {
            model[prop] = defaultValue || _value || [];
          }
          // throw new Error(`类型为object的属性${parentProp}没有properties配置`);
        }
        // else {

        //   set(rules, parentProp ? parentProp + "." + prop : prop, baseRule);
        // }
        // }
      });
      if (lastestNeedOne) {
        this.lastestNeedOneProps.push({
          [propTitles.join("、")]: lastestNeedOneProps,
        });
      }
      
      // 结束性能监控
      if (key) {
        performanceMonitor.end(key, {
          componentName: "vue-form",
          data: {
            propertiesCount: props.length,
            modelKeysCount: Object.keys(model).length,
            depth: parentProp ? parentProp.split('.').length : 0
          }
        });
      }
      
      return model;
    },
    isEmpty(value) {
      let ret = false;
      if (Array.isArray(value)) {
        ret = value.some((el) => !el);
      } else if (typeof value === "object") {
        ret = Object.values(value).some((el) => !el);
      } else if (typeof value === "number") {
        ret = false;
      } else {
        ret = !value;
      }
      return ret;
    },
    validatelastestNeedOneProps() {
      this.emptyProps = [];
      for (let group of this.lastestNeedOneProps) {
        let defKey = Object.keys(group)[0];
        let entity = group[defKey];
        let values = entity.map((el) => {
          return !this.isEmpty(get(this.currentModel, el));
        });

        this.emptyProps.push(
          ...values.map((el, index) => (!el ? entity[index] : null)).filter((el) => el)
        );

        //  只要不同时为false
        let v = values.some((el) => !!el);
        if (!v) {
          this.$emit("on-validate-error", defKey + " 至少需要完善一个子配置内容");
          return false;
        }
      }
      return true;
    },
    validateScheme() {
      if (!this.currentScheme) {
        throw new Error("请配置schema");
      }
      const key = performanceMonitor.start("[vue-form] validateScheme");
      // 解析 shceme
      // let props = Object.keys(this.currentScheme.properties);
      // let model = {}; // 准备model
      let rules = {}; //  准备rules
      // let cps = JSON.parse(JSON.stringify(this.currentScheme));
      let model = this.setModel(this.currentScheme, rules);
      this.currentModel = model;
      if (key) {
        performanceMonitor.end(key, {
          componentName: "vue-form",
          data: {
            propertiesCount: Object.keys(this.currentScheme.properties || {}).length,
            modelKeysCount: Object.keys(model).length
          }
        });
      }
    },
  },
};
</script>
<style lang="less">
// class  看 iview 和 element-ui的名称
.vue-form {
  .ivu-form-item-label {
    word-break: break-all;
  }
  .ivu-btn + .ivu-btn {
    margin-left: 10px;
  }
  .el-form-item__content {
    .el-select,
    .el-input-number {
      width: 100%;
    }
  }
  .el-form-item__label {
    word-break: break-all;
  }
  .ivu-form-item-content {
    .ivu-select,
    .ivu-input-number {
      width: 100%;
    }
  }
  .ivu-btn > .ivu-icon {
    line-height: 1;
    vertical-align: unset;
  }
  .vue-form-title {
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: #333;
  }
  
  // 优化卡片布局
  .form-card {
    background: transparent;
    padding: 0;
    margin-bottom: 0;
    border: none;
    box-shadow: none;
    
    // 每个顶级分组（item-object.top-level-group）已经有自己的卡片样式
    // 这里只需要确保分组之间有合适的间距
    > .item-object.top-level-group {
      margin-bottom: 12px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
