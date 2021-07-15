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
      <div class="h5" v-if="split">基础配置</div>
      <div class="card">
        <template v-for="prop in propertiesSorted">
          <form-item-plugin
            :key="prop.name"
            v-model="currentModel[prop.name]"
            :config="prop"
            :prop="prop.name"
            @arrayInput="input"
          ></form-item-plugin>
        </template>
      </div>
      <div class="card" v-if="Object.keys(lastKeysProperties).length">
        <div class="h5">
          高级配置
        </div>
        <template v-for="prop in settingcp">
          <form-item-plugin
            :key="prop"
            v-model="currentModel[prop]"
            :config="lastKeysProperties[prop]"
            :prop="prop"
            @arrayInput="input"
          ></form-item-plugin>
        </template>
        <div v-if="!settings.length" style="padding:12px;">
          <div style="text-align:center;">
            没有可展示的配置项目，请点击设置按钮添加
          </div>
        </div>
        <div style="text-align:center;">
          <slot name="setting"></slot>
        </div>
      </div>
    </component>
    <!-- <Modal v-model="modal">
      <div>
        <CheckboxGroup v-model="settings">
          <Checkbox
            v-for="i in lastKeysProperties"
            :label="i.name"
            :key="i.name"
          >
            <span>{{ i.name }}</span>
          </Checkbox>
        </CheckboxGroup>
      </div>
    </Modal> -->
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
const letters = "abcdefghijklmn".split("");
import { set, get, difference, debounce } from "lodash";
import FormItemPlugin from "./FormItem.vue";
import setting from "../config";

const formatDate = setting.formatDate;
const extraOptions = setting.extraOptions;

