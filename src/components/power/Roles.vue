<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域
      1: 注册点击事件, 点击后显示添加角色对话框
       -->
      <el-row>
        <el-button type="primary" @click="showAddRolesDialog"
          >添加角色</el-button
        >
      </el-row>
      <!-- 角色表格区域 -->
      <template>
        <el-table :data="rolesList" border stripe>
          <!-- 展开行 -->
          <el-table-column type="expand">
            <!-- 自定义行获取当前角色 -->
            <template slot-scope="scope">
              <!-- 一级权限
              row行的形式遍历当前行(当前角色) 里面的children(当前角色的权限)
              在行中, 当行添加上边框
              判断当前遍历出的行, 如果是第一行, 则不需要添加上边框
               -->
              <el-row
                :class="[i1 !== 0 ? 'bdtop' : '']"
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id"
              >
                <!-- 这一列展示一级权限的名字 -->
                <el-col :span="5">
                  <el-tag
                    type="primary"
                    closable
                    @close="removeRight(scope.row, item1.id)"
                  >
                    {{ item1.authName }}
                  </el-tag>
                </el-col>

                <!-- 这一列表示二级和三级权限区域 -->
                <el-col :span="19">
                  <!-- 二级权限, row/行的形式来遍历当前数组的children
                  给遍历出来的二级权限行添加下边框, 只要不是最后一项
                   -->
                  <el-row
                    :class="[
                      item1.children.length - 1 !== i2 ? 'bdbottom' : ''
                    ]"
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                  >
                    <!-- 这一列显示二级菜单的名字 -->
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="removeRight(scope.row, item2.id)"
                      >
                        {{ item2.authName }}
                      </el-tag>
                    </el-col>

                    <!-- 这一列放置三级菜单 -->
                    <el-col :span="18">
                      <!-- 里面放tag, 去便利二级菜单的children数组来获取所有的三级权限 -->
                      <!-- 当点击删除三级权限后, 传递当前行的角色和当前三级权限的id过去 -->
                      <el-tag
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        closable
                        @close="removeRight(scope.row, item3.id)"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 序号列 -->
          <el-table-column label="#" type="index"></el-table-column>
          <!-- 角色名称 -->
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <!-- 角色描述 -->
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" border>
            <!-- 自定义行 -->
            <template slot-scope="scope">
              <!-- 编辑当前角色 -->
              <el-button icon="el-icon-edit" type="primary" size="mini"
                >编辑</el-button
              >

              <!-- 删除当前角色 -->
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                @click="deleteRoles(scope.row)"
                >删除</el-button
              >

              <!-- 分配当前角色的权限
              1. 点击分配
               -->
              <el-button
                icon="el-icon-setting"
                type="warning"
                size="mini"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 角色列表分页区域
      1: @size-change - 页码大小改变后
      2: @current-change - 当前页改变后
      3: :current-page - 当前页
      4: :page-sizes - 页码大小
      5: :total - 数据总数
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @closed="addRolesDialogClosed"
    >
      <!-- 添加角色表单
      :model="addRolesForm" - 把添加角色表单的数据和addRolesForm对象关联
      :rules="addRolesRules" - 添加角色表单的验证规则对象
      prop: 指定input的验证规则, 获取到:rules中的验证规则对象中的属性
      v-model: 把input表单的值和addRolesForm表单数据对象做双重数据绑定
       -->
      <el-form
        :model="addRolesForm"
        :rules="addRolesRules"
        ref="addRolesRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框
    1: 当当前行对象的分配权限对话框关闭事件触发后, 去清空/重置树形权限列表默认选中ids的数组
     -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @closed="setRightDialogClosed"
    >
      <!-- 展示权限的树形控件
      1: :data="rightTree" - rightTree数据数组的所有权限列表的数据和树形控件做绑定
      2: :props="treeConfig" - 配置选项, 结构和显示的文字label
      3: :default-checked-keys="defaultCheckedKeys" - 默认选中的节点的数组
       -->
      <el-tree
        :data="rightsTree"
        :props="treeConfig"
        ref="rightsTreeRef"
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        show-checkbox
      ></el-tree>

      <!-- 当点击角色授权后, 获取到当前树形控件的默认选中/半选的节点, 请求接口 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据数组
      rolesList: [
        {
          roleName: '主管',
          roleDesc: '技术负责人'
        }
      ],

      // 添加角色对话框的显示/隐藏
      addRolesDialogVisible: false,

      // 添加用户表单对象
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },

      // 添加用户验证对象
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ]
      },

      // 分页对象 - 里面有分页数据
      pageInfo: {
        // 当前页码
        pagenum: 1,

        // 页码大小
        pagesize: 2,

        // 角色的数据总量
        total: 10
      },

      // 控制显示/隐藏分配权限对话框
      setRightDialogVisible: false,

      // 树形权限列表的数据数组
      rightsTree: [],

      // 树形权限列表的配置选项
      // 展开项以children作为关联, 显示的文字则是authName提供
      treeConfig: {
        children: 'children',
        label: 'authName'
      },

      // 树形权限列表的默认选中节点的数组
      defaultCheckedKeys: [],

      // 当前角色的id
      roleId: ''
    }
  },

  created() {
    // 页面刷新, 在生命周期函数中读取所有的角色信息
    this.getRolesList()
  },
  methods: {
    // 获取所有的权限列表
    async getRolesList() {
      // 请求接口, 读取所有的角色信息数组, 赋值给数据中的rolesList
      const { data: res } = await this.$http.get('roles')

      // 把获取到的res.data - 角色数组的长度 赋值给分页的total
      this.pageInfo.total = res.data.length

      if (res.meta.status !== 200) {
        this.$message({
          type: 'danger',
          message: '获取角色列表失败!',
          duration: 800
        })
      }
      this.rolesList = res.data
    },

    // 显示添加角色对话框的方法
    showAddRolesDialog() {
      this.addRolesDialogVisible = true
    },

    // 监听添加角色对话框的关闭
    addRolesDialogClosed() {
      // 当关闭以后, 找到添加角色表单, 调用方法, 重置表单的数据
      this.$refs.addRolesRef.resetFields()
    },

    // 角色点击添加角色
    addRoles() {
      // 1. 找到添加角色表单, 再次验证角色输入的信息是否符合格式, 如果是, 再去请求接口, 添加角色
      this.$refs.addRolesRef.validate(async validate => {
        if (!validate) {
          // 弹出信息, 代码到此位置
          return this.$message({
            type: 'danger',
            message: '格式错误, 请重新输入!',
            duration: 800
          })
        }

        // 获取数据中addRolesForm表单对象的数据, 请求接口
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message({
            type: 'danger',
            message: '添加角色失败!',
            duration: 800
          })
        }

        // 提示信息
        this.$message({
          type: 'success',
          message: '添加角色成功!',
          duration: 800
        })

        // 关闭添加角色对话框
        this.addRolesDialogVisible = false

        // 读取角色列表
        this.getRolesList()
      })
    },

    // 页码大小改变后
    handleSizeChange(newSize) {},

    // 当前页改变后
    handleCurrentChange(newPage) {
      //
    },

    // 删除指定角色的指定权限
    async removeRight(role, rightId) {
      // 给与提示, 确认要删除权限吗
      try {
        const confirmRes = await this.$confirm(
          '确认删除该权限吗, 是否继续?',
          '提示',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        if (confirmRes) {
          // 确认删除
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )

          if (res.meta.status !== 200) {
            return this.$message({
              type: 'danger',
              message: '删除权限失败',
              duration: 800
            })
          }

          // 删除权限成功, 提示消息
          this.$message({
            type: 'success',
            message: '删除权限成功',
            duration: 800
          })

          // 把获取到的res的data赋值给当前行的children, 达到刷新权限列表的作用
          role.children = res.data
        }
      } catch (error) {
        this.$message({
          type: 'danger',
          message: '取消删除该权限',
          duration: 800
        })
      }
    },

    // 显示分配权限对话框
    async showSetRightDialog(role) {
      // 在点击了分配权限对话框后, 在显示对话框前, 请求接口, 获取树形权限列表的数据数组, 赋值给树形权限列表的数据数组 rightsTree
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'danger',
          message: '获取树形权限列表失败',
          duration: 800
        })
      }

      // 保存当前角色的id到数据中
      this.roleId = role.id

      this.rightsTree = res.data

      // 通过自定义行, 接收当前行的对象, 然后传递当前行, 和默认选中节点数组到一个递归函数中, 遍历当前行对象, 获取到第三级权限的id数据, 保存到树形权限列表的默认节点数组中, 这样就把当前行对象的默认勾选完成了
      this.getLeafIds(role, this.defaultCheckedKeys)

      this.setRightDialogVisible = true
    },

    // 递归, 获取当前行节点对象的第三级权限的ids, 添加到树形权限列表的默认选中节点的数组中
    getLeafIds(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      // 不是第三级节点, 继续调用自身函数, 直到第三级节点为止
      node.children.forEach(item => this.getLeafIds(item, arr))
    },

    // 当分配权限对话框关闭后, 清空树形权限列表默认选中ids数组
    setRightDialogClosed() {
      this.defaultCheckedKeys = []
    },

    // 点击确定, 角色授权权限
    async setRight() {
      // 获取树形控件默认选中/半选中的ids
      let rids = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ]
      rids = rids.join(',')

      // 请求接口服务器, 更新当前角色的权限
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: rids
        }
      )

      if (res.meta.status !== 200) {
        // 更新失败
        return this.$message({
          type: 'danger',
          message: '更新角色权限失败!',
          duration: 800
        })
      }

      // 更新角色权限成功
      // 1. 显示提示信息
      this.$message({
        type: 'success',
        message: '更新角色权限成功!',
        duration: 800
      })

      // 2. 隐藏分配权限对话框
      this.setRightDialogVisible = false

      // 3. 重新获取权限列表
      this.getRolesList()
    },

    // 删除当前角色
    async deleteRoles(role) {
      try {
        const confirmRes = await this.$confirm(
          '此操作将永久删除该角色, 是否继续?',
          '提示',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        if (confirmRes) {
          const { data: res } = await this.$http.delete(`roles/${role.id}`)

          if (res.meta.status !== 200) {
            return this.$message({
              type: 'danger',
              message: '删除当前角色失败',
              duration: 800
            })
          }

          // 提示信息
          this.$message({
            type: 'success',
            message: '删除当前角色成功',
            duration: 800
          })

          // 调用获取角色列表
          this.getRolesList()
        }
      } catch (error) {
        this.$message({
          type: 'danger',
          message: '已取消删除当前角色',
          duration: 800
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 菜单显示名字的el-tag做间隔
.el-tag {
  margin: 7px;
}

// 上边框
.bdtop {
  border-top: 1px solid #eee;
}

// 下边框
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
