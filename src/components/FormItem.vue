<script>
/* eslint-disable no-unused-vars */
const MonacoEditor = require("vue-monaco");
import setting from "../config";

export default {
  name: "vue-form-item",
  inject: ["Form"],
  components: {
    "el-editor": MonacoEditor.default
  },
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
    renderSelectOptions(h, options, groups) {
      if (groups) {
        return options.map((el) => {
          return h(
            "el-option-group",
            {
              props: {
                label: el.label
              }
            },
            el.options.map((op) => {
              return h(`el-option`, {
                props: {
                  label: op.label,
                  value: op.value
                }
              });
            })
          );
        });
      }
      return options.map((el) => {
        return h(`el-option`, {
          props: {
            label: el.label,
            value: el.value
          }
        });
      });
    },
    renderRadioCheckbox(h, type, options) {
      return options.map((el) => {
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
          prop.indexOf(".") > -1
            ? null
            : h(
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
                flex: 1,
                display: prop.indexOf(".") > -1 ? "flex" : "initial"
              }
            },
            Object.keys(model).map((el) => {
              return h("vue-form-item", {
                props: {
                  prop: `${this.prop}.${el}`,
                  value: model[el],
                  config: config.properties[el]
                },
                on: {
                  input: (value) => {
                    model[el] = value;
                  }
                }
              });
            })
          )
        ]
      );
    },
    renderArrayButton(h, config, model, title) {
      return h(
        "div",
        {
          style: {
            textAlign: "right"
          }
        },
        [
          h(
            "el-button",
            {
              props: {
                type: "primary",
                size: "small"
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
                }
              }
            },
            `新增${title}`
          )
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
                this.renderFun(h, items, `${prop}.${index}`, model[index])
              ]);
            })
          : model.map((el, index) => {
              // model是当前构造出来的数组对象 el就是子项 如果el不是object类型
              return h("div", {}, [
                this.renderFun(h, items, `${prop}.${index}`, model, index)
              ]);
            });

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
            config.title || prop
          ),
          h(
            "div",
            {
              style: {
                flex: 1
              }
            },
            [
              ...children,
              this.renderArrayButton(h, config, model, config.title || prop)
            ]
          )
        ]
      );
    },
    renderFun(h, config, prop, currentValue, _arrayIndex) {
      let type = config.type;
      let style = {};
      let props = {
        value:
          _arrayIndex !== undefined ? currentValue[_arrayIndex] : currentValue
      };
      if (config.maxLength) {
        props.maxlength = config.maxLength;
      }
      if (config.minLength) {
        props.minlength = config.minLength;
      }
      if (config.anyOf) {
        // TODO 可能不是enum
        type = "select";
        config.groups = true;
        config.options = config.anyOf.map((el) => {
          return {
            label: el.description,
            options: el.enum.map((ele) => ({ label: ele, value: ele }))
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
        props.format = config.format || setting.format;
      } else if (type === "number" || type === "integer") {
        props["controls-position"] = "right";
        if (type === "integer") {
          props["step-strictly"] = true;
          props["step"] = 1;
        }
        if (config.minimum !== undefined) {
          props["min"] = config.minimum;
        }
        if (config.maximum !== undefined) {
          props["max"] = config.maximum;
        }
        type = "input-number";
      } else if (type === "select" || config.enum) {
        if (config.enum) {
          config.options = config.enum.map((el) => {
            return {
              label: el,
              value: el
            };
          });
        }

        children = this.renderSelectOptions(h, config.options, config.groups);
        type = "select";
      } else if (type === "string") {
        type = "input";
      } else if (type === "boolean") {
        type = "switch";
      } else if (type === "editor") {
        //  theme="vs-dark"
        // v-model="code"
        // language="javascript"
        props.theme = "vs-dark";
        props.language = config.language || setting.language;
        props.options = {
          cursorStyle: "line", // 光标样式
          automaticLayout: true, // 自动布局
          formatOnPaste: true,
          formatOnType: true,
          automaticLayout: true
        };
        style.automaticLayout = true;
        style.width = "100%";
        style.height = "400px";
        style.minHeight = "400px";
        style.minWidth = "400px";
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
              style,
              on: {
                change: (value) => {
                  if (type === "editor") {
                    this.$emit("input", value);
                  }
                },
                editorDidMount: (editor) => {
                  console.log("editorDidMount", editor);
                  editor.layout();
                },
                input: (value) => {
                  if (_arrayIndex !== undefined) {
                    currentValue[_arrayIndex] = value;
                    this.$emit("arrayInput", prop, currentValue[_arrayIndex]);
                  } else {
                    this.$emit("input", value);
                  }
                }
              }
            },
            children
          ),
          this.renderLabel(config.title || prop, config.description),
        ]
      );
    },
    renderLabel(title, description) {
      return (
        <span slot="label">
          <span>{title}</span>
          {description ? (
            <el-tooltip
              class="item"
              effect="dark"
              placement="top"
            >
              <span slot="content" style={{ whiteSpace: 'pre' }}>{ description }</span>
              <el-button
                icon="el-icon-info"
                style={{ padding: 0, border: 0, color: "#409eff" }}
              ></el-button>
            </el-tooltip>
          ) : null}
        </span>
      );
    }
  },
  render(h) {
    if (this.Form.visiableStatus) {
      return this.renderFun(h, this.config, this.prop, this.currentValue);
    }
    return null;
  }
};
</script>
