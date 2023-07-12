<template>
  <div>
    <el-tree
      :data="menus"
      :props="defaultProps"
      :expand-on-click-node="false"
      :show-checkbox="true"
      node-key="catId"
      :default-expanded-keys="expandedKeys"
      draggable
      :allow-drop="allowDrop"
      @node-drop="handleDropCheck"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="data.catLevel <= 2"
            type="text"
            size="mini"
            @click="() => append(data)"
          >
            Append
          </el-button>
          <el-button type="text" size="mini" @click="() => edit(data)">
            Edit
          </el-button>
          <el-button
            v-if="data.children.length == 0"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="category">
        <el-form-item label="分類名稱">
          <el-input v-model="category.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分類圖標">
          <el-input v-model="category.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="計量單位">
          <el-input
            v-model="category.productUnit"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      menus: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      expandedKeys: [],
      dialogVisible: false,
      dialogType: "",
      category: {
        name: "",
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        catId: null,
        icon: "",
        productUnit: "",
      },
      updateNodes: [],
    };
  },
  methods: {
    getMenus() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/mallproduct/category/list/tree"),
        method: "get",
        //   params: this.$http.adornParams({
        //     'page': this.pageIndex,
        //     'limit': this.pageSize,
        //     'roleName': this.dataForm.roleName
        //   })
      }).then(({ data }) => {
        console.log("成功取得menu列表: ", data.data);
        this.menus = data.data;
        this.dataListLoading = false;
      });
    },
    append(data) {
      this.title = "增加Menu項目";
      this.dialogType = "add";
      this.dialogVisible = true;

      this.category.name = "";
      this.category.showStatus = 1;
      this.category.sort = 0;
      this.category.icon = "";
      this.category.productUnit = "";

      this.category.parentCid = data.catId;
      this.category.catLevel = data.catLevel + 1;
      console.log("增加節點: ", data);
    },

    remove(node, data) {
      let ids = [data.catId];

      this.$confirm(`是有要刪除此menu項目: ${data.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/mallproduct/category/delete"),
            method: "post",
            data: this.$http.adornData(ids, false),
          }).then(({ data }) => {
            this.$message({
              message: "Menu項目刪除成功",
              type: "success",
            });
            this.getMenus();
            this.expandedKeys = [node.parent.data.catId];
          });
        })
        .catch(() => {});
      console.log("刪除節點: ", node, data);
    },
    edit(data) {
      this.title = "編輯Menu項目";
      this.dialogType = "edit";

      this.$http({
        url: this.$http.adornUrl(`/mallproduct/category//info/${data.catId}`),
        method: "get",
        //   params: this.$http.adornParams({
        //     'page': this.pageIndex,
        //     'limit': this.pageSize,
        //     'roleName': this.dataForm.roleName
        //   })
      }).then(({ data }) => {
        this.category.name = data.data.name;
        this.category.productUnit = data.data.productUnit;
        this.category.icon = data.data.icon;
        this.category.catId = data.data.catId;

        this.category.parentCid = data.data.parentCid;
        console.log("編輯前確認資訊: ", data);
        this.dialogVisible = true;
      });

      console.log("編輯節點: ", data);
    },
    submitData() {
      if (this.dialogType == "add") {
        this.addCategory();
      }

      if (this.dialogType == "edit") {
        this.editCategory();
      }
    },
    addCategory() {
      console.log("增加分類項: ", this.category);
      this.$http({
        url: this.$http.adornUrl("/mallproduct/category/save"),
        method: "post",
        data: this.$http.adornData(this.category, false),
      }).then(({ data }) => {
        this.$message({
          message: "Menu項目儲存成功",
          type: "success",
        });
        this.dialogVisible = false;
        this.getMenus();
        this.expandedKeys = [this.category.parentCid];
      });
    },
    editCategory() {
      let { name, productUnit, icon, catId } = this.category;
      this.$http({
        url: this.$http.adornUrl("/mallproduct/category/update"),
        method: "post",
        data: this.$http.adornData({ name, productUnit, icon, catId }, false),
      }).then(({ data }) => {
        this.$message({
          message: "Menu項目修改成功",
          type: "success",
        });
        this.dialogVisible = false;
        this.getMenus();
        this.expandedKeys = [this.category.parentCid];
      });
    },
    //拖移時的判斷
    allowDrop(draggingNode, dropNode, type) {
      //console.log(draggingNode, dropNode, type);
      let deep = this.getNodeDeep(draggingNode.data);
      //console.log("node deep", deep);
      if (type == "inner") {
        return dropNode.data.catLevel + deep <= 3;
      }

      return dropNode.data.catLevel - 1 + deep <= 3;
    },
    //遞歸取得節點深度
    getNodeDeep(node) {
      let deep = 1;
      if (node.children != null && node.children.length > 0) {
        let crrDeep = 0;
        for (let i = 0; i < node.children.length; i++) {
          let childDeep = this.getNodeDeep(node.children[i]);
          if (childDeep > crrDeep) {
            crrDeep = childDeep;
          }
        }
        deep += crrDeep;
      }

      return deep;
    },
    handleDropCheck(draggingNode, dropNode, dropType, ev) {
       this.$confirm("是否要進行批次修改？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
         this.handleDrop(draggingNode, dropNode, dropType, ev);
        })
        .catch(() => {
         this.getMenus();         
        console.log("拖曳修改取消");
        });
    },
    //拖移成功時的判斷
    handleDrop(draggingNode, dropNode, dropType, ev) {
      let parentId = 0;
      let sibling;
      if (dropType == "inner") {
        parentId = dropNode.data.catId;
        sibling = dropNode.childNodes;
      } else {
        parentId = dropNode.data.parentCid;
        sibling = dropNode.parent.childNodes;
      }
      console.log("dropNode", dropNode);
      //console.log("sibling", sibling);
      //只須更新必要資訊，所以新增一陣列填入更新的id和資訊
      this.updateNodes = [];
      for (let i = 0; i < sibling.length; i++) {
        if (sibling[i].data.catId == draggingNode.data.catId) {
          //console.log(draggingNode.level , sibling[i].level);
          //層級有改動時，子節點的層級也需改動
          if (draggingNode.level != sibling[i].level) {
            this.changeChildrenLevel(sibling[i]);
          }

          this.updateNodes.push( {
            catId: sibling[i].data.catId,
            parentCid: parentId,
            sort: i,
            catLevel: sibling[i].level,
          });
        } else {
          this.updateNodes.push({ catId: sibling[i].data.catId, sort: i });
        }
      }

      console.log("update更新後節點資料: ",  this.updateNodes);
        this.$http({
        url: this.$http.adornUrl("/mallproduct/category/update/batch"),
        method: "post",
        data: this.$http.adornData(this.updateNodes, false),
      }).then(({ data }) => {
        this.$message({
          message: "Menu項目批次修改成功",
          type: "success",
        });
       
        this.getMenus();
        this.expandedKeys = [parentId];
      });
    },
    changeChildrenLevel(node) {     
      //console.log(node);
      if (node.childNodes != null && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          let child = node.childNodes[i];
          this.updateNodes.push({catId: child.data.catId, catLevel:   child.level});
          this.changeChildrenLevel(child);
        }
      }
    },
  },
  created() {
    this.getMenus();
  },
};
</script>
<style>
</style>