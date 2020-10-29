<template>
  <div class="test">
    <vue-form
      @on-confirm="confirm"
      ref="form"
      :schema="schema"
      style="min-height:400px;"
    ></vue-form>
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
