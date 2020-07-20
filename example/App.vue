<template>
  <div class="test">
    {{ active }}
    <el-collapse v-model="active" accordion>
      <el-collapse-item title="一致性 Consistency" name="1">
        <vue-form
          @on-confirm="confirm"
          ref="form"
          :schema="schema"
          v-if="active == '1'"
          style="min-height:400px;"
        ></vue-form>
      </el-collapse-item>
      <el-collapse-item title="反馈 Feedback" name="2">
        <div>
          控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
        </div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import scheme from "./scheme";
export default {
  data() {
    return {
      active: "2",
      schema: scheme
    };
  },
  methods: {
    confirm(model) {
      console.log(model);
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./style.less");
</style>
