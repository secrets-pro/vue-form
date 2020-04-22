<script>
// import { set } from "lodash";
/* eslint-disable no-unused-vars */

export default {
  name: "vue-form-item",
  props: {
    value: [String, Number, Boolean, Array, Date, Object],
    config: Object,
    prop: String,
  },
  watch: {
    value(n) {
      this.currentValue = n;
    },
  },
  data() {
    return {
      currentValue: this.value,
    };
  },
  methods: {
    renderSelectOptions(h, options, groups) {
      if (groups) {
        return options.map((el) => {
          return h(
            "el-option-group",
            {
              props: {
                label: el.label,
              },
            },
            el.options.map((op) => {
              return h(`el-option`, {
                props: {
                  label: op.label,
                  value: op.value,
                },
              });
            })
          );
        });
      }
      return options.map((el) => {
        return h(`el-option`, {
          props: {
            label: el.label,
            value: el.value,
          },
        });
      });
    },
    renderRadioCheckbox(h, type, options) {
      return options.map((el) => {
        return h(
          `el-${type}`,
          {
            props: {
              label: el.value,
            },
          },
          el.label
        );
      });
    },
    renderObject(h, config, prop, model) {
      return h(
        "div",
        {
          style: {
            display: "flex",
          },
        },
        [
          prop.indexOf(".") > -1
            ? null
            : h(
                "div",
                {
                  class: ["el-form-item__label"],
                  style: {
                    width: "100px",
                  },
                },
                config.title
              ),
          h(
            "div",
            {
              style: {
                flex: 1,
                display: prop.indexOf(".") > -1 ? "flex" : "initial",
              },
            },
            Object.keys(model).map((el) => {
              return h("vue-form-item", {
                props: {
                  prop: `${this.prop}.${el}`,
                  value: model[el],
                  config: config.properties[el],
                },
                on: {
                  input: (value) => {
                    model[el] = value;
                  },
                },
              });
            })
          ),
        ]
      );
    },
    renderArray(h, config, prop, model) {
      const { items } = config;
      let { type } = items;
      let that = this;
      let children =
        type === "object"
          ? model.map((el, index) => {
              // model是当前构造出来的数组对象 el就是子项 如果el不是object类型

              return h("div", {}, [
                this.renderFun(h, items, `${prop}.${index}`, model[index]),
              ]);
            })
          : model.map((el, index) => {
              // model是当前构造出来的数组对象 el就是子项 如果el不是object类型
              return h("div", {}, [
                this.renderFun(h, items, `${prop}.${index}`, model, index),
              ]);
            });

      return h(
        "div",
        {
          style: {
            display: "flex",
          },
        },
        [
          h(
            "div",
            {
              class: ["el-form-item__label"],
              style: {
                width: "100px",
              },
            },
            config.title || prop
          ),
          h(
            "div",
            {
              style: {
                flex: 1,
                // display: "flex",
              },
            },
            [
              ...children,
              h(
                "div",
                {
                  style: {
                    textAlign: "right",
                  },
                },
                [
                  h(
                    "el-button",
                    {
                      props: {
                        type: "primary",
                        size: "small",
                      },
                      on: {
                        click: () => {
                          const { minItems, maxItems } = config;
                          if (maxItems && model.length >= maxItems) {
                            console.warn(`最大数量限制为${maxItems}`);
                            return;
                          }
                          let zore = model[0];
                          if (typeof zore === "object") {
                            let keys = Object.keys(model[0]);
                            let obj = {};
                            keys.forEach((els) => {
                              obj[els] = "";
                            });
                            model.push(obj);
                          } else if (
                            typeof zore === "string" ||
                            typeof zore === "number"
                          ) {
                            model.push("");
                          }
                        },
                      },
                    },
                    "新增"
                  ),
                ]
              ),
            ]
          ),
        ]
      );
    },
    renderFun(h, config, prop, currentValue, _arrayIndex) {
      let type = config.type;
      let props = {
        value:
          _arrayIndex !== undefined ? currentValue[_arrayIndex] : currentValue,
      };
      if (config.maxLength) {
        props.maxLength = config.maxLength;
      }
      if (config.anyOf) {
        // TODO 可能不是enum
        type = "select";
        config.groups = true;
        config.options = config.anyOf.map((el) => {
          return {
            label: el.description,
            options: el.enum.map((ele) => ({ label: ele, value: ele })),
          };
        });
      }
      let children = [];

      if (type === "radio" || type === "checkbox") {
        type = `${type}-group`;
        children = this.renderRadioCheckbox(h, config.type, config.options);
      } else if (type === "date") {
        type = "date-picker";
        props.placeholder = "请选择日期";
        props.type = "date";
        props.format = config.format || "yyyy-MM-dd";
      } else if (type === "number" || type === "integer") {
        props["controls-position"] = "right";
        if (type === "integer") {
          props["step-strictly"] = true;
          props["step"] = 1;
        }
        debugger;
        if (config.minimum) {
          props["min"] = config.minimum;
        }
        if (config.maximum) {
          props["min"] = config.maximum;
        }
        type = "input-number";
      } else if (type === "select" || config.enum) {
        if (config.enum) {
          config.options = config.enum.map((el) => {
            return {
              label: el,
              value: el,
            };
          });
        }

        children = this.renderSelectOptions(h, config.options, config.groups);
        type = "select";
      } else if (type === "string") {
        type = "input";
      } else if (type === "boolean") {
        type = "switch";
      }
      if (type === "array") {
        return this.renderArray(h, config, prop, currentValue);
      } else if (type === "object") {
        return this.renderObject(h, config, prop, currentValue);
      }
      return h(
        "el-form-item",
        {
          props: {
            prop: prop,
            label: config.title || prop,
          },
        },
        [
          h(
            `el-${type}`,
            {
              props,
              on: {
                input: (value) => {
                  if (_arrayIndex !== undefined) {
                    currentValue[_arrayIndex] = value;
                    this.$emit("arrayInput", prop, currentValue[_arrayIndex]);
                  } else {
                    this.$emit("input", value);
                  }
                },
              },
            },
            children
          ),
        ]
      );
    },
  },
  render(h) {
    return this.renderFun(h, this.config, this.prop, this.currentValue);
  },
};
</script>
