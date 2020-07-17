<template>
  <div class="test">
    <vue-form ref="form" :schema="schema"></vue-form>
  </div>
</template>
<script>
import scheme from './scheme';
export default {
  data() {
    return {
      schema: scheme
    };
  }
};
</script>
<style lang="less" scoped>
@import url('./style.less');
</style>
