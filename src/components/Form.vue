<template>
  <div v-if="Object.keys(currentModel).length" class="vue-form" v-show="show">
    <el-form
      size="medium"
      :model="currentModel"
      :ref="formId"
      :rules="rules"
      :label-width="schema.labelWidth || '100px'"
    >
      <!-- <template v-if="scheme.layout">
        <el-row :gutter="scheme.layout.gutter||20" v-for="row in rowSize" :key="row">
           <el-col v-for=""></el-col>
        </el-row>
      </template>-->
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
        <el-button
          type="primary"
          size="mini"
          @click="confirm"
          v-show="schema.buttons.includes('confirm')"
          >确定</el-button
        >
        <el-button
          type="default"
          size="mini"
          @click="reset"
          v-show="schema.buttons.includes('reset')"
          >重置</el-button
        >
      </div>
    </el-form>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
const letters = "abcdefghijklmn".split("");
const { set, get } = require("lodash");
// import util from "element-ui/lib/utils/date.js";
import FormItemPlugin from "./FormItem.vue";
const util = require("element-ui/lib/utils/date.js");

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
    }
  },

  mounted() {
    this.validateScheme();
    this.setSortProperties();
  },
  computed: {
    // prop_name: {
    //   get() {
    //     return get(this.currentModel, "prop.name");
    //   },
    //   set(value) {
    //     set(this.currentModel, "prop.name", value);
    //   }
    // },
    rowSize() {
      return !this.schema.layout
        ? 1
        : Math.ceil(
            Object.keys(this.currentModel).length /
              (24 / (this.schema.layout.span || 8))
          );
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
      let obj = {
        ...this.currentModel
      };
      let result = {};
      Object.keys(obj).forEach((el) => {
        let value = obj[el];
        if (value instanceof Date) {
          result[el] = util.format(value, "yyyy-MM-dd");
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
          let v = JSON.parse(JSON.stringify(obj[el]));
          let value = {};
          v.forEach((els) => {
            if (els.key) {
              value[els.key] = els.value;
            }
          });
          result[el] = value;
        });
      }
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
                model[el] = util.format(value, "yyyy-MM-dd");
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
        _value.push("");
      }
      if (items.type === "boolean") {
        _value.push(true);
      } else if (items.type === "number" || items.type === "integer") {
        _value.push(0);
      } else if (items.type === "object") {
        let obj = this.setModel(items, {}, parentProp);
        _value.push(obj);
      }
      if (currentScheme.minItems > 1) {
        for (let j = 0; j < currentScheme.minItems - 1; j++) {
          _value.push(_value[0]);
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
        let defaultValue = this.model[el] || config.defaultValue || config.default;
        if (this.model[el] === false || this.model[el] === 0) {
          defaultValue = this.model[el]
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
            let childrenProps = Object.keys(config.children);
            childrenProps.forEach((childrenProp) => {
              let childrenConfig = config.children[childrenProp];
              let childrenDefaultValue =
                this.model[childrenProp] ||
                childrenConfig.defaultValue ||
                childrenConfig.default;
              let _childrenValue = this.setArrayModal(
                childrenConfig,
                rules,
                childrenProp
              );
              set(
                model,
                childrenProp,
                childrenDefaultValue || _childrenValue || ""
              );
              if (childrenProp.indexOf(".") > -1) {
                model[childrenProp] =
                  childrenDefaultValue || _childrenValue || "";
              }
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
            Object.keys(config.children).forEach((parentProp) => {
              let childrenProps = Object.keys(config.children[parentProp]);
              childrenProps.forEach((childrenProp) => {
                let childrenConfig = config.children[parentProp][childrenProp];
                let childrenDefaultValue =
                  this.model[childrenProp] ||
                  childrenConfig.defaultValue ||
                  childrenConfig.default;
                set(model, childrenProp, childrenDefaultValue || "");
                if (childrenProp.indexOf(".") > -1) {
                  model[childrenProp] = childrenDefaultValue;
                }
              });
            });
          }
        }
        if (config.type === "object" && config.properties) {
          // model.prop =
          model[prop] = this.setModel(config, rules, prop);
        } else if (config.type === "object" && !config.properties) {
          // debugger;
          // currentScheme.type = "array";
          this.special.push(prop);
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
        } else {
          let ruleType = {
            checkbox: "array",
            array: "array",
            number: "number",
            integer: "number",
            date: "date",
            switch: "boolean",
            boolean: "boolean"
          };
          if (config.type !== "array") {
            let required_ = config.minLength || config.maxLength || config.enum;
            //  || config.pattern;
            let text = config.enum || config.options ? "请选择" : "请输入";
            let baseRule = [
              {
                required: required_
                  ? true
                  : required
                  ? required.includes(prop)
                  : false,

                type: ruleType[config.type] || "string",
                message: config.description || `${text}${config.title || prop}`
              }
            ];

            // 更多校验规则
            if (config.minLength || config.maxLength) {
              let ruleMinlength = {
                min: config.minLength || 1,
                message: "长度至少" + (config.minLength || 1),
                trigger: "blur"
              };
              if (config.maxlength) {
                ruleMinlength["max"] = config.maxLength;
                ruleMinlength["message"] =
                  "长度在" +
                  (config.minLength || 1) +
                  "和" +
                  config.maxLength +
                  "之间";
              }
              baseRule.push(ruleMinlength);
            }
            if (config.pattern) {
              baseRule.push({
                pattern: new RegExp(config.pattern),
                message: `格式需要满足正则${config.pattern}`,
                trigger: "blur"
              });
            }
            set(rules, parentProp ? parentProp + "." + prop : prop, baseRule);
          }
        }
      });
      return model;
    },
    validateScheme() {
      if (!this.currentScheme) {
        throw new Error("请配置schema");
      }
      // 解析 shceme
      const { properties, required } = this.currentScheme;
      let props = Object.keys(properties);
      let model = {}; // 准备model
      let rules = {}; //  准备rules
      model = this.setModel(this.currentScheme, rules);
      console.log(this.currentScheme);
      this.rules = rules;
      this.currentModel = model;
      // console.log(rules);
      // console.log(model);
    }
  }
};
</script>
<style lang="less">
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
