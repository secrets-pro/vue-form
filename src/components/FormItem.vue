<script>
// import { set } from "lodash";
/* eslint-disable no-unused-vars */

export default {
  name: "vue-form-item",
  props: {
    value: [String, Number, Boolean, Array, Date, Object],
    config: Object,
    prop: String
  },
  watch: {
    value(n) {
      this.currentValue = n;
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  methods: {
    renderSelectOptions(h, options) {
      return options.map(el => {
        return h(`el-option`, {
          props: {
            label: el.value,
            value: el.value
          }
        });
      });
    },
    renderRadioCheckbox(h, type, options) {
      return options.map(el => {
        return h(
          `el-${type}`,
          {
            props: {
              label: el.value
            }
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
            display: "flex"
          }
        },
        [
          h(
            "div",
            {
              class: ["el-form-item__label"],
              style: {
                width: "100px"
              }
            },
            config.title
          ),
          h(
            "div",
            {
              style: {
                flex: 1
              }
            },
            Object.keys(model).map(el => {
              return h("vue-form-item", {
                props: {
                  prop: `${this.prop}.${el}`,
                  value: model[el],
                  config: config.properties[el]
                },
                on: {
                  input: value => {
                    model[el] = value;
                  }
                }
              });
            })
          )
        ]
      );
    },
    renderArray(h, config, prop, model) {
      const { items } = config;
      let { type } = items;
      return h(
        "div",
        {
          style: {
            display: "flex"
          }
        },
        [
          h(
            "div",
            {
              class: ["el-form-item__label"],
              style: {
                width: "100px"
              }
            },
            config.title
          ),
          h(
            "div",
            {
              style: {
                flex: 1
              }
            },
            model.map((el, index) => {
              return h(
                "div",
                {
                  style: {
                    display: "flex"
                  }
                },
                [
                  Object.keys(el).map(ch => {
                    return h("vue-form-item", {
                      props: {
                        prop: `${prop}.${index}.${ch}`,
                        value: model[index][ch],
                        config: config.properties[ch]
                      },
                      on: {
                        input: value => {
                          model[index][ch] = value;
                        }
                      }
                    });
                  })
                ]
              );
            })
          )
        ]
      );
    },
    renderFun(h, config, prop, currentValue) {
      let type = config.type;
      let props = {
        value: currentValue
      };
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
        type = "input-number";
        props["controls-position"] = "right";
        props["precision"] = type === "integer" ? 0 : 2;
      } else if (type === "select") {
        children = this.renderSelectOptions(h, config.options);
      } else if (type === "string") {
        type = "input";
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
            label: config.title || prop
          }
        },
        [
          h(
            `el-${type}`,
            {
              props,
              on: {
                input: value => {
                  this.$emit("input", value);
                }
              }
            },
            children
          )
        ]
      );
    }
  },
  render(h) {
    return this.renderFun(h, this.config, this.prop, this.currentValue);
  }
};
</script>
