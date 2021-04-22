export default {
  properties: {
    args: {
      description: '{"title":"参数"}',
      items: {
        type: "string"
      },
      title: "args",
      type: "array"
    },
    cmd: {
      description: '{"title":"命令"}',
      items: {
        type: "string"
      },
      title: "cmd",
      type: "array"
    },
    domain: {
      description: '{"title":"域名"}',
      title: "domain",
      type: "string"
    },
    env: {
      description: '{"title":"环境变量"}',
      items: {
        properties: {
          name: {
            description: '{"title":"名称"}',
            pattern: "^[-._a-zA-Z][-._a-zA-Z0-9]*$",
            title: "name",
            type: "string"
          },
          value: {
            description: '{"title":"值"}',
            title: "value",
            type: "string"
          }
        },
        required: ["name", "value"],
        type: "object"
      },
      title: "env",
      type: "array"
    },
    envFromConfigmap: {
      description: '{"title":"整个配置文件作为环境变量"}',
      items: {
        type: "string"
      },
      title: "envFromConfigmap",
      type: "array"
    },
    envFromConfigmapRef: {
      description: '{"title":"引用配置文件中的key对应的value,作为环境变量"}',
      items: {
        properties: {
          key: {
            description: '{"title":"配置文件key"}',
            title: "key",
            type: "string"
          },
          name: {
            description: '{"title":"环境变量名称"}',
            pattern: "^[-._a-zA-Z][-._a-zA-Z0-9]*$",
            title: "name",
            type: "string"
          },
          refName: {
            description: '{"title":"配置文件名称"}',
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
            description: '{"title":"路径"}',
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
            description: '{"title":"环境变量名称"}',
            pattern: "^[-._a-zA-Z][-._a-zA-Z0-9]*$",
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
      description: '{"title":"整个加密文件作为环境变量"}',
      items: {
        type: "string"
      },
      title: "envFromSecret",
      type: "array"
    },
    envFromSecretRef: {
      description:
        '{"title":"引用加密配置文件中的key对应的value,作为环境变量"}',
      items: {
        properties: {
          key: {
            description: '{"title":"加密文件key"}',
            title: "key",
            type: "string"
          },
          name: {
            description: '{"title":"环境变量名称"}',
            pattern: "^[-._a-zA-Z][-._a-zA-Z0-9]*$",
            title: "name",
            type: "string"
          },
          refName: {
            description: '{"title":"配置文件名称"}',
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
            default: 80,
            description: '{"title":"集群内部访问端口"}',
            exclusiveMaximum: true,
            exclusiveMinimum: true,
            maximum: 65536,
            minimum: 0,
            type: "number"
          },
          targetPort: {
            default: 80,
            description: '{"title":"容器端口"}',
            exclusiveMaximum: true,
            exclusiveMinimum: true,
            maximum: 65536,
            minimum: 0,
            type: "number"
          }
        },
        required: ["port", "targetPort"],
        type: "object"
      },
      description: '{"title":"路径与端口"}',
      title: "http",
      type: "object"
    },
    image: {
      default: "KUBEEASE-IMAGE",
      description: '{"title":"镜像地址","description":"镜像地址"}',
      title: "image",
      type: "string"
    },
    imagePullSecrets: {
      description: '{"title":"拉取镜像凭证"}',
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
      description: '{"title":"域名访问相关注释"}',
      title: "ingressAnnotations",
      type: "object"
    },
    livenessProbe: {
      description: '{"title":"存活性探针"}"}',
      properties: {
        probeConfig: {
          description: '{"title":"探针类型"}',
          title: "probeConfig",
          type: "object"
        }
      },
      required: ["probeConfig"],
      title: "livenessProbe",
      type: "object"
    },
    quotaModel: {
      description:
        '{"title":"配额","description":"用于指定容器需要的最小、最大cpu内存配置，通过配额管理配置模板","url":"/argo/v4/tenants/{tenantName}/projects/{projectName}/quota-model/list?cluster={cluster}","type":"select","key":"id","show":"name","return":"jsonStr"}',
      title: "quotaModel",
      type: "string"
    },
    readinessProbe: {
      description: '{"title":"就绪性探针"}',
      properties: {
        initialDelaySeconds: {
          default: 60,
          description: '{"title":"初始延迟(秒)"}',
          maximum: 2147483647,
          minimum: -2147483648,
          title: "initialDelaySeconds",
          type: "integer"
        },
        probeConfig: {
          description: '{"title":"探针类型"}',
          title: "probeConfig",
          type: "object"
        },
        timeoutSeconds: {
          default: 10,
          description: '{"title":"超时时间(秒)"}',
          maximum: 2147483647,
          minimum: -2147483648,
          title: "timeoutSeconds",
          type: "integer"
        }
      },
      required: ["initialDelaySeconds", "timeoutSeconds", "probeConfig"],
      title: "readinessProbe",
      type: "object"
    },
    replicas: {
      default: 1,
      description: '{"title":"副本数"}',
      exclusiveMinimum: true,
      maximum: 2147483647,
      minimum: 0,
      title: "replicas",
      type: "integer"
    },
    volumeMountsConfigmap: {
      description: '{"title":"挂载配置文件"}',
      items: {
        properties: {
          mountPath: {
            description: '{"title":"挂载路径"}',
            title: "mountPath",
            type: "string"
          },
          name: {
            description: '{"title":"配置文件名称"}',
            title: "name",
            type: "string"
          },
          readOnly: {
            default: false,
            description: '{"title":"只读"}',
            title: "readOnly",
            type: "boolean"
          },
          subPath: {
            description: '{"title":"子路径"}',
            title: "subPath",
            type: "string"
          },
          volumeName: {
            description: '{"title":"挂载名称"}',
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
      description: '{"title":"挂载磁盘"}',
      items: {
        properties: {
          mountPath: {
            description: '{"title":"挂载路径"}',
            title: "mountPath",
            type: "string"
          },
          name: {
            description: '{"title":"磁盘名称(空代表挂载宿主机上的目录或文件)"}',
            title: "name",
            type: "string"
          },
          readOnly: {
            default: false,
            description: '{"title":"只读"}',
            title: "readOnly",
            type: "boolean"
          },
          subPath: {
            description: '{"title":"子路径"}',
            title: "subPath",
            type: "string"
          },
          volumeName: {
            description: '{"title":"挂载名称"}',
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
      description: '{"title":"挂载加密文件"}',
      items: {
        properties: {
          mountPath: {
            description: '{"title":"挂载路径"}',
            title: "mountPath",
            type: "string"
          },
          name: {
            description: '{"title":"加密文件名称"}',
            title: "name",
            type: "string"
          },
          readOnly: {
            default: false,
            description: '{"title":"只读"}',
            title: "readOnly",
            type: "boolean"
          },
          subPath: {
            description: '{"title":"子路径"}',
            title: "subPath",
            type: "string"
          },
          volumeName: {
            description: '{"title":"挂载名称"}',
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
