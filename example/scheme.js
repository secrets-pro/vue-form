export default {
  "type": "object",
  "required": [
      "bustype_code",
      "currency_code",
      "department",
      "operator",
      "org_code",
      "vendor_code",
      "vouchdate",
      "purchaseOrders"
  ],
  "properties": {
      "resubmitCheckKey": {
          "type": "string",
          "title": "幂等性校验键"
      },
      "bustype_code": {
          "type": "string",
          "title": "交易类型编码",
          "default": "TS015"
      },
      "exchRate": {
          "type": "number",
          "title": "汇率",
          "default": 1
      },
      "exchRateType": {
          "type": "string",
          "title": "汇率类型",
          "default": "01"
      },
      "invoiceVendor_code": {
          "type": "string",
          "title": "开票供应商编码"
      },
      "currency_code": {
          "type": "string",
          "title": "币种编码",
          "default": "CNY"
      },
      "natCurrency_code": {
          "type": "string",
          "title": "本币简称",
          "default": "CNY"
      },
      "org_code": {
          "type": "string",
          "title": "组织编码",
          "default": "01008"
      },
      "operator": {
          "type": "string",
          "title": "采购员新工号"
      },
      "department": {
          "type": "string",
          "title": "采购部门编码"
      },
      "purchaseOrderDefineCharacter": {
          "type": "array",
          "title": "表头自定义项",
          "items": {
              "type": "object",
              "properties": {
                  "CGLX": {
                      "type": "string",
                      "title": "采购类型",
                      "default": "02"
                  },
                  "SFICB": {
                      "type": "boolean",
                      "title": "是否ICB",
                      "default": false
                  }
              }
          }
      },
      "purchaseOrders": {
          "type": "array",
          "title": "采购订单明细",
          "items": {
              "type": "object",
              "required": [
                  "demandOrg_code",
                  "product_cCode",
                  "project_code",
                  "qty",
                  "oriSum",
                  "natSum",
                  "oriMoney",
                  "natMoney",
                  "purchaseOrdersDefineCharacter"
              ],
              "properties": {
                  "demandOrg_code": {
                      "type": "string",
                      "title": "需求组织编码",
                      "default": "01008"
                  },
                  "inInvoiceOrg_code": {
                      "type": "string",
                      "title": "收票组织编码",
                      "default": "01008"
                  },
                  "inOrg_code": {
                      "type": "string",
                      "title": "收货组织编码",
                      "default": "01008"
                  },
                  "invExchRate": {
                      "type": "string",
                      "title": "采购换算率(精度原因，暂时为string)",
                      "default": 1
                  },
                  "natMoney": {
                      "type": "string",
                      "title": "本币无税金额(精度原因，暂时为string)"
                  },
                  "natSum": {
                      "type": "string",
                      "title": "本币含税金额(精度原因，暂时为string)"
                  },
                  "natTax": {
                      "type": "string",
                      "title": "本币税额(精度原因，暂时为string)",
                      "default": 0
                  },
                  "natTaxUnitPrice": {
                      "type": "string",
                      "title": "本币含税单价(精度原因， 暂时为string)",
                      "default": 0
                  },
                  "natUnitPrice": {
                      "type": "string",
                      "title": "本币无税单价(精度原因，暂时为string)",
                      "default": 0
                  },
                  "oriMoney": {
                      "type": "string",
                      "title": "无税金额(精度原因，暂时为string)"
                  },
                  "oriSum": {
                      "type": "string",
                      "title": "含税金额(精度原因，暂时为string)"
                  },
                  "oriTax": {
                      "type": "string",
                      "title": "税额(精度原因，暂时为string)",
                      "default": 0
                  },
                  "discountTaxType": {
                      "type": "string",
                      "title": "扣税类别",
                      "enum": [
                          "0",
                          "1"
                      ],
                      "enumNames": [
                          "应税外加",
                          "应税外含"
                      ],
                      "default": "0"
                  },
                  "oriTaxUnitPrice": {
                      "type": "string",
                      "title": "含税单价(精度原因，暂时为string)",
                      "default": 0
                  },
                  "oriUnitPrice": {
                      "type": "string",
                      "title": "无税单价(精度原因，暂时为string)",
                      "default": 0
                  },
                  "taxitems_code": {
                      "type": "string",
                      "title": "税目税率编码",
                      "default": "TE"
                  },
                  "priceQty": {
                      "type": "string",
                      "title": "计价数量(精度原因，暂时为string)",
                      "default": 1
                  },
                  "product_cCode": {
                      "type": "string",
                      "title": "物料编码",
                      "default": "PCTCF0101"
                  },
                  "priceUOM_Code": {
                      "type": "string",
                      "title": "计价单位编码",
                      "default": "PCTCF0101"
                  },
                  "purUOM_Code": {
                      "type": "string",
                      "title": "采购单位编码",
                      "default": "PCTCF0101"
                  },
                  "project_code": {
                      "type": "string",
                      "title": "项目编码"
                  },
                  "qty": {
                      "type": "string",
                      "title": "数量(精度原因，暂时为string)",
                      "default": 1
                  },
                  "subQty": {
                      "type": "string",
                      "title": "采购数量(精度原因，暂时为string)",
                      "default": 1
                  },
                  "unitExchangeTypePrice": {
                      "type": "number",
                      "title": "计价单位转换率的换算方式",
                      "enum": [
                          "0"
                      ],
                      "enumNames": [
                          "固定换算",
                          "浮动换算"
                      ],
                      "default": 0
                  },
                  "unitExchangeType": {
                      "type": "number",
                      "title": "采购单位转换率的换算方式",
                      "enum": [
                          "0"
                      ],
                      "enumNames": [
                          "固定换算",
                          "浮动换算"
                      ],
                      "default": 0
                  },
                  "invPriceExchRate": {
                      "type": "string",
                      "title": "计价换算率(精度原因，暂时为string)",
                      "default": 1
                  },
                  "unit_code": {
                      "type": "string",
                      "title": "主计量编码",
                      "default": "TAO"
                  },
                  "purchaseOrdersDefineCharacter": {
                      "type": "object",
                      "title": "表体自定义项",
                      "required": [
                          "ALYZH",
                          "CGHTLX",
                          "CGWLFL",
                          "FPLX",
                          "FWQCZR",
                          "GYSZH",
                          "HTLRGS",
                          "SFKYS",
                          "SQDFYLX",
                          "XMJLKQ"
                      ],
                      "properties": {
                          "XMJLKQ": {
                              "type": "string",
                              "title": "项目经理工号（新工号）"
                          },
                          "ALYZH": {
                              "type": "string",
                              "title": "阿里云账号"
                          },
                          "CGWLFL": {
                              "type": "string",
                              "title": "采购物料分类",
                              "default": "PCTCF01"
                          },
                          "CGHTLX": {
                              "type": "string",
                              "title": "采购合同类型",
                              "default": "033"
                          },
                          "FPLX": {
                              "type": "string",
                              "title": "发票类型",
                              "default": "01"
                          },
                          "FWQCZR": {
                              "type": "string",
                              "title": "云资源服务器操作人姓名"
                          },
                          "GYSZH": {
                              "type": "number",
                              "title": "银行账号"
                          },
                          "HTLRGS": {
                              "type": "string",
                              "title": "利润归属方编码"
                          },
                          "HTXMLX": {
                              "type": "string",
                              "title": "项目类型编码",
                              "enum": [
                                  "C",
                                  "M",
                                  "P",
                                  "Q",
                                  "R",
                                  "T",
                                  "Z"
                              ],
                              "enumNames": [
                                  "产业园建设项目",
                                  "管理类项目",
                                  "信息化项目",
                                  "自建资产项目",
                                  "研发项目",
                                  "平台类项目",
                                  "装修项目"
                              ],
                              "default": "P"
                          },
                          "LRZX": {
                              "type": "number",
                              "title": "利润中心编码"
                          },
                          "SFKYS": {
                              "type": "boolean",
                              "title": "是否控预算",
                              "default": false
                          },
                          "SQDFYLX": {
                              "type": "string",
                              "title": "云资源费用类型",
                              "enum": [
                                  "0001",
                                  "0002",
                                  "0003"
                              ],
                              "enumNames": [
                                  "租赁费",
                                  "升级扩容",
                                  "流量费"
                              ],
                              "default": "0001"
                          },
                          "YZYSQLX": {
                              "type": "string",
                              "title": "云资源申请类型",
                              "enum": [
                                  "0001",
                                  "0002"
                              ],
                              "enumNames": [
                                  "续费",
                                  "新增"
                              ],
                              "default": "0001"
                          },
                          "YZYJJDQRQ": {
                              "type": "string",
                              "title": "云资源即将到期日期"
                          },
                          "YZYMYLLFYL": {
                              "type": "string",
                              "title": "云资源每月流量费用量"
                          },
                          "YZYZHSYJE": {
                              "type": "string",
                              "title": "云资源账户剩余金额"
                          },
                          "ZYYZLSC": {
                              "type": "string",
                              "title": "云资源租赁时长"
                          }
                      }
                  },
                  "_status": {
                      "type": "string",
                      "title": "操作标识",
                      "default": "Insert"
                  }
              }
          }
      },
      "_status": {
          "type": "string",
          "title": "操作标识",
          "default": "Insert"
      },
      "vendor_code": {
          "type": "string",
          "title": "供货供应商编码"
      },
      "vouchdate": {
          "type": "string",
          "title": "单据日期",
          "default": "yyyy-MM-dd"
      }
  }
}