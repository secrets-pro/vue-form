<template>
  <div v-if="Object.keys(currentModel).length">
    <el-form
      size="medium"
      :model="currentModel"
      :ref="formId"
      :rules="rules"
      :label-width="schema.labelWidth || '120px'"
    >
      <!-- <template v-if="scheme.layout">
        <el-row :gutter="scheme.layout.gutter||20" v-for="row in rowSize" :key="row">
           <el-col v-for=""></el-col>
        </el-row>
      </template>-->
      <template v-for="(prop, key) in this.currentScheme.properties">
        <form-item-plugin
          v-model="currentModel[key]"
          :config="prop"
          :prop="key"
          :key="key"
          @arrayInput="input"
        ></form-item-plugin>
      </template>
      <div style="text-align:right;padding-right:12px;" v-if="schema.buttons">
        <el-button
          type="primary"
          size="mini"
          @click="confirm"
          v-show="schema.buttons.includes('confirm')"
        >确定</el-button>
        <el-button
          type="default"
          size="mini"
          @click="reset"
          v-show="schema.buttons.includes('reset')"
        >重置</el-button>
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
  name: "vue-form",
  props: {
    schema: Object,
    model: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  mounted() {
    this.validateScheme();
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
    }
  },
  data() {
    return {
      currentScheme: this.schema,
      currentModel: {},
      formId: this.randomId(),

      rules: {},
      special: []
    };
  },
  methods: {
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
      Object.keys(obj).forEach(el => {
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
        this.special.forEach(el => {
          let v = JSON.parse(JSON.stringify(obj[el]));
          let value = {};
          v.forEach(els => {
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
        .map(el => letters[el])
        .join("");
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs[this.formId].validate(el => {
          if (el) {
            let model = this.getData();
            Object.keys(model).forEach(el => {
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
      props.forEach(el => {
        let prop = el;
        let config = properties[el];
        let defaultValue =
          this.model[el] || config.defaultValue || config.default;

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
          model[prop] = !!defaultValue;
        } else {
          // model[prop] = defaultValue || null;
          set(model, prop, defaultValue || "");
          if (prop.indexOf(".") > -1) {
            model[prop] = defaultValue;
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
            let value = Object.keys(defaultValue).map(k => ({
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
      this.rules = rules;
      this.currentModel = model;
      // console.log(rules);
      // console.log(model);
    }
  }
};
</script>
<style lang="less">
.el-form-item__content {
  .el-select,
  .el-input-number {
    width: 100%;
  }
}
</style>
