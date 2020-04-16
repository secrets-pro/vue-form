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
    input(key, value) {
      console.log(key, value);
    },
  },
  render(h) {
    let type = this.config.type;
    let props = {
      value: this.currentValue,
    };
    let children = [];
    if (type === "radio" || type === "checkbox") {
      type = `${type}-group`;
      children = this.config.options.map((el) => {
        return h(
          `el-${this.config.type}`,
          {
            props: {
              label: el.value,
            },
          },
          el.label
        );
      });
    } else if (type === "date") {
      type = "date-picker";
      props.placeholder = "请选择日期";
      props.type = "date";
      props.format = this.config.format || "yyyy-MM-dd";
    } else if (type === "number") {
      type = "input-number";
      props["controls-position"] = "right";
    } else if (type === "select") {
      children = this.config.options.map((el) => {
        return h(`el-option`, {
          props: {
            label: el.value,
            value: el.value,
          },
        });
      });
    } else if (type === "string") {
      type = "input";
    }
    if (type === "object") {
      return h(
        "div",
        {},
        Object.keys(this.currentValue).map((el) => {
          return h("vue-form-item", {
            props: {
              prop: `${this.prop}.${el}`,
              value: this.currentValue[el],
              config: this.config.properties[el],
            },
            on: {
              input: (value) => {
                console.log(value);
                this.currentValue[el] = value;
              },
            },
          });
        })
      );
    }
    return h(
      "el-form-item",
      {
        props: {
          prop: this.prop,
          label: this.config.title || this.prop,
        },
      },
      [
        h(
          `el-${type}`,
          {
            props,
            on: {
              input: (value) => {
                this.$emit("input", value);
              },
            },
          },
          children
        ),
      ]
    );
  },
};
</script>
