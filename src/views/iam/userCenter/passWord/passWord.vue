<template>
  <div>
    <el-form
      style="margin: 20px; width: 80%"
      label-width="100px"
      :model="dialog.user_info"
      :rules="dialog.user_info_rules"
      ref="user_info"
    >
      <el-form-item class="edit-form" label="邮箱" prop="email">
        <el-input
          v-model="dialog.user_info.email"
          disabled
          placeholder="常用邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item class="edit-form" label="用户名称" prop="username">
        <el-input
          v-model="dialog.user_info.username"
          disabled
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item class="edit-form" label="当前密码" prop="old_password">
        <el-input
          type="password"
          placeholder="当前密码"
          auto-complete="off"
          v-model="dialog.user_info.old_password"
        ></el-input>
      </el-form-item>
      <el-form-item class="edit-form" label="新密码" prop="password">
        <el-input
          type="password"
          placeholder="新密码"
          auto-complete="off"
          v-model="dialog.user_info.password"
        ></el-input>
      </el-form-item>
      <el-form-item class="edit-form" label="确认密码" prop="password_confirm">
        <el-input
          type="password"
          placeholder="确认密码"
          auto-complete="off"
          v-model="dialog.user_info.password_confirm"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button style="margin: 20px 50px" @click="updUserPass('user_info')">确定</el-button>
  </div>
</template>
<script>
import PassWord from "./passWord.js";
export default PassWord;
</script>
<style scoped>
</style>