<template>
  <div v-if="Object.keys(currentModel).length" class="vue-form" v-show="show">
    <component
      :is="`${this.prefix}-form`"
      size="medium"
      :model="currentModel"
      :ref="formId"
      :label-width="
        (this.prefix === 'el' ? schema.labelWidth + 'px' : schema.labelWidth) ||
          this.defaultWidth
      "
    >
      <template v-for="prop in propertiesSorted">
        <form-item-plugin
          v-model="currentModel[prop.name]"
          :config="prop"
          :prop="prop.name"
          :key="prop.name"
          @arrayInput="input"
        ></form-item-plugin>
        <!-- 下拉选项，选择不同的值，渲染不同的子字段 -->
        <div
          v-if="
            prop.enum && prop.children && prop.children[currentModel[prop.name]]
          "
          :key="'children' + prop.name"
        >
          <div
            v-for="childrenProp in prop.children[currentModel[prop.name]]"
            :key="childrenProp.name"
          >
            <form-item-plugin
              v-model="currentModel[childrenProp.name]"
              :config="childrenProp"
              :prop="childrenProp.name"
              :key="childrenProp.name"
              @arrayInput="input"
            ></form-item-plugin>
          </div>
        </div>
        <!-- 布尔类型，为true渲染子字段 -->
        <div
          v-if="
            prop.type === 'boolean' && prop.children && currentModel[prop.name]
          "
          :key="'children' + prop.name"
        >
          <div
            v-for="(childrenProp, childrenKey) in prop.children"
            :key="childrenKey"
          >
            <form-item-plugin
              v-model="currentModel[childrenKey]"
              :config="childrenProp"
              :prop="childrenKey"
              :key="childrenKey"
              @arrayInput="input"
            ></form-item-plugin>
          </div>
        </div>
      </template>
      <div style="text-align:right;padding-right:12px;" v-if="schema.buttons">
        <component
          :is="`${this.prefix}-button`"
          type="primary"
          size="mini"
          @click="confirm"
          v-show="schema.buttons.includes('confirm')"
          >确定</component
        >
        <component
          :is="`${this.prefix}-button`"
          type="default"
          size="mini"
          @click="reset"
          v-show="schema.buttons.includes('reset')"
          >重置</component
        >
      </div>
    </component>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
const letters = "abcdefghijklmn".split("");
import { set, get, difference } from "lodash";
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
    }
  },

  created() {
    this.validateScheme();
    this.setSortProperties();
  },
  computed: {
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
      this.validateScheme();
      this.setSortProperties();
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
      defaultWidth: this.prefix === "el" ? "100px" : 100,
      currentScheme: this.schema,
      currentModel: {},
      formId: this.randomId(),
      // 默认状态为show的初始值
      visiableStatus: this.show,
      rules: {},
      special: [],
      once: false,
      propertiesSorted: []
    };
  },
  methods: {
    setSortProperties() {
      let properties = this.currentScheme.properties
        ? JSON.parse(JSON.stringify(this.currentScheme.properties))
        : {};
      // 对最外层properties进行排序（position越小排前面）
      let propertiesSorted = Object.keys(properties)
        .sort((a, b) => properties[a].position - properties[b].position)
        .map((el) => ({
          name: el,
          ...properties[el]
        }));

      // 父子段为下拉选项，根据父子段的值渲染不同的子字段，同样需要对其子字段根据position排序
      propertiesSorted.forEach((el) => {
        if (el.enum && el.children && Object.keys(el.children).length) {
          Object.keys(el.children).forEach((key) => {
            let childrenProperties = el.children[key];
            let childrenPropertiesSorted = Object.keys(childrenProperties)
              .sort(
                (a, b) =>
                  childrenProperties[a].position -
                  childrenProperties[b].position
              )
              .map((childrenPropertiesName) => ({
                name: childrenPropertiesName,
                ...childrenProperties[childrenPropertiesName]
              }));
            el.children[key] = JSON.parse(
              JSON.stringify(childrenPropertiesSorted)
            );
          });
        }
      });
      this.propertiesSorted = JSON.parse(JSON.stringify(propertiesSorted));
    },
    // FIXME  优化
    input(key, value) {
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
          let v = JSON.parse(JSON.stringify(get(obj, el)));
          let value = {};
          v.forEach((els) => {
            if (els.key) {
              value[els.key] = els.value;
            }
          });
          // debugger;
          // result[el] = value;
          set(result, el, value);
        });
      }
      result = this.removeOneOfOption(result);
      return result;
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
          if (el) {
            let model = this.getData();
            Object.keys(model).forEach((el) => {
              let value = model[el];
              if (value instanceof Date) {
                model[el] = formatDate(value, "yyyy-MM-dd");
              }
              if (el.indexOf(".") > -1) {
                delete model[el];
              }
            });
            this.$emit("on-confirm", model);
            resolve(model);
          } else {
            resolve(null);
          }
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
      let model = {};
      let props = Object.keys(properties);
      props.forEach((el) => {
        let prop = el;
        let config = properties[el];
        if (required && required.includes(prop)) {
          config.required = true;
        }
        let defaultValue = get(
          this.model,
          parentProp ? parentProp + "." + el : el,
          config.defaultValue || config.default
        );
        let d = get(this.model, parentProp ? parentProp + "." + el : el);
        if (d === false || d === 0) {
          defaultValue = d;
        }

        if (config.type === "checkbox") {
          // model[prop] = defaultValue || [];
          set(model, prop, defaultValue || []);
          if (prop.indexOf(".") > -1) {
            model[prop] = defaultValue || [];
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
          config.oneOf.forEach((oneOfItem) => {
            const oneOfItemMoel = this.setModel(oneOfItem, {});
            oneOfItem.defaultModel = oneOfItemMoel;
            configOneOfModelArray.push(oneOfItemMoel);
          });
          let selectedIndex = 0;
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
            config.oneOf[selectedIndex].defaultModel = defaultValue;
          }
          config.selectedIndex = selectedIndex;
          model[`${prop}-option`] = selectedIndex;
          model[prop] = config.oneOf[selectedIndex].defaultModel;
        } else if (
          config.type === "object" &&
          !config.properties &&
          !config.oneOf
        ) {
          // debugger;
          // currentScheme.type = "array";
          this.special.push(parentProp ? parentProp + "." + prop : prop);
          let properties = {
            key: {
              type: "string",
              title: "键"
            },
            value: {
              type: "string",
              title: "值"
            }
          };
          config.type = "array";
          config.items = {
            type: "object",
            properties
          };
          let _value = this.setArrayModal(config, rules, prop);
          if (defaultValue && !Array.isArray(defaultValue)) {
            let value = Object.keys(defaultValue).map((k) => ({
              key: k,
              value: defaultValue[k]
            }));
            set(model, prop, value || _value || []);
          } else {
            set(model, prop, defaultValue || _value || []);
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
      this.currentModel = model;
    }
  }
};
</script>
<style lang="less">
// class  看 iview 和 element-ui的名称
.vue-form {
  .ivu-form-item__content {
    .ivu-select,
    .ivu-input-number {
      width: 100%;
    }
  }
  .ivu-form-item-label {
    word-break: break-all;
  }
  .ivu-btn + .ivu-btn {
    margin-left: 10px;
  }
}
.vue-form {
  .el-form-item__content {
    .el-select,
    .el-input-number {
      width: 100%;
    }
  }
  .el-form-item__label {
    word-break: break-all;
  }
}
</style>
