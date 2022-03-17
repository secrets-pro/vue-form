<script>
/* eslint-disable no-unused-vars */
import setting from "../config";
// import styleCfg from "../styleCfg";
import { renderSelectOptions, renderRadioCheckbox } from "./render";
const { extraOptions, generateRule, formatUrl, getSetSecretKeys } = setting;
export default {
  name: "vue-form-item",
  inject: ["Form"],

  props: {
    value: [String, Number, Boolean, Array, Date, Object],
    config: Object,
    prop: String,
    labelWidth: [Number, String],
    required: Boolean
  },
  watch: {
    value(n) {
      this.currentValue = n;
    }
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
    renderObject(h, config, prop, model, slot) {
      // 渲染对象，根据字段的position进行排序，position越小排前面
      let modelKeysSorted = Object.keys(model)
        .filter(el =>
          Object.prototype.hasOwnProperty.call(config.properties, el)
        )
        .sort((a, b) => {
          if (!config.properties[a]) {
            console.error(`属性${a}在schema中不存在对应配置`);
            return -1;
          }
          if (!config.properties[b]) {
            console.error(`属性${b}在schema中不存在对应配置`);
            return -1;
          }
          let pa = extraOptions(config.properties[a].description);
          let pb = extraOptions(config.properties[b].description);
          if (a.includes("-option")) {
            return -1;
          }

          return pa.index - pb.index;
        });
      let ext = extraOptions(config.description);
      let title = ext.title || config.title;
      let desc = ext.description; //|| config.description;
      return h(
        "div",
        {
          class: ["item-object"],
          style: {
            // display: "flex"
          }
        },
        [
          !title || ext.showTitle === "false"
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
                    width: this.labelWidth + "px"
                  }
                },
                [this.renderLabel(title, desc)]
              ),
          h(
            "div",
            {
              class: {
                "flex-object": modelKeysSorted.length > 1,
                "has-title-object-content": ext.title || config.title
              },
              style: {
                // flex: 1,
                // flexWrap: "wrap",
                // display: "flex" //prop.indexOf(".") > -1 ? "flex" : "initial"
              }
            },
            [
              ...modelKeysSorted.map(el => {
                let configWrapper = JSON.parse(JSON.stringify(config));
                let __el__ = configWrapper.properties[el];
                return h("vue-form-item", {
                  props: {
                    prop: `${prop}.${el}`,
                    value: model[el],
                    labelWidth: this.labelWidth,
                    config: __el__
                  },
                  key: `${prop}.${el}`,
                  class: [
                    `flex-object-item-${__el__.enum ? "select" : __el__.type}`,
                    modelKeysSorted.length >= 3
                      ? "maxWidth33"
                      : "normal-vue-item"
                  ],
                  on: {
                    "on-copy": value => {
                      this.$emit("on-copy", value);
                    },
                    input: value => {
                      model[el] = value;
                      this.$emit("deepInput", `${prop}.${el}`, value);
                    },
                    arrayInput: (key, value) => {
                      this.$emit("arrayInput", key, value);
                    },
                    oneOfSelectChange: (key, value) => {
                      // oneof选项变化
                      if (configWrapper.oneOf) {
                        if (value > -1) {
                          model = JSON.parse(
                            JSON.stringify(
                              configWrapper.oneOf[value].defaultModel
                            )
                          );
                        } else {
                          model = {};
                        }
                        model[el] = value;
                        this.currentValue = model;

                        configWrapper.selectedIndex = value;
                        configWrapper.type = "object";

                        const keys = key.split(".");
                        this.$emit(
                          "deepInput",
                          keys.slice(0, keys.length - 1).join("."),
                          model
                        );
                      }
                    },
                    deepInput: (key, value) => {
                      this.$emit("deepInput", key, value);
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
            type: "primary",
            shape: "circle",
            icon: this.prefix === "i" ? "md-add" : "el-icon-plus",
            circle: true,
            size: "small"
          },
          class: "btn_icon_center",
          on: {
            click: () => {
              const { minItems, maxItems, item } = config;
              if (maxItems && model.length >= maxItems) {
                console.warn(`最大数量限制为${maxItems}`);
                return;
              }
              const modelWrapper = model[0] || item;
              let zore =
                typeof modelWrapper === "object"
                  ? JSON.parse(JSON.stringify(modelWrapper))
                  : modelWrapper;
              // 清空数据，解决添加会带上一项数据的问题
              zore = this.clearValues(zore);
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
        }
        // `新增` // ${title}
      );
      let remove = h(
        `${this.prefix}-button`,
        {
          props: {
            type: this.prefix == "i" ? "error" : "danger", // error类型  判断
            size: "small",
            shape: "circle",
            icon: this.prefix === "i" ? "md-remove" : "el-icon-minus",
            circle: true
          },
          class: "btn_icon_center",
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
        }
        // `删除` //${title}
      );
      // return index === 0 ? add : remove;
      return h(
        "div",
        {
          class: "item-button",
          style: {
            display: "flex",
            justifyContent: "flex-end"
          }
        },
        [index === 0 ? add : remove]
      );
    },
    clearValues(orginal) {
      if (typeof orginal === "object") {
        Object.keys(orginal).forEach(el => {
          if (typeof orginal[el] === "boolean") {
            orginal[el] = false;
          } else if (
            typeof orginal[el] === "number" &&
            el.indexOf("-option") === -1
          ) {
            orginal[el] = 0;
          } else if (typeof orginal[el] === "object") {
            orginal[el] = this.clearValues(orginal[el]);
          } else if (typeof orginal[el] === "string") {
            orginal[el] = "";
          }
        });
      } else if (typeof orginal === "boolean") {
        orginal = false;
      } else if (
        typeof orginal === "number" &&
        orginal.indexOf("-option") === -1
      ) {
        orginal = 0;
      } else if (typeof orginal === "string") {
        orginal = "";
      }
      return orginal;
    },
    renderArray(h, config, prop, model) {
      const { items, labelWidth } = config;
      let { type } = items;
      // let that = this;
      let children = [];
      let level =
        prop.indexOf(".") === -1 &&
        items.properties &&
        Object.keys(items.properties).length > 2;
      if (type === "string") {
        items.required = config.required;
      }
      if (model) {
        children =
          type === "object"
            ? model.map((el, index) => {
                // TODO model 类型
                // model是当前构造出来的数组对象 el就是子项 如果el不是object类型
                return h(
                  "div",
                  {
                    class: ["flex-array-wrapper"],
                    key: `divarr-${prop}.${index}`
                  },
                  [
                    h(
                      "div",
                      {
                        class: "flex-div flex-array"
                      },
                      [
                        this.renderFun(
                          h,
                          items,
                          `${prop}.${index}`,
                          model[index],
                          index
                        )
                      ]
                    ),

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
              })
            : model.map((el, index) => {
                // model是当前构造出来的数组对象 el就是子项 如果el不是object类型
                return h(
                  "div",
                  {
                    class: ["flex-div", "simple-div"],
                    key: `div0bj-${prop}.${index}`
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
      //  判断是否是一级属性
      let title =
        extraOptions(config.description).title || config.title || prop;
      let w = config.labelWidth + "px";
      return h(
        "div",
        {
          class: {
            "form-item-array": true,
            level1: level,
            widthcomplete: type === "object" //数组对象，宽度需要100%
          },
          style: {
            // display: "flex"
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
                width: level ? "auto" : w,
                display: level ? "flex" : "block",
                alignItems: level ? "center" : "initial"
              }
            },
            [
              h(
                "div",
                this.required || (type === "string" && config.required)
                  ? [
                      h(
                        "span",
                        { style: { color: "red", marginRight: "5px" } },
                        "*"
                      ),
                      h("span", title)
                    ]
                  : [h("span", title)]
              )
              // level
              //   ? this.renderArrayButton(
              //       h,
              //       config,
              //       model,
              //       extraOptions(config.description).title ||
              //         config.title ||
              //         prop,
              //       0,
              //       model.length
              //     )
              //   : null
            ]
          ),
          h(
            "div",
            {
              style: {
                flex: 1,
                marginLeft: w
              },
              class: "form-item-array-content"
            },
            [...children]
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

      let extra = extraOptions(config.description);
      let rules = generateRule(config, prop);
      let style = {};
      let props = {
        readonly: this.readonly,
        disabled: this.readonly,
        value:
          _arrayIndex !== undefined ? currentValue[_arrayIndex] : currentValue
      };
      // ui 配置
      let uiOptions = config["ui:options"] || extra["ui:options"];
      let uiClass = config["ui:classes"] || extra["ui:classes"] || [];
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
        config.options = config.anyOf.map(el => {
          return {
            label: el.description,
            options: el.enum.map(ele => ({ label: ele, value: ele }))
          };
        });
      }
      if (config.oneOf) {
        let ext = extraOptions(config.description);
        let optionProp = prop;
        if (prop.includes(".")) {
          const props = prop.split(".");
          optionProp = props[props.length - 1];
        }
        let selectedIndex =
          currentValue[optionProp + "-option"] ||
          currentValue[optionProp + "-option"] === 0
            ? currentValue[optionProp + "-option"]
            : config.selectedIndex;
        // let selectedIndex = config.selectedIndex; // currentValue[prop + "-option"] ||
        config = {
          //  config 临时记录 现有选择的oneOf字段
          oneOf: config.oneOf,
          ...config.oneOf[selectedIndex],
          selectedIndex: selectedIndex
        };
        let k = prop + "-option";
        let idx = prop.lastIndexOf(".");
        if (idx > -1) {
          k = prop.substring(idx + 1) + "-option";
        }
        if (!config.properties) {
          config.properties = {};
        }
        config.properties[k] = {
          title: extra.title,
          description: "",
          type: "select",
          "ui:classes": ["vue-form-oneofselection"],
          enum: config.oneOf.map((el, index) => index),
          enumNames: config.oneOf.map((el, index) =>
            extra.items ? extra.items[index] : `选项${index}`
          )
        };
        if (selectedIndex > -1) {
          const resultModel = config.oneOf[selectedIndex].defaultModel;
          Object.assign(resultModel, currentValue);
          currentValue = resultModel;
        }
        if (ext.default === -1) {
          config.properties[k].enum.unshift(-1);
          config.properties[k].enumNames.unshift("不使用");
        }
        currentValue[k] = selectedIndex;
      }
      let children = [];

      if (type === "radio" || type === "checkbox") {
        type = `${type}-group`;
        children = renderRadioCheckbox(
          h,
          config.type,
          config.options,
          this.prefix
        );
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

        // if (typeof props.value != "number") {
        //   props.value = 0;
        // }
      } else if (type === "select" || config.enum) {
        if (config.enum) {
          let enumNames = config.enumNames || extra.items;
          config.options = config.enum.map((el, index) => {
            return {
              label: enumNames ? enumNames[index] : el,
              value: el
            };
          });
        }
        children = renderSelectOptions(
          h,
          config.options,
          config.groups,
          this.prefix
        );
        type = "select";
        // style.width = "100%";
        props.multiple = config.multiple;
      } else if (type === "string" || type === "textarea") {
        // console.log(type);

        // 新增判断加密字段
        if (getSetSecretKeys().includes(config.name)) {
          // if (config.name && config.name.toLowerCase() === "password") {
          props.type = "password";
        }
        if (extra.title) {
          props.placeholder = "请输入" + extra.title;
        }
        if (type === "textarea") {
          props.type = "textarea";
          // props.autosize = { minRows: 2, maxRows: 6 };
        }
        type = "input";

        if (props.type == "password" && setting.options.copy) {
          children = [
            h("span", {
              class: "copy-btn",
              slot: "append",
              on: {
                click: value => {
                  this.$emit("on-copy", this.$data.currentValue);
                }
              }
            })
          ];
        }
      } else if (type === "boolean" || type === "bool") {
        type = "switch";
        if (this.readonly) {
          props.disabled = true;
        }
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
        config.labelWidth = this.labelWidth;
        return this.renderArray(h, config, prop, currentValue);
      } else if (type === "object") {
        return this.renderObject(h, config, prop, currentValue, slot);
      }
      // console.log("---children---", children);
      let labelArr =
        extra.title || config.title || (_arrayIndex > -1 ? "" : prop);
      let arr = [
        h(
          `${type === "editor" ? "my" : this.prefix}-${type}`,
          {
            props,
            style: type !== "editor" ? {} : style,
            on: {
              change: value => {
                if (type === "editor") {
                  this.$emit("input", value);
                }
              },
              editorDidMount: editor => {
                editor.layout();
              },
              input: value => {
                if (_arrayIndex !== undefined) {
                  currentValue[_arrayIndex] = value;
                  this.$emit("arrayInput", prop, currentValue[_arrayIndex]);
                } else {
                  if (prop.includes("-option")) {
                    // oneof
                    this.$emit("oneOfSelectChange", prop, value);
                  } else {
                    if (type === "input-number") {
                      if (value === null) {
                        value = "";
                      }
                    }
                    this.$emit("input", value);
                  }
                }
              }
            }
          },
          children
        )
      ];
      if (labelArr) {
        arr.push(this.renderLabel(labelArr, extra.description, "label"));
      }
      let width = _arrayIndex > -1 ? 0 : this.labelWidth;
      if (this.readonly) {
        rules = undefined;
      }
      return h(
        `${this.prefix}-form-item`,
        {
          class: ["vue-form-item", ...uiClass],
          props: {
            prop,
            labelWidth: this.prefix === "el" ? width + "px" : width,
            rules: rules
            // label: extra.title || config.title || prop
          },
          key: prop,
          style: type === "editor" ? {} : style
        },
        arr
      );
    },
    // 修改成render
    renderLabel(title, description, slot) {
      // let exp = extraOptions(description);
      let Tag = this.prefix + "-tooltip";
      let ButtonTag = this.prefix + "-button";
      let icon =
        this.prefix === "el" ? "el-icon-info" : "ios-information-circle";
      let res = (
        <span>
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
      if (!slot) {
        return <span>{res}</span>;
      }
      return <span slot={slot}>{res}</span>;
    },
    async init(flag) {
      let extra = extraOptions(this.config.description);
      if (extra.url) {
        let url = formatUrl(extra.url, {
          ...(this.$route ? this.$route.params : {})
        });
        let data = window.sessionStorage.getItem(url);
        if (data) {
          data = JSON.parse(data);
        } else {
          try {
            let res = await this.Form.request(url);

            if (res && res.data) {
              data = res.data;
              window.sessionStorage.setItem(url, JSON.stringify(data));
            }
          } catch (error) {
            console.error(error);
          }
        }
        let __enum__ = data ? data.map(el => el[extra.return]) : [];
        let __enumNames__ = data ? data.map(el => el[extra.show]) : [];
        let muti = extra.multiple === "true";
        let __current_value__ = this.currentValue;
        if (muti) {
          __current_value__.forEach(el => {
            if (el && !__enum__.includes(el)) {
              __enum__.push(el);
              __enumNames__.push(el);
            }
          });
        } else {
          if (__current_value__ && !__enum__.includes(__current_value__)) {
            __enum__.push(__current_value__);
            __enumNames__.push(__current_value__);
          }
        }
        this.config.enum = __enum__;
        this.config.enumNames = __enumNames__;
        this.config.type = "select";
        this.config.multiple = muti;
        // }e
        if (flag) {
          this.$forceUpdate();
        }
      }
    }
  },
  async created() {
    this.init(1);
  },
  beforeUpdate() {
    this.init();
  },
  render(h) {
    if (this.Form.visiableStatus) {
      return this.renderFun(h, this.config, this.prop, this.currentValue);
    }
    return null;
  }
};
</script>
<style lang="less" scoped>
@import url("./FormItem.less");
</style>
