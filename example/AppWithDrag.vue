<template>
  <draggable
    v-model="myArray"
    group="people"
    @start="drag = true"
    @end="drag = false"
  >
    <transition-group>
      <div class="div" v-for="element in myArray" :key="element.id">
        {{ element.name }}
      </div>
    </transition-group>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
  data() {
    return {
      myArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el) => ({
        name: el,
        id: el
      }))
    };
  }
};
</script>

<style lang="less" scoped>
.div {
  padding: 6px 12px;
  display: block;
  background: grey;
  & + .div {
    margin-top: 12px;
  }
}
</style>
