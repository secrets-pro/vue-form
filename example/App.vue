<template>
  <!-- element-ui -->

  <div class="test">
    <div
      style="display:flex;height: 100%;justify-content: space-between;align-items: center;"
    >
      <div class="schema-input">
        <el-input
          style="height: 100%;"
          type="textarea"
          v-model="schemaString"
        ></el-input>
      </div>
      <div>
        <el-button @click="getData" type="primary">获取数据</el-button>
      </div>
      <div class="right">
        <vue-form
          readonly
          @on-confirm="confirm"
          :initinal="true"
          ref="form"
          :schema="schema"
          :model="model"
          :split="false"
        ></vue-form>
        <div class="data-input">
          <el-input
            style="height: 100%;"
            type="textarea"
            v-model="data1"
          ></el-input>
        </div>
      </div>
    </div>
  </div>

  <!-- iview -->

  <!-- <div class="test">
    <div style="display:flex;height: 100%;justify-content: space-between;align-items: center;">
      <div class="schema-input">
        <i-input style="height: 100%;" type="textarea" v-model="schemaString"></i-input>
      </div>
      <div>
        <i-button @click="getData" type="primary">获取数据</i-button>
      </div>
      <div class="right">
        <vue-form
          @on-confirm="confirm"
          :initinal="true"
          ref="form"
          :schema="schema"
          :model="model"
          :split="false"
        ></vue-form>
        <div class="data-input">
          <i-input style="height: 100%;" type="textarea" v-model="data1"></i-input>
        </div>
      </div>
    </div>
  </div> -->
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
            command: ["1", "2", "3"],
            type: "EXEC"
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
      this.$refs.form.validate().then(el => {
        let data = this.$refs.form.getData();
        this.data1 = JSON.stringify(data, null, "\t");
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./style.less");
</style>
