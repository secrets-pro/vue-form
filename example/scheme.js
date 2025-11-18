export default {
  properties: {

    riskList: {
      "minItems": 3,
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


// export default { "type": "object", "required": [], "properties": { "a": { "type": "object", "title": "a", "nestedProperties": [{ "type": "", "title": "aa", "name": "aa", "fieldRequired": true, "typeId": "input" }, { "type": "", "title": "ab", "name": "ab", "fieldRequired": true, "typeId": "array", "nestedProperties": [], "properties": {}, "required": [], "arrayItemType": "string", "minItems": 3, "items": { "type": "string" } }, { "type": "", "title": "ac", "name": "ac", "fieldRequired": true, "typeId": "object", "nestedProperties": [{ "type": "", "title": "aca", "name": "aca", "fieldRequired": true, "typeId": "input" }, { "type": "", "title": "acb", "name": "acb", "fieldRequired": true, "typeId": "input" }], "properties": { "aca": { "type": "string", "title": "aca" }, "acb": { "type": "string", "title": "acb" } }, "required": ["aca", "acb"] }], "properties": { "aa": { "type": "string", "title": "aa" }, "ab": { "type": "array", "title": "ab", "nestedProperties": [], "properties": {}, "required": [], "arrayItemType": "string", "minItems": 3, "items": { "type": "string" } }, "ac": { "type": "object", "title": "ac", "nestedProperties": [{ "type": "", "title": "aca", "name": "aca", "fieldRequired": true, "typeId": "input" }, { "type": "", "title": "acb", "name": "acb", "fieldRequired": true, "typeId": "input" }], "properties": { "aca": { "type": "string", "title": "aca" }, "acb": { "type": "string", "title": "acb" } }, "required": ["aca", "acb"] } }, "required": ["aa", "ab", "ac"] }, "b": { "type": "array", "title": "b", "arrayItemType": "object", "minItems": 2, "arrayItemProperties": [{ "type": "", "title": "ba", "name": "ba", "fieldRequired": true, "typeId": "input" }, { "type": "", "title": "bb", "name": "bb", "fieldRequired": true, "typeId": "input" }], "items": { "type": "object", "properties": { "ba": { "type": "string", "title": "ba" }, "bb": { "type": "string", "title": "bb" } }, "required": ["ba", "bb"] } } } }