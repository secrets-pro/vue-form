<template>
  <div class="test">
    <div style="display:flex;">
      <div style="width:40%;">
        <!-- <el-input type="textarea" :rows="100" v-model="schemaString" /> -->
        <i-input type="textarea" :rows="100" v-model="schemaString" />
      </div>
      <vue-form
        @on-confirm="confirm"
        ref="form"
        :schema="schema"
        :model="model"
        style="min-height:400px;max-width:50%;"
      ></vue-form>
    </div>
 
    <!-- <el-button @click="getData">获取数据</el-button> -->
    <!-- <el-input type="textarea" v-model="data1" :rows="10" /> -->
  </div>
</template>
<script>
import scheme from "./scheme";
export default {
  data() {
    return {
      data1: null,
      active: "2",
      model: {
        // dddd: {
        //   args: [1]
        // }
        domain: "xxxx",
        livenessProbe: {
          initialDelaySeconds: 60,
          timeoutSeconds: 10,
          probeConfig: {
            command: ['1', '2', '3']
          }
        }
      },
      schemaString: JSON.stringify(scheme, null, "\t")
    };
  },
  computed: {
    schema() {
      return JSON.parse(this.schemaString);
    }
  },
  methods: {
    confirm(model) {
      console.log(model);
    },
    getData() {
      let data = this.$refs.form.getData();
      this.data1 = JSON.stringify(data, null, "\t");
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./style.less");
</style>
