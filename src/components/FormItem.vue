<script>
/* eslint-disable no-unused-vars */
import setting from "../config";
import styleCfg from "../styleCfg";
const { extraOptions, generateRule } = setting;
function formatUrl(url, params) {
  if (params) {
    for (let k in params) {
      url = url.replace(new RegExp("\\{" + k + "\\}", "g"), params[k]);
    }
  }
  return url;
}
export default {
  name: "vue-form-item",
  inject: ["Form"],

  props: {
    value: [String, Number, Boolean, Array, Date, Object],
    config: Object,
    prop: String
  },
  watch: {
    value(n) {
      // console.log(`watch currentValue `, this.currentValue);
      this.currentValue = n;
    }
    // config(n) {
    //   console.log(`watch config `, n);
    // }
  },
  computed: {
    prefix() {
      return !setting.options.iView ? "el" : "i";
    },
    readonly() {
      return this.Form.readonly;
    }
  },
  data() {
    return {
      currentValue: this.value,
      requests: {}
    };
  },
  methods: {
    renderSelectOptions(h, options = [], groups) {
      if (groups) {
        return options.map((el) => {
          return h(
            `${this.prefix}-option-group`,
            {
              props: {
                label: el.label
              }
            },
            el.options.map((op) => {
              // 检查 options
              return h(`${this.prefix}-option`, {
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
        return h(`${this.prefix}-option`, {
          props: {
            label: el.label,
            value: el.value
          }
        });
      });
    },
    renderRadioCheckbox(h, type, options = []) {
      // option [{ label: "类型1", value: "type1"}] ==> option[1.2] enum[1,2] enumNames["xx","yyy"]
      return options.map((el) => {
        return h(
          `${this.prefix}-${type}`,
          {
            props: {
              label: el.value
            }
          },
          el.label
        );
      });
    },
    renderObject(h, config, prop, model, slot) {
      console.log(` config.properties `, config.properties);
      // 渲染对象，根据字段的position进行排序，position越小排前面
      let modelKeysSorted = Object.keys(model).sort((a, b) => {
        let pa = extraOptions(config.properties[a].description);
        let pb = extraOptions(config.properties[b].description);
        if (a.includes("-option")) {
          return -1;
        }

        return pa.index - pb.index;
      });
      return h(
        "div",
        {
          class: ["item-object"],
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
                  class: [
                    this.prefix == "i"
                      ? "ivu-form-item-label"
                      : "el-form-item__label"
                  ],
                  style: {
                    width: styleCfg.titleWidth
                  }
                },
                extraOptions(config.description).title || config.title
              ),
          h(
            "div",
            {
              class: ["flex-object"],
              style: {
                flex: 1,
                flexWrap: "wrap",
                display: prop.indexOf(".") > -1 ? "flex" : "initial"
              }
            },
            [
              ...modelKeysSorted.map((el) => {
                let configResult = config.properties[el];
                // if (el.includes("-option")) {
                //   //  oneOf 才会有的属性  基础属性路径b-option
                //   // 是oneof选项
                //   const oneOfName = el.split("-")[0];
                //   configResult = {
                //     type: "select",
                //     title: "类型选择",
                //     options: config.properties[oneOfName].oneOf.map(
                //       (oneOfItem, index) => ({
                //         label: oneOfItem.description,
                //         value: index
                //       })
                //     )
                //   };
                // }
                // console.log(`config`, config);
                return h("vue-form-item", {
                  props: {
                    prop: `${prop}.${el}`,
                    value: model[el],
                    config: configResult
                  },
                  on: {
                    input: (value) => {
                      model[el] = value;
                      // oneof选项变化
                      if (el.includes("-option")) {
                        // debugger;
                        // let __prop__ = el.split("-")[0];

                        // model[el] = value;
                        // debugger;
                        model = config.oneOf[value].defaultModel;
                        model[el] = value;
                        this.currentValue = model;
                        this.$emit("input", this.currentValue);
                        // console.log(`update:config`, this.config, config);
                        this.config.selectedIndex = value;
                        this.config.type = "object";
                        // this.$emit("update:config", config);
                        // model[__prop__] =
                        //   config.properties[__prop__].oneOf[value].defaultModel;
                      }
                    },
                    arrayInput: (key, value) => {
                      this.$emit("arrayInput", key, value);
                    }
                  }
                });
              }),
              slot
            ]
          )
        ]
      );
    },
    renderArrayButton(h, config, model, title, index, length) {
      if (this.readonly) {
        return null;
      }
      let add = h(
        `${this.prefix}-button`,
        {
          props: {
            type: "primary"
            // size: "small"
          },
          on: {
            click: () => {
              const { minItems, maxItems, item } = config;
              if (maxItems && model.length >= maxItems) {
                console.warn(`最大数量限制为${maxItems}`);
                return;
              }
              let zore = model[0] || item;
              if (typeof zore === "object") {
                //  let keys = Object.keys(zore);
                // let obj = {};
                // keys.forEach((els) => {
                //   obj[els] = "";
                // });
                model.push(JSON.parse(JSON.stringify(zore)));
              } else if (typeof zore === "string" || typeof zore === "number") {
                model.push("");
              }
            }
          }
        },
        `新增` // ${title}
      );
      let remove = h(
        `${this.prefix}-button`,
        {
          props: {
            type: this.prefix == "i" ? "error" : "danger" // error类型  判断
            // size: "small"
          },
          on: {
            click: () => {
              const { minItems } = config;
              if (minItems && model.length <= minItems) {
                console.warn(`最小数量限制为${minItems}`);
                return;
              }
              model.pop();
            }
          }
        },
        `删除` //${title}
      );
      // return index === 0 ? add : remove;
      return h(
        "div",
        {
          class: "item-button",
          style: {
            textAlign: "right",
            flex: "1"
          }
        },
        [index === 0 ? add : remove]
      );
    },
    renderArray(h, config, prop, model) {
      const { items } = config;
      let { type } = items;
      // let that = this;
      let children = [];
      if (model) {
        children =
          type === "object"
            ? model.map((el, index) => {
                // TODO model 类型
                // model是当前构造出来的数组对象 el就是子项 如果el不是object类型
                return h(
                  "div",
                  {
                    class: "flex-div"
                  },
                  [
                    this.renderFun(
                      h,
                      items,
                      `${prop}.${index}`,
                      model[index],
                      undefined,
                      this.renderArrayButton(
                        h,
                        config,
                        model,
                        extraOptions(config.description).title ||
                          config.title ||
                          prop,
                        index,
                        model.length
                      )
                    )
                  ]
                );
              })
            : model.map((el, index) => {
                // model是当前构造出来的数组对象 el就是子项 如果el不是object类型
                return h(
                  "div",
                  {
                    class: ["flex-div"]
                  },
                  [
                    this.renderFun(h, items, `${prop}.${index}`, model, index),
                    this.renderArrayButton(
                      h,
                      config,
                      model,
                      extraOptions(config.description).title ||
                        config.title ||
                        prop,
                      index,
                      model.length
                    )
                  ]
                );
              });
      }

      return h(
        "div",
        {
          class: ["form-item-array"],
          style: {
            display: "flex"
          }
        },
        [
          h(
            "div",
            {
              class: [
                this.prefix == "i"
                  ? "ivu-form-item-label"
                  : "el-form-item__label"
              ], // class判断
              style: {
                width: styleCfg.titleWidth
              }
            },
            extraOptions(config.description).title || config.title || prop
          ),
          h(
            "div",
            {
              style: {
                flex: 1
              }
            },
            [
              ...children
              // this.renderArrayButton(
              //   h,
              //   config,
              //   model,
              //   extraOptions(config.description).title || config.title || prop
              // )
            ]
          )
        ]
      );
    },
    renderFun(h, config, prop, currentValue, _arrayIndex, slot) {
      if (!config) {
        console.log(`没有参数`, config, prop);
        return;
      }
      let type = config.type;
      // 解析description

      let extra = extraOptions(config.description);
      let rules = generateRule(config, prop);
      let style = {};
      let props = {
        readonly: this.readonly,
        value:
          _arrayIndex !== undefined ? currentValue[_arrayIndex] : currentValue
      };
      // ui 配置
      let uiOptions = config["ui:options"] || extra["ui:options"];
      if (uiOptions) {
        style = Object.assign(style, uiOptions);
      }
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
      if (config.oneOf) {
        // debugger;
        let selectedIndex = config.selectedIndex; // currentValue[prop + "-option"] ||
        config = {
          //  config 临时记录 现有选择的oneOf字段
          oneOf: config.oneOf,
          ...config.oneOf[selectedIndex]
        };
        let k = prop + "-option";
        let idx = prop.lastIndexOf(".");
        if (idx > -1) {
          k = prop.substring(idx + 1) + "-option";
        }
        // console.log(`----oneof-----`, config, extra);
        config.properties[k] = {
          title: extra.title,
          type: "select",
          enum: config.oneOf.map((el, index) => index),
          enumNames: config.oneOf.map((el, index) =>
            extra.items ? extra.items[index] : `选项${index}`
          )
        };
        currentValue = config.oneOf[selectedIndex].defaultModel;
        currentValue[k] = selectedIndex;
      }
      // console.log(config);
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
        if (this.readonly) {
          type = "input";
        } else {
          type = "input-number";
        }
      } else if (type === "select" || config.enum) {
        if (config.enum) {
          config.options = config.enum.map((el, index) => {
            return {
              label: config.enumNames ? config.enumNames[index] : el,
              value: el
            };
          });
        }

        children = this.renderSelectOptions(h, config.options, config.groups);
        type = "select";
        style.width = "100%";
        props.multiple = config.multiple;
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
          formatOnType: true
        };
        // TODO  优先级
        style.width = "100%";
        style.height = "400px";
        style.minHeight = "400px";
        style.minWidth = "400px";
      }
      if (type === "array") {
        return this.renderArray(h, config, prop, currentValue);
      } else if (type === "object") {
        return this.renderObject(h, config, prop, currentValue, slot);
      }
      let labelArr =
        extra.title || config.title || (_arrayIndex > -1 ? "" : prop);
      let arr = [
        h(
          `${type === "editor" ? "my" : this.prefix}-${type}`,
          {
            props,
            style: type !== "editor" ? {} : style,
            on: {
              change: (value) => {
                if (type === "editor") {
                  this.$emit("input", value);
                }
              },
              editorDidMount: (editor) => {
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
        )
      ];
      if (labelArr) {
        arr.push(this.renderLabel(labelArr, extra.description));
      }
      let width = _arrayIndex > -1 ? 0 : styleCfg.labelWidth;
      if (this.readonly) {
        rules = undefined;
      }
      return h(
        `${this.prefix}-form-item`,
        {
          class: ["vue-form-item"],
          props: {
            prop: prop,
            labelWidth: this.prefix === "el" ? width + "px" : width,
            rules
            // label: extra.title || config.title || prop
          },
          style: type === "editor" ? {} : style
        },
        arr
      );
    },
    // 修改成render
    renderLabel(title, description) {
      // let exp = extraOptions(description);
      let Tag = this.prefix + "-tooltip";
      let ButtonTag = this.prefix + "-button";
      let icon =
        this.prefix === "el" ? "el-icon-info" : "ios-information-circle";
      return (
        <span slot="label">
          <span>{title}</span>
          {description ? (
            <Tag
              class="item"
              effect="dark"
              placement="top"
              max-width="200"
              content={description}
            >
              <ButtonTag
                icon={icon} //  icon类型
                style={{
                  padding: 0,
                  border: 0,
                  width: "auto",
                  height: "auto",
                  color: "#409eff"
                  // marginTop:"-2px"
                }}
              ></ButtonTag>
            </Tag>
          ) : null}
        </span>
      );
    },
    async init() {
      let extra = extraOptions(this.config.description);
      if (extra.url) {
        let data = window.sessionStorage.getItem(extra.url);
        if (data) {
          data = JSON.parse(data);
        } else {
          let res = await this.Form.request(
            formatUrl(extra.url, {
              ...this.$route.params
            })
          );
          data = res.data;
          window.sessionStorage.setItem(extra.url, JSON.stringify(data));
        }
        // console.log(data);
        if (data) {
          this.config.enum = data.map((el) => el[extra.return]);
          this.config.enumNames = data.map((el) => el[extra.show]);
          this.config.type = "select";
          this.config.multiple = extra.multiple === "true";
        }

        // this.Form.addRequest(prop, {
        //   url: extra.url,
        //   key: extra.key,
        //   show: extra.show
        // });
      }
    }
  },
  async created() {
    this.init();
  },
  beforeUpdate() {
    this.init();
  },
  mounted() {
    // console.log("mounted");
  },
  render(h) {
    // console.log("render", this.config, this.currentValue);
    // debugger;
    console.log(" base render ", this.config);
    if (this.Form.visiableStatus) {
      // console.log(this.config, this.prop, this.currentValue);
      return this.renderFun(h, this.config, this.prop, this.currentValue);
    }
    return null;
  }
};
</script>
<style lang="less" scoped>
.flex-div {
  display: flex;
  & > div:not(.item-button) {
    flex: 1;
    min-width: 0;
  }
  & > .item-button {
    width: 80px;
    height: 36px;
  }
}

.vue-form-item {
  input[readonly="readonly"] {
    border: none;
  }
}
.flex-object {
  // background-color: red;
  & > div {
    width: 100%;
    flex: 1;
  }
  & > .item-button {
    width: 80px;
    height: 36px;
    flex: 1;
  }
}
.form-item-array {
  // background-color: red;
}
</style>
