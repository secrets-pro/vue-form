# vue-form

A JSON Scheme parse for Form with Element-UI,iview

- support `switch`,`input`,`input-number`,`select`,`radio`,`checkbox`,`date` components.
- support `minimun`,`maximun`,`minLength`,`maxlenght`,`pattern` form rules.
- support array & object nest
- support simple object without properties
- support anyOf
- support request url for select-options

## How to use

```bash
npm i @secrets/vue-form
```

```js
import elementUI from "element-ui";
import vueForm from "@secrets/vue-form";
Vue.use(elementUI);
Vue.use(vueForm, {
  elementUI: true // or
  // iView: true
});
```

## demo

```js
const schema = {
  title: "basic",
  type: "object",
  buttons: ["confirm"],
  properties: {
    name: {
      type: "string",
      title: "姓名"
    },
    school: {
      title: "学校",
      type: "object",
      properties: {
        address: {
          title: "地址",
          type: "string"
        },
        category: {
          title: "等级",
          type: "select",
          options: [
            {
              label: "高中",
              value: "major"
            },
            {
              label: "初中",
              value: "minor"
            }
          ]
        }
      }
    },
    type: {
      type: "select",
      title: "类型",
      options: [
        {
          label: "类型1",
          value: "type1"
        },
        {
          label: "类型2",
          value: "type2"
        }
      ]
    },
    radio: {
      type: "radio",
      title: "类型",
      options: [
        {
          label: "类型1",
          value: "type1"
        },
        {
          label: "类型2",
          value: "type2"
        }
      ]
    },
    date: {
      type: "date",
      title: "生日"
    },
    secrets: {
      type: "array",
      title: "密钥",
      items: {
        type: "string"
      }
    },
    headers: {
      type: "object" // get a basic object
    },
    key: {
      // like a select
      enum: [
        "remote_addr",
        "server_addr",
        "http_x_real_ip",
        "http_x_forwarded_for"
      ],
      type: "string"
    },
    rejected_code: {
      default: 201,
      minimum: 200, //minimum maximum
      type: "integer"
    },
    configmaps: {
      type: "array",
      title: "挂载",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "名称"
          },
          path: {
            type: "string",
            title: "路径"
          }
        }
      }
    }
  },
  required: ["name", "phone"]
};
```

```html
<vue-form ref="form" :schema="schema"></vue-form>
```

### API

```js
this.$refs.form.validate(); // validate the form
```

```js
this.$refs.form.getData(); // get the realtime data
```

![demo.png](demo.png)

## 打包

```bash
yarn build
// or
npm run build
```

## 本地测试

1. 本项目中

```bash
yarn build  // 打包出来
yarn link //加入到本地全局模块
```

2. 目标项目

```bash
yarn link  @secrets/vue-form
```

## 扩展

### description

description 可以写入一个 json-string，如：

```js
description: '{"title":"姓名","description":"描述信息","index":1}';
```

| key         | 描述                                   | 补充说明              |
| ----------- | -------------------------------------- | --------------------- |
| title       | 真实数据显示的名称                     | -                     |
| description | 描述信息，添加后会有一个 tooltip 提示  | -                     |
| index       | 字段排序，优先取 required 中配置的顺序 | -                     |
| url         | 接口请求地址                           | 需要传入 request 属性 |
| show        | url 数据中展示的字段                   |                       |
| return      | url 数据中作为值的字段                 |                       |

### request

需要手动传入一个 request 方法，比如`axios.post`, 内部逻辑会使用这个 request 根据 url 发起请求;响应结果的格式是固定的

```js
{
  data:[],
  total:10
}
```

### 自定义样式

1. 添加 style 通过设置 `ui:options`，数据是一个 Object,可以在 config 中设置，也可以在上述 description 扩展中写
2. 添加 class 通过设置 `ui:options`，数据是一个 Array，可以在 config 中设置，也可以在上述 description 扩展中写
