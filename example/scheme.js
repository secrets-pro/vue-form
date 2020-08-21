// export default {
//   title: "basic",
//   type: "object",
//   buttons: ["confirm"],
//   properties: {
//     name: {
//       type: "string",
//       title: "姓名",
//       description: "测试描述"
//     },
//     school: {
//       title: "学校",
//       type: "object",
//       properties: {
//         address: {
//           title: "地址",
//           type: "string"
//         },
//         category: {
//           title: "等级",
//           type: "select",
//           options: [
//             {
//               label: "高中",
//               value: "major"
//             },
//             {
//               label: "初中",
//               value: "minor"
//             }
//           ]
//         }
//       }
//     },
//     type: {
//       type: "select",
//       title: "类型",
//       options: [
//         {
//           label: "类型1",
//           value: "type1"
//         },
//         {
//           label: "类型2",
//           value: "type2"
//         }
//       ]
//     },
//     radio: {
//       type: "radio",
//       title: "类型",
//       options: [
//         {
//           label: "类型1",
//           value: "type1"
//         },
//         {
//           label: "类型2",
//           value: "type2"
//         }
//       ]
//     },
//     date: {
//       type: "date",
//       title: "生日"
//     },
//     secrets: {
//       type: "array",
//       title: "密钥",
//       items: {
//         type: "string"
//       }
//     },
//     headers: {
//       type: "object" // get a basic object
//     },
//     key: {
//       // like a select
//       enum: [
//         "remote_addr",
//         "server_addr",
//         "http_x_real_ip",
//         "http_x_forwarded_for"
//       ],
//       type: "string"
//     },
//     rejected_code: {
//       default: 201,
//       minimum: 200, //minimum maximum
//       type: "integer"
//     },
//     configmaps: {
//       type: "array",
//       title: "挂载",
//       items: {
//         type: "object",
//         properties: {
//           name: {
//             type: "string",
//             title: "名称"
//           },
//           path: {
//             type: "string",
//             title: "路径"
//           }
//         }
//       }
//     },
//     code: {
//       title: "代码编辑",
//       type: "editor",
//       language: "json" //javascript', 'css', 'html', 'typescript', 'json
//     }
//   },
//   required: ["name", "phone"]
// };
export default {
  description: "响应模拟",
  buttons: ["confirm"],
  properties: {
    mock_response_code: {
      description: "",
      title: "http响应码",
      default: 200,
      type: "integer"
    },
    mock_response_body: {
      description: "",
      title: "返回值设置",
      default: `{"data":{"iconsInLine":4,"menuList":[{"name":"公共服务","iconList":[{"iconUrl":"https://gw.alipayobjects.com/os/q/cms/images/k8g1ntl0/9fdc00aa-577b-459f-ab6c-212bdcbb0c91_w180_h180.png","iconName":"我的账单"},{"iconUrl":"https://gw.alipayobjects.com/os/q/cms/images/k8g1o6zg/4fce755b-940c-40e0-8056-1037488ce4ee_w180_h180.png","iconName":"每日用电"},{"iconUrl":"https://gw.alipayobjects.com/os/q/cms/images/k8g1ov9e/e556b050-d5aa-42a1-8935-ad1aa46efcc3_w180_h180.png","iconName":"居民电价"},{"iconUrl":"https://gw.alipayobjects.com/os/q/cms/images/k8g1p7yu/54e4514f-620f-47ff-895f-96a372507e64_w184_h180.png","iconName":"缴费记录"},{"iconUrl":"https://gw.alipayobjects.com/os/q/cms/images/k8g1pljs/26e5e551-db96-4ece-b247-59dc44003f3f_w180_h180.png","iconName":"停电公告"},{"iconUrl":"https://gw.alipayobjects.com/os/q/cms/images/k8g1q46k/17f5f19c-96b0-41f6-8e5b-1dff0557fabf_w180_h180.png","iconName":"营业网点"}]}]}}`,
      type: "editor"
    },
    mock_headers_arr: {
      description: "",
      title: "响应头设置",
      type: "array",
      items: {
        properties: {
          value: { title: "value", description: "", type: "string" },
          name: { title: "key", description: "", type: "string" }
        },
        type: "object"
      }
    }
  },
  title: "mock插件",
  type: "object"
};
