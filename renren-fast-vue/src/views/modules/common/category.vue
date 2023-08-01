<template>
  <el-tree
    :data="menus"
    :props="defaultProps"
    node-key="catId"
    ref="menuTree"
    @node-click="nodeClick"
  >
  </el-tree>
</template>

<script>
export default {
  data() {
    return {
      menus: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      expandedKeys: [],
    };
  },
  methods: {
    getMenus() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/mallproduct/category/list/tree"),
        method: "get",
      }).then(({ data }) => {
        this.menus = data.data;
      });
    },
    nodeClick(data, node, selfComp) {
      //console.log("節點被點擊", data, node, selfComp);
      this.$emit("tree-node-click", data, node, selfComp)
    },
  },
  created() {
    this.getMenus();
  },
};
</script>

<style>
</style>