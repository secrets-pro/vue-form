export default {
  properties: {
    domain: {
      description: "域名",
      title: "domain",
      type: "string"
    },
    args: {
      description: "参数",
      items: {
        type: "string"
      },
      title: "args",
      type: "array"
    },
    cmd: {
      description: "命令",
      items: {
        type: "string"
      },
      title: "cmd",
      type: "array"
    },

    env: {
      description: "环境变量",
      items: {
        properties: {
          name: {
            description: "名称",
            title: "name",
            type: "string"
          },
          value: {
            description: "值",
            title: "value",
            type: "string"
          }
        },
        required: ["name"],
        type: "object"
      },
      title: "env",
      type: "array"
    },
    envFromConfigmap: {
      description: "整个配置文件作为环境变量",
      items: {
        type: "string"
      },
      title: "envFromConfigmap",
      type: "array"
    },
    envFromConfigmapRef: {
      description: "引用配置文件中的key对应的value,作为环境变量",
      items: {
        properties: {
          key: {
            description: "配置文件key",
            title: "key",
            type: "string"
          },
          name: {
            description: "环境变量名称",
            title: "name",
            type: "string"
          },
          refName: {
            description: "配置文件名称",
            title: "refName",
            type: "string"
          }
        },
        required: ["name", "refName", "key"],
        type: "object"
      },
      title: "envFromConfigmapRef",
      type: "array"
    },
    envFromFieldRef: {
      description: "引用容器属性作为环境变量",
      items: {
        properties: {
          fieldPath: {
            description: "路径",
            enum: [
              "metadata.name",
              "metadata.namespace",
              "metadata.uid",
              "status.podIP",
              "metadata.nodeName",
              "metadata.hostIP"
            ],
            title: "fieldPath",
            type: "string"
          },
          name: {
            description: "环境变量名称",
            title: "name",
            type: "string"
          }
        },
        required: ["name", "fieldPath"],
        type: "object"
      },
      title: "envFromFieldRef",
      type: "array"
    },
    envFromSecret: {
      description: "整个加密文件作为环境变量",
      items: {
        properties: {
          name: {
            description: "加密文件名称",
            title: "name",
            type: "string"
          }
        },
        required: ["name"],
        type: "object"
      },
      title: "envFromSecret",
      type: "array"
    },
    envFromSecretRef: {
      description: "引用加密配置文件中的key对应的value,作为环境变量",
      items: {
        properties: {
          key: {
            description: "加密文件key",
            title: "key",
            type: "string"
          },
          name: {
            description: "环境变量名称",
            title: "name",
            type: "string"
          },
          refName: {
            description: "配置文件名称",
            title: "refName",
            type: "string"
          }
        },
        required: ["name", "refName", "key"],
        type: "object"
      },
      title: "envFromSecretRef",
      type: "array"
    },
    http: {
      additionalProperties: {
        properties: {
          port: {
            description: "集群内部访问端口",
            format: "int32",
            type: "integer"
          },
          targetPort: {
            description: "容器端口",
            format: "int32",
            type: "integer"
          }
        },
        required: ["targetPort", "port"],
        type: "object"
      },
      description: "路径与端口",
      title: "http",
      type: "object"
    },
    image: {
      default: "KUBEEASE-IMAGE",
      description: "镜像地址",
      title: "image",
      type: "string"
    },
    imagePullSecrets: {
      description: "拉取镜像凭证",
      items: {
        type: "string"
      },
      title: "imagePullSecrets",
      type: "array"
    },
    ingressAnnotations: {
      additionalProperties: {
        type: "string"
      },
      description: "域名访问相关注释",
      title: "ingressAnnotations",
      type: "object"
    },
    livenessProbe: {
      description: "存活性探针",
      properties: {
        initialDelaySeconds: {
          default: 60,
          description: "初始延迟(秒)",
          maximum: 2147483647,
          minimum: -2147483648,
          title: "initialDelaySeconds",
          type: "integer"
        },
        probeConfig: {
          oneOf: [
            {
              properties: {
                command: {
                  description: "命令",
                  items: {
                    type: "string"
                  },
                  type: "array"
                }
              }
            },
            {
              properties: {
                path: {
                  default: "/",
                  description: "路径",
                  type: "string"
                },
                port: {
                  description: "容器端口",
                  type: "integer"
                }
              },
              required: ["path", "port"]
            },
            {
              properties: {
                port: {
                  type: "integer"
                }
              },
              required: ["port"]
            }
          ],
          title: "probeConfig",
          type: "object"
        },
        timeoutSeconds: {
          default: 10,
          description: "超时时间(秒)",
          maximum: 2147483647,
          minimum: -2147483648,
          title: "timeoutSeconds",
          type: "integer"
        }
      },
      required: ["probeConfig", "initialDelaySeconds", "timeoutSeconds"],
      title: "livenessProbe",
      type: "object"
    },
    quotaModel: {
      description: "资源配额",
      title: "quotaModel",
      type: "string"
    },
    readinessProbe: {
      description: "就绪性探针",
      properties: {
        initialDelaySeconds: {
          default: 60,
          description: "初始延迟(秒)",
          maximum: 2147483647,
          minimum: -2147483648,
          title: "initialDelaySeconds",
          type: "integer"
        },
        probeConfig: {
          oneOf: [
            {
              properties: {
                command: {
                  description: "命令",
                  items: {
                    type: "string"
                  },
                  type: "array"
                }
              }
            },
            {
              properties: {
                path: {
                  default: "/",
                  description: "路径",
                  type: "string"
                },
                port: {
                  description: "容器端口",
                  type: "integer"
                }
              },
              required: ["path", "port"]
            },
            {
              allOf: [
                {
                  properties: {
                    port: {
                      description: "容器端口",
                      type: "integer"
                    }
                  },
                  required: ["port"]
                },
                {
                  not: {
                    anyOf: [
                      {
                        properties: {
                          path: {
                            default: "/",
                            description: "路径",
                            type: "string"
                          },
                          port: {
                            description: "容器端口",
                            type: "integer"
                          }
                        },
                        required: ["path", "port"]
                      }
                    ]
                  }
                }
              ]
            }
          ],
          title: "probeConfig",
          type: "object"
        },
        timeoutSeconds: {
          default: 10,
          description: "超时时间(秒)",
          maximum: 2147483647,
          minimum: -2147483648,
          title: "timeoutSeconds",
          type: "integer"
        }
      },
      required: ["probeConfig", "initialDelaySeconds", "timeoutSeconds"],
      title: "readinessProbe",
      type: "object"
    },
    replicas: {
      default: 1,
      description: "副本数",
      maximum: 2147483647,
      minimum: -2147483648,
      title: "replicas",
      type: "integer"
    },
    volumeMountsConfigmap: {
      description: "挂载配置文件",
      items: {
        properties: {
          mountPath: {
            description: "挂载路径",
            title: "mountPath",
            type: "string"
          },
          name: {
            description: "配置文件名称",
            title: "name",
            type: "string"
          },
          readOnly: {
            default: false,
            description: "只读",
            title: "readOnly",
            type: "boolean"
          },
          subPath: {
            description: "子路径",
            title: "subPath",
            type: "string"
          },
          volumeName: {
            description: "挂载名称",
            title: "volumeName",
            type: "string"
          }
        },
        required: ["name", "volumeName", "readOnly", "mountPath"],
        type: "object"
      },
      title: "volumeMountsConfigmap",
      type: "array"
    },
    volumeMountsPvc: {
      description: "挂载磁盘",
      items: {
        properties: {
          mountPath: {
            description: "挂载路径",
            title: "mountPath",
            type: "string"
          },
          name: {
            description: "磁盘名称(空，挂载宿主机上的目录或文件)",
            title: "name",
            type: "string"
          },
          readOnly: {
            default: false,
            description: "只读",
            title: "readOnly",
            type: "boolean"
          },
          subPath: {
            description: "子路径",
            title: "subPath",
            type: "string"
          },
          volumeName: {
            description: "挂载名称",
            title: "volumeName",
            type: "string"
          }
        },
        required: ["volumeName", "readOnly", "mountPath"],
        type: "object"
      },
      title: "volumeMountsPvc",
      type: "array"
    },
    volumeMountsSecret: {
      description: "挂载加密文件",
      items: {
        properties: {
          mountPath: {
            description: "挂载路径",
            title: "mountPath",
            type: "string"
          },
          name: {
            description: "加密文件名称",
            title: "name",
            type: "string"
          },
          readOnly: {
            default: false,
            description: "只读",
            title: "readOnly",
            type: "boolean"
          },
          subPath: {
            description: "子路径",
            title: "subPath",
            type: "string"
          },
          volumeName: {
            description: "挂载名称",
            title: "volumeName",
            type: "string"
          }
        },
        required: ["name", "volumeName", "readOnly", "mountPath"],
        type: "object"
      },
      title: "volumeMountsSecret",
      type: "array"
    }
  },
  required: ["replicas", "image", "http", "quotaModel", "domain"],
  type: "object"
};