export default {
  components: { "form-item-plugin": FormItemPlugin },
  provide() {
    return {
      Form: this
    };
  },
  name: "vue-form",
  props: {
    schema: Object,
    request: {
      type: Function,
      default() {
        return () => {};
      }
    },
    trait: Boolean,
    model: {
      type: Object,
      default() {
        return {};
      }
    },
    show: {
      type: Boolean,
      default() {
        return true;
      }
    },
    initinal: {
      type: Boolean,
      default: true
    },
    split: {
      type: Boolean,
      default: true
    },
    readonly: Boolean
  },
  beforeCreate() {
    this.$emit("on-create");
  },
  created() {
    this.handleWatch = debounce(this.handleWatch, 500);
    this.handleWatch();
  },
  mounted() {
    this.$emit("on-mounte");
  },
  computed: {
    settingcp() {
      let config = this.schema.properties;
      let s = this.settings;
      return s.sort((a, b) => {
        // console.log(a, b);
        let pa = extraOptions(config[a].description);
        let pb = extraOptions(config[b].description);
        // console.log(pa, pb);
        return pa.index - pb.index;
      });
    },
    rowSize() {
      return !this.schema.layout
        ? 1
        : Math.ceil(
            Object.keys(this.currentModel).length /
              (24 / (this.schema.layout.span || 8))
          );
    },
    prefix() {
      return !setting.options.iView ? "el" : "i";
    }
  },
  watch: {
    schema(n) {
      this.currentScheme = n;
      this.handleWatch();
    },
    model: {
      deep: true,
      handler(n) {
        this.initModel = n;
        this.handleWatch();
      }
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
    }
  },
  data() {
    return {
      modal: false,
      defaultWidth: this.prefix === "el" ? "100px" : 100,
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
      initModel: this.model
    };
  },
  methods: {
    handleWatch() {
      this.validateScheme();
      this.setSortProperties();
    },
    changeSetting(setting) {
      this.settings = setting;
    },

    getSetting() {
      return {
        settings: this.settings,
        lastKeysProperties: this.lastKeysProperties
      };
    },
    setSortProperties() {
      let properties = this.currentScheme.properties
        ? JSON.parse(JSON.stringify(this.currentScheme.properties))
        : {};
      // 对最外层properties进行排序（position越小排前面）
      let required = this.currentScheme.required || [];
      let lastKeys = Object.keys(properties);
      for (let i = required.length - 1; i > -1; i--) {
        lastKeys.splice(lastKeys.indexOf(required[i]), 1);
      }
      // lastKeys = required.concat(
      //   lastKeys.sort((a, b) => properties[a].position - properties[b].position)
      // );

      let propertiesSorted = required.map((el) => ({
        name: el,
        ...properties[el]
      }));
      let lastKeysProperties = {};
      lastKeys.forEach((el) => {
        let obj = {
          name: el,
          ...properties[el]
        };
        lastKeysProperties[el] = obj;
      });
      let settings = Object.keys(this.initModel || {});
      for (let i = required.length - 1; i > -1; i--) {
        settings.splice(settings.indexOf(required[i]), 1);
      }
      this.settings = settings;
      this.required = required;

      // 父子段为下拉选项，根据父子段的值渲染不同的子字段，同样需要对其子字段根据position排序

      if (this.split) {
        this.propertiesSorted = JSON.parse(JSON.stringify(propertiesSorted));
        this.lastKeysProperties = JSON.parse(
          JSON.stringify(lastKeysProperties)
        );
      } else {
        this.propertiesSorted = Object.assign(
          {},
          JSON.parse(JSON.stringify(propertiesSorted)),
          JSON.parse(JSON.stringify(lastKeysProperties))
        );
        this.lastKeysProperties = {};
      }
    },
    // FIXME  优化
    input(key, value) {
      if (key.indexOf(".") > -1) {
        // let keys = key.split(".");
        // let lastKey = keys[keys.length - 1];
        // keys.splice(keys.length - 1, 1);
        // let obj = this.currentModel;
        // for (let index in keys) {
        //   let curKey = keys[index];
        //   obj = obj[curKey];
        // }
        // this.$set(obj, lastKey, value);
        set(this.currentModel, key, value);
      } else {
        this.$set(this.currentModel, key, value);
      }
    },
    getData() {
      let obj = JSON.parse(JSON.stringify(this.currentModel));
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
      return retn;
    },
    // 移除记住oneof选项
    removeOneOfOption(result) {
      Object.keys(result).forEach((el) => {
        if (el.includes("-option")) {
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
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs[this.formId].validate((el) => {
          resolve(el);
        });
      });
    },
    async confirm() {
      await this.validate();
    },
    reset() {
      this.$refs[this.formId].resetFields();
    },
    setArrayModal(currentScheme, rules, parentProp) {
      const { items } = currentScheme;
      let _value = [];

      if (items.type === "string") {
        set(currentScheme, "item", "");
        if (this.initinal) {
          _value.push("");
        }
      }
      if (items.type === "boolean") {
        set(currentScheme, "item", true);
        if (this.initinal) {
          _value.push(true);
        }
      } else if (items.type === "number" || items.type === "integer") {
        set(currentScheme, "item", 0);
        if (this.initinal) {
          _value.push(0);
        }
      } else if (items.type === "object") {
        let obj = this.setModel(items, {}, parentProp);
        set(currentScheme, "item", obj);
        if (this.initinal) {
          _value.push(obj);
        }
      }
      if (currentScheme.minItems > 1) {
        if (this.initinal) {
          for (let j = 0; j < currentScheme.minItems - 1; j++) {
            _value.push(_value[0]);
          }
        }
      }
      return _value;
    },
    setModel(currentScheme, rules, parentProp) {
      let { properties, required } = currentScheme;
      if (!properties) {
        return {};
      }
      let model = {};
      let props = Object.keys(properties);

      props.forEach((el) => {
        let prop = el;
        let config = properties[el];
        // if (extraOptions(config.description).multiple) {
        //   debugger;
        // }
        if (Array.isArray(required) && required.includes(prop)) {
          config.required = true;
        }
        // } else if (typeof required === "boolean") {
        //   config.required = true;
        // }

        let defaultValue = get(
          this.initModel || {},
          parentProp ? parentProp + "." + el : el,
          config.defaultValue || config.default
        );
        let d = get(
          this.initModel || {},
          parentProp ? parentProp + "." + el : el
        );
        if (d === false || d === 0) {
          defaultValue = d;
        }

        if (config.type === "checkbox") {
          // model[prop] = defaultValue || [];
          set(model, prop, defaultValue || []);
          if (prop.indexOf(".") > -1) {
            model[prop] = defaultValue || [];
          }
        } else if (config.type === "integer" || config.type === "number") {
          // model[prop] = defaultValue || [];
          set(model, prop, defaultValue || 0);
          if (prop.indexOf(".") > -1) {
            model[prop] = defaultValue || 0;
          }
        } else if (config.type === "array") {
          // 数组类型
          // 设置默认的格式 config.items
          let _value = this.setArrayModal(config, rules, prop);

          set(model, prop, defaultValue || _value || "");
          if (prop.indexOf(".") > -1) {
            model[prop] = defaultValue || _value || "";
          }
        } else if (config.type === "boolean") {
          if (config.children) {
            let values = this.setModel(
              { properties: config.children },
              config.children.rules || {},
              el
            );
            // 将children的值平铺开放到model里
            Object.keys(values).map((el) => {
              model[el] = values[el];
            });
          }
          model[prop] = !!defaultValue;
        } else {
          // model[prop] = defaultValue || null;
          set(model, prop, defaultValue || "");
          if (prop.indexOf(".") > -1) {
            model[prop] = defaultValue;
          }

          if (config.children) {
            Object.keys(config.children).forEach((pProp) => {
              let values = this.setModel(
                { properties: config.children[pProp] },
                config.children[pProp].rules || {},
                pProp
              );
              // 将children的值平铺开放到model里
              Object.keys(values).map((el) => {
                model[el] = values[el];
              });
            });
          }
        }
        if (config.type === "object" && config.properties) {
          model[prop] = this.setModel(config, rules, prop);
        } else if (config.type === "object" && config.oneOf) {
          // 通过比较属性key，确定选中的是哪一个。
          let configOneOfModelArray = [];
          let selectedIndex = extraOptions(config.description).default || 0;
          config.oneOf.forEach((oneOfItem) => {
            const oneOfItemMoel = this.setModel(oneOfItem, {});
            oneOfItem.defaultModel = oneOfItemMoel;
            configOneOfModelArray.push(oneOfItemMoel);
          });

          if (defaultValue) {
            configOneOfModelArray.forEach((modelItem, index) => {
              const modelItemKeys = Object.keys(modelItem);
              const defaultValueKeys = Object.keys(defaultValue);
              if (
                !difference(modelItemKeys, defaultValueKeys).length &&
                !difference(defaultValueKeys, modelItemKeys).length
              ) {
                selectedIndex = index;
              }
            });
            if (selectedIndex > -1) {
              config.oneOf[selectedIndex].defaultModel = defaultValue;
            }
          }
          config.selectedIndex = selectedIndex;
          // model[`${prop}-option`] = selectedIndex;
          if (selectedIndex > -1) {
            let defa = config.oneOf[selectedIndex].defaultModel;
            defa[`${prop}-option`] = selectedIndex;
            model[prop] = defa;
          } else {
            model[prop] = {};
          }
        } else if (
          (config.type === "object" && !config.properties && !config.oneOf) ||
          config.additionalProperties
        ) {
          let properties = {};
          let w = "calc(50% - 40px)";
          if (config.additionalProperties) {
            if (config.additionalProperties.type === "object") {
              properties = {
                key: {
                  type: "string",
                  title: "键",
                  description: '{"title":"key"}',
                  "ui:options": {
                    width: w
                  }
                },
                ...config.additionalProperties.properties
              };
            } else if (config.additionalProperties.type === "string") {
              properties = {
                key: {
                  type: "string",
                  title: "键",
                  "ui:options": {
                    width: w
                  }
                },
                value: {
                  type: "string",
                  title: "值",
                  "ui:options": {
                    width: w
                  }
                }
              };
            }
          } else {
            properties = {
              key: {
                type: "string",
                title: "键",
                "ui:options": {
                  width: w
                }
              },
              value: {
                type: "string",
                title: "值",
                "ui:options": {
                  width: w
                }
              }
            };
          }
          config.type = "array";
          config.items = {
            type: "object",
            properties
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
                  ...defaultValue[k]
                };
              }
              return {
                key: k,
                value: defaultValue[k]
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

          if (prop.indexOf(".") > -1) {
            model[prop] = defaultValue || _value || [];
          }
          // throw new Error(`类型为object的属性${parentProp}没有properties配置`);
        }
        // else {

        //   set(rules, parentProp ? parentProp + "." + prop : prop, baseRule);
        // }
        // }
      });
      return model;
    },
    validateScheme() {
      if (!this.currentScheme) {
        throw new Error("请配置schema");
      }
      // 解析 shceme
      // let props = Object.keys(this.currentScheme.properties);
      // let model = {}; // 准备model
      let rules = {}; //  准备rules
      let model = this.setModel(this.currentScheme, rules);
      console.log(model);
      this.currentModel = model;
    }
  }
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
    line-height: 1.5;
    vertical-align: middle;
  }
}
</style>
