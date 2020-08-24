<template>
  <div class="test">
    {{ active }}
    <ul class="ul">
      <li
        v-for="item of menus"
        :key="item"
        @click="active = item"
        :class="{ active: active == item }"
      >
        <div>{{ item }}</div>
      </li>
    </ul>
    <transition-group name="list" tag="div" mode="out-in">
      <div v-for="item of menus" :key="item + 'form'" v-show="item == active">
        <vue-form
          @on-confirm="confirm"
          :ref="item"
          :schema="schema"
          :show="item == active"
          style="min-height:400px;"
        ></vue-form>
      </div>
    </transition-group>
    <!-- {{ active }}
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
    </el-collapse> -->
  </div>
</template>
<script>
import scheme from "./scheme";
export default {
  data() {
    return {
      menus: ["test1", "test2"],
      active: "test1",
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
.ul {
  list-style: none;
  border: 1px solid #ccc;
  & > li {
    display: inline-block;
    padding: 6px 12px;
    background: #ccc;
    cursor: pointer;
    &.active {
      background: yellow;
    }
  }
}
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translate3d(-60px, 0, 0);
}
</style>
