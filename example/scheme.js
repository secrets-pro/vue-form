// 大型复杂 JSON Schema - 用于性能测试
// 包含多个嵌套层级、多种字段类型、数组、验证规则等

export default {
  type: "object",
  required: [
    "arrdemo",
    "userInfo",
    "companyInfo",
    "productConfig",
    "orderDetails",
    "paymentInfo",
    "shippingAddress"
  ],
  properties: {
    arrdemo: {
      type: "array",
      title: "标签",
      items: {
        type: "string"
      },
      minItems: 1,
      maxLength: 10
    },
    // ========== 用户信息部分 ==========
    userInfo: {
      type: "object",
      title: "用户信息",
      description: '{"title":"用户基本信息","description":"包含用户的详细个人信息"}',
      required: ["username", "email", "phone", "gender", "birthday"],
      properties: {
        username: {
          type: "string",
          title: "用户名",
          minLength: 3,
          maxLength: 20,
          pattern: "^[a-zA-Z0-9_]+$",
          description: '{"title":"用户名","description":"3-20个字符，只能包含字母、数字和下划线"}'
        },
        email: {
          type: "string",
          title: "邮箱",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: '{"title":"邮箱地址","description":"请输入有效的邮箱地址"}'
        },
        phone: {
          type: "string",
          title: "手机号",
          pattern: "^1[3-9]\\d{9}$",
          minLength: 11,
          maxLength: 11,
          description: '{"title":"手机号码","description":"请输入11位手机号码"}'
        },
        gender: {
          type: "select",
          title: "性别",
          options: [
            { label: "男", value: "male" },
            { label: "女", value: "female" },
            { label: "其他", value: "other" }
          ],
          description: '{"title":"性别选择"}'
        },
        birthday: {
          type: "date",
          title: "生日",
          description: '{"title":"出生日期"}'
        },
        age: {
          type: "integer",
          title: "年龄",
          minimum: 18,
          maximum: 100,
          description: '{"title":"年龄","description":"18-100岁"}'
        },
        avatar: {
          type: "string",
          title: "头像URL",
          description: '{"title":"头像地址"}'
        },
        bio: {
          type: "string",
          title: "个人简介",
          maxLength: 500,
          description: '{"title":"个人简介","description":"最多500个字符"}'
        },
        preferences: {
          type: "object",
          title: "偏好设置",
          properties: {
            theme: {
              type: "select",
              title: "主题",
              options: [
                { label: "浅色", value: "light" },
                { label: "深色", value: "dark" },
                { label: "自动", value: "auto" }
              ]
            },
            language: {
              type: "select",
              title: "语言",
              options: [
                { label: "中文", value: "zh" },
                { label: "English", value: "en" },
                { label: "日本語", value: "ja" }
              ]
            },
            notifications: {
              type: "checkbox",
              title: "通知设置",
              options: [
                { label: "邮件通知", value: "email" },
                { label: "短信通知", value: "sms" },
                { label: "推送通知", value: "push" }
              ]
            },
            privacy: {
              type: "switch",
              title: "隐私模式",
              default: false
            }
          }
        }
      }
    },

    // ========== 公司信息部分 ==========
    companyInfo: {
      type: "object",
      title: "公司信息",
      required: ["companyName", "industry", "scale", "address"],
      properties: {
        companyName: {
          type: "string",
          title: "公司名称",
          minLength: 2,
          maxLength: 100,
          description: '{"title":"公司全称"}'
        },
        industry: {
          type: "select",
          title: "行业",
          options: [
            { label: "互联网/IT", value: "it" },
            { label: "金融", value: "finance" },
            { label: "制造业", value: "manufacturing" },
            { label: "零售", value: "retail" },
            { label: "教育", value: "education" },
            { label: "医疗", value: "healthcare" },
            { label: "其他", value: "other" }
          ]
        },
        scale: {
          type: "select",
          title: "公司规模",
          options: [
            { label: "1-50人", value: "small" },
            { label: "51-200人", value: "medium" },
            { label: "201-1000人", value: "large" },
            { label: "1000人以上", value: "enterprise" }
          ]
        },
        address: {
          type: "object",
          title: "公司地址",
          required: ["province", "city", "street"],
          properties: {
            province: {
              type: "select",
              title: "省份",
              options: [
                { label: "北京", value: "beijing" },
                { label: "上海", value: "shanghai" },
                { label: "广东", value: "guangdong" },
                { label: "浙江", value: "zhejiang" },
                { label: "江苏", value: "jiangsu" }
              ]
            },
            city: {
              type: "string",
              title: "城市",
              minLength: 2,
              maxLength: 50
            },
            district: {
              type: "string",
              title: "区/县",
              minLength: 2,
              maxLength: 50
            },
            street: {
              type: "string",
              title: "街道地址",
              minLength: 5,
              maxLength: 200
            },
            zipCode: {
              type: "string",
              title: "邮编",
              pattern: "^\\d{6}$"
            }
          }
        },
        contact: {
          type: "object",
          title: "联系方式",
          properties: {
            phone: {
              type: "string",
              title: "联系电话",
              pattern: "^[0-9-]+$"
            },
            fax: {
              type: "string",
              title: "传真"
            },
            website: {
              type: "string",
              title: "网站",
              pattern: "^https?://.+"
            }
          }
        },
        departments: {
          type: "array",
          title: "部门列表",
          minItems: 1,
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                title: "部门名称",
                minLength: 2,
                maxLength: 50
              },
              manager: {
                type: "string",
                title: "部门经理",
                minLength: 2,
                maxLength: 20
              },
              employeeCount: {
                type: "integer",
                title: "员工数量",
                minimum: 1,
                maximum: 10000
              },
              budget: {
                type: "number",
                title: "预算（万元）",
                minimum: 0,
                maximum: 100000
              }
            },
            required: ["name", "manager"]
          }
        }
      }
    },

    // ========== 产品配置部分 ==========
    productConfig: {
      type: "object",
      title: "产品配置",
      required: ["productName", "category", "price", "inventory"],
      properties: {
        productName: {
          type: "string",
          title: "产品名称",
          minLength: 2,
          maxLength: 100
        },
        category: {
          type: "select",
          title: "产品类别",
          options: [
            { label: "电子产品", value: "electronics" },
            { label: "服装", value: "clothing" },
            { label: "食品", value: "food" },
            { label: "图书", value: "books" },
            { label: "家具", value: "furniture" }
          ]
        },
        subCategory: {
          type: "select",
          title: "子类别",
          options: [
            { label: "手机", value: "phone" },
            { label: "电脑", value: "computer" },
            { label: "配件", value: "accessories" }
          ]
        },
        price: {
          type: "number",
          title: "价格",
          minimum: 0,
          maximum: 1000000,
          description: '{"title":"产品价格（元）"}'
        },
        originalPrice: {
          type: "number",
          title: "原价",
          minimum: 0,
          maximum: 1000000
        },
        inventory: {
          type: "integer",
          title: "库存数量",
          minimum: 0,
          maximum: 100000
        },
        sku: {
          type: "string",
          title: "SKU编码",
          pattern: "^[A-Z0-9-]+$",
          minLength: 6,
          maxLength: 20
        },
        description: {
          type: "string",
          title: "产品描述",
          maxLength: 2000
        },
        tags: {
          type: "array",
          title: "标签",
          items: {
            type: "string"
          },
          minItems: 1,
          maxLength: 10
        },
        specifications: {
          type: "array",
          title: "规格参数",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                title: "参数名",
                minLength: 1,
                maxLength: 50
              },
              value: {
                type: "string",
                title: "参数值",
                minLength: 1,
                maxLength: 200
              },
              unit: {
                type: "string",
                title: "单位",
                maxLength: 10
              }
            },
            required: ["name", "value"]
          }
        },
        images: {
          type: "array",
          title: "产品图片",
          items: {
            type: "string"
          },
          minItems: 1,
          maxLength: 10
        },
        variants: {
          type: "array",
          title: "产品变体",
          items: {
            type: "object",
            properties: {
              color: {
                type: "select",
                title: "颜色",
                options: [
                  { label: "红色", value: "red" },
                  { label: "蓝色", value: "blue" },
                  { label: "绿色", value: "green" },
                  { label: "黑色", value: "black" },
                  { label: "白色", value: "white" }
                ]
              },
              size: {
                type: "select",
                title: "尺寸",
                options: [
                  { label: "S", value: "s" },
                  { label: "M", value: "m" },
                  { label: "L", value: "l" },
                  { label: "XL", value: "xl" }
                ]
              },
              price: {
                type: "number",
                title: "变体价格",
                minimum: 0
              },
              stock: {
                type: "integer",
                title: "库存",
                minimum: 0
              }
            },
            required: ["color", "size"]
          }
        },
        features: {
          type: "checkbox",
          title: "产品特性",
          options: [
            { label: "包邮", value: "freeShipping" },
            { label: "7天无理由退货", value: "return7days" },
            { label: "正品保证", value: "authentic" },
            { label: "限时特价", value: "limited" },
            { label: "新品", value: "new" }
          ]
        },
        status: {
          type: "radio",
          title: "产品状态",
          options: [
            { label: "上架", value: "published" },
            { label: "下架", value: "unpublished" },
            { label: "草稿", value: "draft" }
          ]
        }
      }
    },

    // ========== 订单详情部分 ==========
    orderDetails: {
      type: "object",
      title: "订单详情",
      required: ["orderNumber", "orderDate", "items", "totalAmount"],
      properties: {
        orderNumber: {
          type: "string",
          title: "订单号",
          pattern: "^ORD[0-9]{10}$",
          description: '{"title":"订单编号","description":"格式：ORD+10位数字"}'
        },
        orderDate: {
          type: "date",
          title: "订单日期"
        },
        items: {
          type: "array",
          title: "订单商品",
          minItems: 1,
          items: {
            type: "object",
            required: ["productId", "productName", "quantity", "unitPrice"],
            properties: {
              productId: {
                type: "string",
                title: "商品ID",
                minLength: 1
              },
              productName: {
                type: "string",
                title: "商品名称",
                minLength: 1,
                maxLength: 200
              },
              quantity: {
                type: "integer",
                title: "数量",
                minimum: 1,
                maximum: 9999
              },
              unitPrice: {
                type: "number",
                title: "单价",
                minimum: 0
              },
              subtotal: {
                type: "number",
                title: "小计",
                minimum: 0
              },
              discount: {
                type: "number",
                title: "折扣",
                minimum: 0,
                maximum: 100
              },
              notes: {
                type: "string",
                title: "备注",
                maxLength: 500
              }
            }
          }
        },
        subtotal: {
          type: "number",
          title: "商品小计",
          minimum: 0
        },
        discountAmount: {
          type: "number",
          title: "折扣金额",
          minimum: 0
        },
        shippingFee: {
          type: "number",
          title: "运费",
          minimum: 0
        },
        tax: {
          type: "number",
          title: "税费",
          minimum: 0
        },
        totalAmount: {
          type: "number",
          title: "订单总额",
          minimum: 0
        },
        currency: {
          type: "select",
          title: "货币",
          options: [
            { label: "人民币 (CNY)", value: "CNY" },
            { label: "美元 (USD)", value: "USD" },
            { label: "欧元 (EUR)", value: "EUR" },
            { label: "日元 (JPY)", value: "JPY" }
          ],
          default: "CNY"
        },
        couponCode: {
          type: "string",
          title: "优惠券代码",
          pattern: "^[A-Z0-9]{6,20}$"
        },
        orderStatus: {
          type: "select",
          title: "订单状态",
          options: [
            { label: "待付款", value: "pending" },
            { label: "已付款", value: "paid" },
            { label: "已发货", value: "shipped" },
            { label: "已完成", value: "completed" },
            { label: "已取消", value: "cancelled" },
            { label: "已退款", value: "refunded" }
          ]
        }
      }
    },

    // ========== 支付信息部分 ==========
    paymentInfo: {
      type: "object",
      title: "支付信息",
      required: ["paymentMethod", "paymentAmount"],
      properties: {
        paymentMethod: {
          type: "select",
          title: "支付方式",
          options: [
            { label: "支付宝", value: "alipay" },
            { label: "微信支付", value: "wechat" },
            { label: "银行卡", value: "bankcard" },
            { label: "信用卡", value: "creditcard" },
            { label: "现金", value: "cash" }
          ]
        },
        paymentAmount: {
          type: "number",
          title: "支付金额",
          minimum: 0
        },
        paymentDate: {
          type: "date",
          title: "支付日期"
        },
        transactionId: {
          type: "string",
          title: "交易号",
          pattern: "^[A-Z0-9]{16,32}$"
        },
        bankInfo: {
          type: "object",
          title: "银行信息",
          properties: {
            bankName: {
              type: "select",
              title: "银行名称",
              options: [
                { label: "中国工商银行", value: "ICBC" },
                { label: "中国建设银行", value: "CCB" },
                { label: "中国农业银行", value: "ABC" },
                { label: "中国银行", value: "BOC" },
                { label: "招商银行", value: "CMB" }
              ]
            },
            accountNumber: {
              type: "string",
              title: "账号",
              pattern: "^[0-9]{16,19}$"
            },
            accountHolder: {
              type: "string",
              title: "持卡人",
              minLength: 2,
              maxLength: 50
            }
          }
        },
        installment: {
          type: "object",
          title: "分期信息",
          properties: {
            enabled: {
              type: "switch",
              title: "是否分期",
              default: false
            },
            periods: {
              type: "select",
              title: "分期期数",
              options: [
                { label: "3期", value: 3 },
                { label: "6期", value: 6 },
                { label: "12期", value: 12 },
                { label: "24期", value: 24 }
              ]
            },
            monthlyPayment: {
              type: "number",
              title: "月供金额",
              minimum: 0
            }
          }
        }
      }
    },

    // ========== 配送地址部分 ==========
    shippingAddress: {
      type: "object",
      title: "配送地址",
      required: ["receiverName", "receiverPhone", "province", "city", "detailAddress"],
      properties: {
        receiverName: {
          type: "string",
          title: "收货人姓名",
          minLength: 2,
          maxLength: 20
        },
        receiverPhone: {
          type: "string",
          title: "收货人电话",
          pattern: "^1[3-9]\\d{9}$"
        },
        province: {
          type: "select",
          title: "省份",
          options: [
            { label: "北京", value: "beijing" },
            { label: "上海", value: "shanghai" },
            { label: "广东", value: "guangdong" },
            { label: "浙江", value: "zhejiang" },
            { label: "江苏", value: "jiangsu" },
            { label: "山东", value: "shandong" },
            { label: "四川", value: "sichuan" }
          ]
        },
        city: {
          type: "string",
          title: "城市",
          minLength: 2,
          maxLength: 50
        },
        district: {
          type: "string",
          title: "区/县",
          minLength: 2,
          maxLength: 50
        },
        detailAddress: {
          type: "string",
          title: "详细地址",
          minLength: 5,
          maxLength: 200
        },
        zipCode: {
          type: "string",
          title: "邮编",
          pattern: "^\\d{6}$"
        },
        isDefault: {
          type: "switch",
          title: "设为默认地址",
          default: false
        },
        addressType: {
          type: "select",
          title: "地址类型",
          options: [
            { label: "家庭", value: "home" },
            { label: "公司", value: "company" },
            { label: "学校", value: "school" },
            { label: "其他", value: "other" }
          ]
        }
      }
    },

    // ========== 物流信息部分 ==========
    logistics: {
      type: "object",
      title: "物流信息",
      properties: {
        shippingCompany: {
          type: "select",
          title: "物流公司",
          options: [
            { label: "顺丰速运", value: "sf" },
            { label: "圆通速递", value: "yto" },
            { label: "中通快递", value: "zto" },
            { label: "申通快递", value: "sto" },
            { label: "韵达速递", value: "yd" },
            { label: "EMS", value: "ems" }
          ]
        },
        trackingNumber: {
          type: "string",
          title: "运单号",
          pattern: "^[A-Z0-9]{10,20}$"
        },
        estimatedDelivery: {
          type: "date",
          title: "预计送达时间"
        },
        logisticsStatus: {
          type: "select",
          title: "物流状态",
          options: [
            { label: "已揽收", value: "collected" },
            { label: "运输中", value: "in_transit" },
            { label: "派送中", value: "out_for_delivery" },
            { label: "已签收", value: "delivered" },
            { label: "异常", value: "exception" }
          ]
        },
        trackingHistory: {
          type: "array",
          title: "物流轨迹",
          items: {
            type: "object",
            properties: {
              time: {
                type: "date",
                title: "时间"
              },
              location: {
                type: "string",
                title: "位置",
                minLength: 2,
                maxLength: 100
              },
              status: {
                type: "string",
                title: "状态描述",
                maxLength: 200
              }
            },
            required: ["time", "location", "status"]
          }
        }
      }
    },

    // ========== 评价信息部分 ==========
    reviews: {
      type: "array",
      title: "评价列表",
      items: {
        type: "object",
        properties: {
          reviewerName: {
            type: "string",
            title: "评价人",
            minLength: 1,
            maxLength: 50
          },
          rating: {
            type: "integer",
            title: "评分",
            minimum: 1,
            maximum: 5
          },
          comment: {
            type: "string",
            title: "评价内容",
            maxLength: 1000
          },
          reviewDate: {
            type: "date",
            title: "评价日期"
          },
          images: {
            type: "array",
            title: "评价图片",
            items: {
              type: "string"
            },
            maxLength: 9
          },
          helpful: {
            type: "integer",
            title: "有用数",
            minimum: 0
          },
          reply: {
            type: "object",
            title: "商家回复",
            properties: {
              content: {
                type: "string",
                title: "回复内容",
                maxLength: 500
              },
              replyDate: {
                type: "date",
                title: "回复时间"
              }
            }
          }
        },
        required: ["reviewerName", "rating", "comment"]
      }
    },

    // ========== 系统配置部分 ==========
    systemConfig: {
      type: "object",
      title: "系统配置",
      properties: {
        theme: {
          type: "select",
          title: "主题",
          options: [
            { label: "默认", value: "default" },
            { label: "深色", value: "dark" },
            { label: "浅色", value: "light" }
          ]
        },
        language: {
          type: "select",
          title: "语言",
          options: [
            { label: "简体中文", value: "zh-CN" },
            { label: "繁体中文", value: "zh-TW" },
            { label: "English", value: "en-US" },
            { label: "日本語", value: "ja-JP" }
          ]
        },
        timezone: {
          type: "select",
          title: "时区",
          options: [
            { label: "UTC+8 (北京时间)", value: "Asia/Shanghai" },
            { label: "UTC+0 (伦敦时间)", value: "Europe/London" },
            { label: "UTC-5 (纽约时间)", value: "America/New_York" },
            { label: "UTC+9 (东京时间)", value: "Asia/Tokyo" }
          ]
        },
        notifications: {
          type: "object",
          title: "通知设置",
          properties: {
            email: {
              type: "switch",
              title: "邮件通知",
              default: true
            },
            sms: {
              type: "switch",
              title: "短信通知",
              default: false
            },
            push: {
              type: "switch",
              title: "推送通知",
              default: true
            },
            wechat: {
              type: "switch",
              title: "微信通知",
              default: false
            }
          }
        },
        security: {
          type: "object",
          title: "安全设置",
          properties: {
            twoFactorAuth: {
              type: "switch",
              title: "双因素认证",
              default: false
            },
            passwordExpiry: {
              type: "integer",
              title: "密码有效期（天）",
              minimum: 30,
              maximum: 365,
              default: 90
            },
            sessionTimeout: {
              type: "integer",
              title: "会话超时（分钟）",
              minimum: 5,
              maximum: 480,
              default: 30
            },
            ipWhitelist: {
              type: "array",
              title: "IP白名单",
              items: {
                type: "string",
                pattern: "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
              }
            }
          }
        },
        features: {
          type: "checkbox",
          title: "功能开关",
          options: [
            { label: "启用API", value: "api" },
            { label: "启用Webhook", value: "webhook" },
            { label: "启用数据分析", value: "analytics" },
            { label: "启用A/B测试", value: "abtest" },
            { label: "启用CDN加速", value: "cdn" }
          ]
        }
      }
    },

    // ========== 权限配置部分 ==========
    permissions: {
      type: "array",
      title: "权限列表",
      items: {
        type: "object",
        properties: {
          role: {
            type: "select",
            title: "角色",
            options: [
              { label: "管理员", value: "admin" },
              { label: "编辑", value: "editor" },
              { label: "查看者", value: "viewer" },
              { label: "访客", value: "guest" }
            ]
          },
          resources: {
            type: "checkbox",
            title: "资源权限",
            options: [
              { label: "用户管理", value: "user_manage" },
              { label: "订单管理", value: "order_manage" },
              { label: "产品管理", value: "product_manage" },
              { label: "财务管理", value: "finance_manage" },
              { label: "系统设置", value: "system_settings" }
            ]
          },
          actions: {
            type: "checkbox",
            title: "操作权限",
            options: [
              { label: "创建", value: "create" },
              { label: "读取", value: "read" },
              { label: "更新", value: "update" },
              { label: "删除", value: "delete" },
              { label: "导出", value: "export" }
            ]
          },
          conditions: {
            type: "object",
            title: "条件限制",
            properties: {
              department: {
                type: "select",
                title: "部门限制",
                options: [
                  { label: "无限制", value: "all" },
                  { label: "仅本部门", value: "own" },
                  { label: "仅本人", value: "self" }
                ]
              },
              timeRange: {
                type: "object",
                title: "时间范围",
                properties: {
                  startTime: {
                    type: "date",
                    title: "开始时间"
                  },
                  endTime: {
                    type: "date",
                    title: "结束时间"
                  }
                }
              }
            }
          }
        },
        required: ["role"]
      }
    },

    // ========== 元数据部分 ==========
    metadata: {
      type: "object",
      title: "元数据",
      properties: {
        createdAt: {
          type: "date",
          title: "创建时间"
        },
        updatedAt: {
          type: "date",
          title: "更新时间"
        },
        createdBy: {
          type: "string",
          title: "创建人",
          maxLength: 50
        },
        updatedBy: {
          type: "string",
          title: "更新人",
          maxLength: 50
        },
        version: {
          type: "string",
          title: "版本号",
          pattern: "^\\d+\\.\\d+\\.\\d+$"
        },
        tags: {
          type: "array",
          title: "标签",
          items: {
            type: "string"
          }
        },
        notes: {
          type: "string",
          title: "备注",
          maxLength: 2000
        },
        attachments: {
          type: "array",
          title: "附件",
          items: {
            type: "object",
            properties: {
              fileName: {
                type: "string",
                title: "文件名",
                minLength: 1,
                maxLength: 255
              },
              fileSize: {
                type: "integer",
                title: "文件大小（字节）",
                minimum: 0
              },
              fileType: {
                type: "select",
                title: "文件类型",
                options: [
                  { label: "文档", value: "document" },
                  { label: "图片", value: "image" },
                  { label: "视频", value: "video" },
                  { label: "音频", value: "audio" },
                  { label: "其他", value: "other" }
                ]
              },
              uploadDate: {
                type: "date",
                title: "上传日期"
              },
              url: {
                type: "string",
                title: "文件URL",
                pattern: "^https?://.+"
              }
            },
            required: ["fileName", "url"]
          }
        }
      }
    }
  }
};
