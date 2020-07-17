export default {
  title: 'basic',
  type: 'object',
  buttons: ['confirm'],
  properties: {
    name: {
      type: 'string',
      title: '姓名'
    },
    school: {
      title: '学校',
      type: 'object',
      properties: {
        address: {
          title: '地址',
          type: 'string'
        },
        category: {
          title: '等级',
          type: 'select',
          options: [
            {
              label: '高中',
              value: 'major'
            },
            {
              label: '初中',
              value: 'minor'
            }
          ]
        }
      }
    },
    type: {
      type: 'select',
      title: '类型',
      options: [
        {
          label: '类型1',
          value: 'type1'
        },
        {
          label: '类型2',
          value: 'type2'
        }
      ]
    },
    radio: {
      type: 'radio',
      title: '类型',
      options: [
        {
          label: '类型1',
          value: 'type1'
        },
        {
          label: '类型2',
          value: 'type2'
        }
      ]
    },
    date: {
      type: 'date',
      title: '生日'
    },
    secrets: {
      type: 'array',
      title: '密钥',
      items: {
        type: 'string'
      }
    },
    headers: {
      type: 'object' // get a basic object
    },
    key: {
      // like a select
      enum: [
        'remote_addr',
        'server_addr',
        'http_x_real_ip',
        'http_x_forwarded_for'
      ],
      type: 'string'
    },
    rejected_code: {
      default: 201,
      minimum: 200, //minimum maximum
      type: 'integer'
    },
    configmaps: {
      type: 'array',
      title: '挂载',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: '名称'
          },
          path: {
            type: 'string',
            title: '路径'
          }
        }
      }
    },
    code: {
      title: '代码编辑',
      type: 'editor',
      language: 'json' //javascript', 'css', 'html', 'typescript', 'json
    }
  },
  required: ['name', 'phone']
};
