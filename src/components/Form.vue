<template>
  <div v-if="Object.keys(currentModel).length">
    <el-form
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
      <template v-for="(prop, key) in this.currentScheme.properties">
        <form-item-plugin
          v-model="currentModel[key]"
          :config="prop"
          :prop="key"
          :key="key"
        ></form-item-plugin>
      </template>
      <div style="text-align:right;padding-right:12px;" v-if="schema.buttons">
        <el-button
          type="success"
          @click="confirm"
          v-show="schema.buttons.includes('confirm')"
          >确定</el-button
        >
        <el-button
          type="default"
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
import { set, get } from "lodash";
import util from "element-ui/lib/utils/date.js";
import FormItemPlugin from "./FormItem";
export default {
  components: { "form-item-plugin": FormItemPlugin },
  name: "vue-form",
  props: {
    schema: Object,
    model: {
      type: Object,
      default() {
        return {};
      },
    },
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
    },
  },
  watch: {
    schema(n) {
      this.currentScheme = n;
      this.validateScheme();
    },
  },
  data() {
    return {
      currentScheme: this.schema,
      currentModel: {},
      formId: this.randomId(),

      rules: {},
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
        set(obj, lastKey, value);
      } else {
        set(this.currentModel, key, value);
      }
    },
    getData() {
      return {
        ...this.currentModel,
      };
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
            let model = { ...this.currentModel };
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
    setModel(currentScheme, rules, parentProp) {
      const { properties, required } = currentScheme;
      let model = {};
      let props = Object.keys(properties);
      props.forEach((el) => {
        let prop = el;
        let config = properties[el];
        let defaultValue = this.model[el] || config.defaultValue;

        if (config.type === "checkbox") {
          // model[prop] = defaultValue || [];
          set(model, prop, defaultValue || []);
          if (prop.indexOf(".") > -1) {
            model[prop] = defaultValue || [];
          }
        } else {
          // model[prop] = defaultValue || null;
          set(model, prop, defaultValue || null);
          if (prop.indexOf(".") > -1) {
            model[prop] = defaultValue;
          }
        }
        if (config.type === "object") {
          // model.prop =
          model[prop] = this.setModel(config, rules, prop);
        } else {
          let ruleType = {
            checkbox: "array",
            number: "number",
            date: "date",
            switch: "boolean",
          };
          let baseRule = [
            {
              required: required ? required.includes(prop) : false,
              type: ruleType[config.type] || "string",
              message: config.description || `请输入${config.title || prop}`,
            },
          ];
          // 更多校验规则
          this.$set(
            rules,
            parentProp ? parentProp + "." + prop : prop,
            baseRule
          );
        }
      });
      return model;
    },
    validateScheme() {
      if (!this.currentScheme) {
        throw new Error("请配置scheme");
      }
      // 解析 shceme
      const { properties, required } = this.currentScheme;
      let props = Object.keys(properties);
      let model = {}; // 准备model
      let rules = {}; //  准备rules
      model = this.setModel(this.currentScheme, rules);
      this.rules = rules;
      this.currentModel = model;
      console.log(model, rules);
    },
  },
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
