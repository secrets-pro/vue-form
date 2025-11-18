export default {
  properties: {

    riskList: {
      description: '{"title":"风险项"}',
      "items": {
        "type": "object",
        "required": [
          "type",
          "checkItem",
          "severity",
          "result"
        ],
        "properties": {
          "type": {
            "title": "分类",
            "type": "string"
          },
          "checkItem": {
            "title": "检查项",
            "type": "string"
          },
          "severity": {
            "title": "风险等级",
            "type": "string"
          },
          "result": {
            "title": "结果",
            "type": "string"
          }
        }
      },
      title: "风险项",
      type: "array"
    }
    // code: {
    //   type: "editor"
    // }
  },
  required: ['riskList'],
  type: "object"
};
