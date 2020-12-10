<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="等级">
          <!-- 自定义行, 获取当前行对象, 然后通过v-if判断当前行的level -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表数据数组
      rightsList: [
        {
          authName: '123',
          path: '123',
          level: '132'
        }
      ]
    }
  },

  created() {
    // 当页面刷新后, 请求接口服务器, 获取所有的权限列表, 并赋值给数据中的权限列表数组: rightsList
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      // 获取权限数据
      const { data: res } = await this.$http.get('rights/list')

      // 赋值给数据中的权限列表数组: rightsList
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped></style>
