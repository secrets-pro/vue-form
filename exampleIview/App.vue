<template>
  <div class="test">
    {{ model }}
    <i-button @click="setModal" type="primary">setModal</i-button>
    <div style="display:flex;">
      <div style="width:40%;">
        <!-- <el-input type="textarea" :rows="100" v-model="schemaString" /> -->
        <i-input type="textarea" :rows="100" v-model="schemaString" />
      </div>
      <vue-form
        @on-confirm="confirm"
        :split="false"
        ref="form"
        :schema="schema"
        :model="model"
        style="min-height:400px;max-width:50%;"
      ></vue-form>
    </div>

    <i-button @click="getData">获取数据</i-button>
    <!-- <el-input type="textarea" v-model="data1" :rows="10" /> -->
  </div>
</template>
<script>
import scheme from "../example/scheme";
export default {
  data() {
    return {
      data1: null,
      active: "2",
      model: {},
      schemaString: JSON.stringify(scheme, null, "\t")
    };
  },
  computed: {
    schema() {
      return JSON.parse(this.schemaString);
    }
  },
  methods: {
    setModal() {
      this.model = {
        replicasType: {
          cpu: 1,
          cpuUnit: "%",
          customExpressions: [{ criticalValue: 0, expression: "xx" }],
          maxReplicas: 1,
          memory: 0,
          memoryUnit: "Mi",
          minReplicas: 1,
          qps: 0
        }
      };
    },
    confirm(model) {
      // console.log(model);
    },
    async getData() {
      let data = await this.$refs.form.validate();
      console.log(data);
      if (data) {
        let data1 = this.$refs.form.getData();
        console.log(data1);
      }
      // this.data1 = JSON.stringify(data, null, "\t");
    }
  }
};
</script>
