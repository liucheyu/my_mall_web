<template>
  <el-dialog
    :title="!dataForm.brandId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="140px"
    >
      <el-form-item label="品牌名" prop="name">
        <el-input v-model="dataForm.name" placeholder="品牌名"></el-input>
      </el-form-item>
      <el-form-item label="品牌logo地址" prop="logo">
        <!-- <el-input v-model="dataForm.logo" placeholder="品牌logo地址"></el-input> -->
        <el-upload
          ref="upload"
          class="upload-demo"
          :auto-upload="true"
          action="#"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :multiple="false"
          :limit="2"
          :on-exceed="handleExceed"
          :on-success="uploadSuccess"
          :file-list="fileList"
          :on-change="uploadFileOnChange"
          list-type="picture"
          :http-request="uploadLogo"
        >
          <el-button size="small" type="primary" @click="selectOnClick"
            >選擇檔案</el-button
          >
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>

        <!-- <el-button size="small" type="primary" @click="uploadLogo"
          >上傳</el-button
        > -->
      </el-form-item>
      <el-form-item label="介绍" prop="descript">
        <el-input v-model="dataForm.descript" placeholder="介绍"></el-input>
      </el-form-item>
      <el-form-item label="显示状态" prop="showStatus">
        <!-- <el-input v-model="dataForm.showStatus" placeholder="显示状态[0-不显示；1-显示]"></el-input> -->
        <el-switch
          v-model="dataForm.showStatus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="检索首字母" prop="firstLetter">
        <el-input
          v-model="dataForm.firstLetter"
          placeholder="检索首字母"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort" >
        <el-input v-model.number="dataForm.sort" placeholder="排序"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import filrebaseUtils from "@/utils/firebaseUtils";

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        brandId: 0,
        name: "",
        logo: "",
        descript: "",
        showStatus: 1,
        firstLetter: "",
        sort: 0,
      },
      dataRule: {
        name: [{ required: true, message: "品牌名不能为空", trigger: "blur" }],
        logo: [
          { required: true, message: "品牌logo地址不能为空", trigger: "blur" },
        ],
        descript: [
          { required: true, message: "介绍不能为空", trigger: "blur" },
        ],
        showStatus: [
          {
            required: true,
            message: "显示状态[0-不显示；1-显示]不能为空",
            trigger: "blur",
          },
        ],
        firstLetter: [
          {
            validator: (rule, value, callback) => {
              if (value == "") {
                callback(new Error("首字母需必填寫"));
              } else if (!/^[a-zA-Z]$/.test(value)) {
                callback(new Error("首字母需為a-z或A-Z"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        sort: [{ 
            validator: (rule, value, callback) => {
              if (value != 0 && value == "") {
                callback(new Error("排序需必填寫"));
              } else if (!Number.isInteger(value) || value < 0) {
                callback(new Error("排序須為正整數"));
              } else {
                callback();
              }
            },
             trigger: "blur" }],
      },
      fileList: [],
      uploadFile: null,
      brandId: "",
      uploadSuccessData: null,
    };
  },
  mounted() {},
  methods: {
    init(id) {
      //console.log(filrebaseUtils.auth.getCurrentUser());
      this.dataForm.brandId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.brandId) {
          this.$http({
            url: this.$http.adornUrl(
              `/mallproduct/brand/info/${this.dataForm.brandId}`
            ),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.brand.name;
              this.dataForm.logo = data.brand.logo;
              this.dataForm.descript = data.brand.descript;
              this.dataForm.showStatus = data.brand.showStatus;
              this.dataForm.firstLetter = data.brand.firstLetter;
              this.dataForm.sort = data.brand.sort;
              this.brandId = data.brand.brandId;
              //console.log(data);
              this.fileList = [
                {
                  name: `brand_${this.dataForm.name}`,
                  url: data.brand.logo,
                },
              ];
            }
          });
        } else {
          this.fileList = [];
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          console.log(this.uploadSuccessData);
          this.$http({
            url: this.$http.adornUrl(
              `/mallproduct/brand/${!this.dataForm.brandId ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              brandId: this.dataForm.brandId || undefined,
              name: this.dataForm.name,
              logo: this.uploadSuccessData.url,
              descript: this.dataForm.descript,
              showStatus: this.dataForm.showStatus,
              firstLetter: this.dataForm.firstLetter,
              sort: this.dataForm.sort,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    handleRemove(file, fileList) {
      this.uploadFile = null;
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      console.log(files);
      console.log(fileList);
      //this.fileList = [files[0]];
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeUpload() {
      this.fileList = [];
    },
    selectOnClick(e) {
      // this.fileList = [];
      // console.log(e);
    },
    uploadFileOnChange(file, fileList) {
      //console.log(file);
      //console.log(fileList);
      this.uploadFile = file;
      this.uploadFile.name = `brand_${this.dataForm.name}`;
      this.fileList = [this.uploadFile];
    },
    uploadSuccess(res, file) {
      this.dataForm.logo = this.uploadSuccessData.url;
    },

    async uploadLogo() {
      if (this.uploadFile != null) {
        //console.log(this.uploadFile);
        this.uploadFile.name = `brand_${this.dataForm.name}`;
        //this.uploadFile.name = `brand_${this.brandId}_${this.dataForm.name}`;
        //this.fileList = [this.uploadFile];
        let crrUser = filrebaseUtils.auth.getCurrentUser();

        if (crrUser) {
          let idToken = await crrUser.getIdToken();
          if (idToken) {
            let { data } = await this.$http({
              url: this.$http.adornUrl(`/thirdparty/check_idtoken`),
              method: "post",
              data: this.$http.adornData({
                idToken: idToken,
              }),
            });

            if (data.code != 0) {
              return;
            }
            this.uploadSuccessData =
              await filrebaseUtils.filebaseUpload.updateFileToFirebase(
                `images/${this.uploadFile.name}`,
                this.uploadFile.raw
              );
            return this.uploadSuccessData;
          }
        }

        //console.log(this.uploadFile);
        console.log("log in by server token and upload");
        let { data } = await this.$http({
          url: this.$http.adornUrl("/thirdparty/storage_token"),
          method: "get",
        });
        if (data && data.code === 0) {
          let cretencial = await filrebaseUtils.auth.signInWithToken(
            data.token
          );
          this.uploadSuccessData =
            await filrebaseUtils.filebaseUpload.updateFileToFirebase(
              `images/${this.uploadFile.name}`,
              this.uploadFile.raw
            );
          return this.uploadSuccessData;
        }
        //fireBaseUpload.updateFileToFirebase();
      }
      //this.$refs.upload;
    },
  },
};
</script>
