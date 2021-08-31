/*
 * @Author: bowen.xu
 * @Date: 2021-05-07 09:54:37
 * @Last Modified by: bowen.xu
 * @Last Modified time: 2021-08-31 15:23:07
 */

import { isObject } from "lodash";

function extraOptions(description) {
  if (!description) {
    return {};
  }
  if (isObject(description)) {
    return description;
  }
  let rtn = {};
  try {
    rtn = JSON.parse(description);
  } catch (error) {
    console.error(error, description);
    // 不是json
    // rtn.title = description;
    rtn.description = description;
  }
  return rtn;
}
function formatUrl(url, params) {
  if (params) {
    for (let k in params) {
      url = url.replace(new RegExp("\\{" + k + "\\}", "g"), params[k]);
    }
  }
  return url;
}

export default {
  language: "json",
  format: "yyyy-MM-dd",
  options: {
    elementUI: false,
    iView: false
  },
  extraOptions,
  formatUrl,
  formatDate(date) {
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    let d = date.getDate();
    return y + "-" + (m > 9 ? m : "0" + m) + "-" + (d > 9 ? d : "0" + d);
  },
  generateRule(config, prop) {
    // if (prop === "imagePullSecrets") {
    //   debugger;
    // }
    if (prop.includes("-option")) {
      return [];
    }
    let required = !!config.required;
    let ruleType = {
      checkbox: "array",
      array: "array",
      number: "number",
      integer: "number",
      date: "date",
      switch: "boolean",
      boolean: "boolean"
    };
    // if (config.type !== "array") {
    let required_ = config.minLength || config.maxLength; //|| config.enum;
    //  || config.pattern;
    let text = config.enum || config.options ? "请选择" : "请输入";
    // FXIME 如果是数组嵌套object的时候 prop--> a.0.b==>rule
    let type = ruleType[config.type] || "string";
    if (config.multiple) {
      type = "array";
    }
    let baseRule = [
      {
        required: required_ || required,

        type: type,
        message:
          extraOptions(config.description).description ||
          `${text}${extraOptions(config.description).title ||
            config.title ||
            prop}`
      }
    ];

    // 更多校验规则
    if (config.minLength || config.maxLength) {
      let ruleMinlength = {
        min: config.minLength || 1,
        message: "长度至少" + (config.minLength || 1),
        trigger: "blur"
      };
      if (config.maxlength) {
        ruleMinlength["max"] = config.maxLength;
        ruleMinlength["message"] =
          "长度在" + (config.minLength || 1) + "和" + config.maxLength + "之间";
      }
      baseRule.push(ruleMinlength);
    }
    if (config.pattern) {
      baseRule.push({
        pattern: new RegExp(config.pattern),
        message: `格式需要满足正则${config.pattern}`,
        trigger: "blur"
      });
    }
    return baseRule;
  }
};
