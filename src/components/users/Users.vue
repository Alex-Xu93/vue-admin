<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片主体区域 -->
    <el-card class="box-card">
      <el-row>
        <!-- 搜索框
        1: 把搜索框和queryInfo的query做双重数据绑定
        2: 给按钮注册点击事件, 点击搜索后, 因为queryInfo的query已经发生了改变-双重数据绑定, 所以再次请求用户列表即可
        3: 清空状态绑定 - 当input输入框的内容内清空后, 说明queryInfo的query属性也被清空了, 再次请求用户列表方法即可
         -->
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮
        1: 点击添加用户后, 调用方法去更改addUserDialogVisible的值
         -->
        <el-col :span="4">
          <el-button type="primary" @click="showAddUserDialog"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户表格区域 -->
      <template>
        <!--
            userTableData: 把当前el-table表格的数据和userTableData做绑定
            prop: 对应对象中的键名, 注入数据
            label: 当前列的名称
           -->
        <el-table :data="userlist" style="width: 100%" stripe border>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="username" label="姓名"> </el-table-column>
          <el-table-column prop="email" label="邮箱"> </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="role_name" label="角色"> </el-table-column>
          <el-table-column label="状态">
            <!-- 自定义行
            1: 开关的双重数据绑定到当前自定义行的对象上
            2: 当switch开关的状态改变后, 传递当前自定义行的对象过去, 接收
             -->
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="stateChanged(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <!-- 自定义行 -->
            <template slot-scope="scope">
              <!-- 修改当前用户
              1: 当点击修改用户按钮后, 触发事件, 更改editDialogVisible的值为true, 显示编辑用户对话框
               -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                plain
                size="mini"
                @click="showEditDialog(scope.row)"
              ></el-button>

              <!-- 删除当前用户
              1: 点击删除当前用户按钮后, 通过自定义插槽, 传递当前行对象到事件中, 弹窗显示确认框, 点击确认后再请求后台进行删除操作
               -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                plain
                size="mini"
                @click="deleteUser(scope.row.id)"
              ></el-button>

              <el-tooltip
                :enterable="false"
                effect="dark"
                content="分配当前用户权限"
                placement="top"
              >
                <!-- 分配当前用户权限 -->
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  plain
                  size="mini"
                  @click="showsetUserRoleDialog(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页区域
      1: page-size - 每页显示条目个数
      2: total - 总条目数
      3: current-page - 当前页数
      4: page-sizes - 每页显示个数
      3: size-change - pageSize 改变时会触发
      4: current-change = currentPage 改变时会触发
       -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框
    1: 当添加用户对话框关闭后, 触发close事件, 找到addUserRef这个表单, 清空内容和错误样式
     -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="resetAddUserForm"
    >
      <!-- 表单
      :model - 和数据中的addUserForm用户对象做数据绑定
      :rules - 和数据中的addUserRules验证对象做绑定
      prop - 指定验证对象的那一个验证数据
       -->
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!--
        1: 点击添加用户的确认按钮后, 调用方法, 获取添加用户表单对象addUserForm的值, 请求后台接口, 添加用户, 并重新获取用户列表
       -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="resetEditUserForm"
    >
      <!-- 编辑用户表单内容
      1: :model - 编辑用户表单的数据绑定对象
      2: :rules - 编辑用户表单的验证绑定对象
      3: prop: 表单项的验证规则指向
       -->
      <el-form
        :model="editUserForm"
        :rules="editUserRules"
        ref="editUserRef"
        label-width="100px"
        status-icon
      >
        <el-form-item label="用户名">
          <el-tag>{{ editUserForm.username }}</el-tag>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配用户权限对话框 -->
    <el-dialog
      title="分配用户角色"
      :visible.sync="setUserRoleDialogVisible"
      width="50%"
    >
      <p :class="['fontSize']">当前的用户: {{ userInfo.username }}</p>
      <p :class="['fontSize']">当前的角色: {{ userInfo.role_name }}</p>
      <p :class="['fontSize']">
        分配新角色
        <!-- 下拉框
        双向数据绑定到selectedRoleId 选择的角色id中
        遍历角色列表数组生成多个el-option
        显示信息为遍历出数组的roleName
        把数组的id点击后绑定到selectedRoleId中
         -->
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义表单效验规则
    // 1: 邮箱
    var checkEmail = (rule, value, callback) => {
      const reg = /[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }

    // 2: 手机号
    var checkMobile = (rule, value, callback) => {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        callback()
      }
      callback(new Error('手机格式不正确'))
    }
    return {
      // 用户表格数据数组
      userlist: [],

      // 查询对象参数
      queryInfo: {
        // 查询参数
        query: '',

        // 当前页码
        pagenum: 1,

        // 每页显示条目数
        pagesize: 2
      },

      // 用户总量
      total: 6,

      // 添加用户对话框的打开/隐藏
      addUserDialogVisible: false,

      // 添加用户的表单对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      // 添加用户的表单验证对象
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],

        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],

        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],

        mobile: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      // 编辑用户对话框的显示/隐藏
      editDialogVisible: false,

      // 编辑用户表单的数据绑定对象
      editUserForm: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },

      // 编辑用户表单的验证绑定对象
      editUserRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],

        mobile: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      // 分配用户权限对话框显示/隐藏
      setUserRoleDialogVisible: false,

      // 当前行用户的信息对象
      userInfo: {},

      // 所有角色的列表数组
      roleList: [],

      // selectedRoleId, 点击后保存选择的角色id
      selectedRoleId: ''
    }
  },
  created() {
    // 页面加载后, 请求接口, 获取用户列表数据
    this.getUserList()
  },
  methods: {
    // 获取用户列表数组
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        this.$message({
          type: 'danger',
          message: '获取用户列表失败',
          duration: 800
        })
      }

      // 把获取到的用户数组, 赋值给数据中的userList
      this.total = res.data.total
      this.userlist = res.data.users
    },

    // pageSize 改变时会触发
    // 改变queryInfo的页码数量, 然后再次请求用户列表
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },

    // current-page 改变时会触发
    handleCurrentChange(newPage) {
      // 当点击翻页后, 通过参数把当前的页码赋值给数据中的当前页码
      this.queryInfo.pagenum = newPage

      // 再次请求用户数据
      this.getUserList()
    },

    async stateChanged(row) {
      // 用户状态改变了
      // console.log(row)
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )

      if (res.meta.status !== 200) {
        this.$message({
          type: 'dange',
          message: '更新用户状态失败!',
          duration: 800
        })
      }

      // 刷新当前页
      this.getUserList()

      // 提示
      this.$message({
        type: 'success',
        message: '更新用户状态成功!',
        duration: 800
      })
    },

    // 显示添加用户对话框
    showAddUserDialog() {
      this.addUserDialogVisible = true
    },

    // 添加用户对话框关闭了, 清空表单
    resetAddUserForm() {
      this.$refs.addUserRef.resetFields()
    },

    // 添加用户
    addUser() {
      // 1. 获取添加用户表单, 先做预验证, 通过后再请求
      this.$refs.addUserRef.validate(async validate => {
        if (!validate) {
          // 用户填写的数据格式不对
          return this.$message({
            type: 'info',
            message: '格式不正确, 请重新输入!',
            duration: 800
          })
        }

        // 2. 获取添加用户表单对象addUserForm的值
        // 3. 请求后台接口, 添加用户
        const { data: res } = await this.$http.post('users', this.addUserForm)

        if (res.meta.status !== 200) {
          // 创建失败
          this.$message({
            type: 'danger',
            message: '创建用户失败!',
            duration: 800
          })
        }
        // 1. 重新获取用户列表
        this.getUserList()

        // 2. 提示信息
        this.$message({
          type: 'success',
          message: '创建用户成功!',
          duration: 800
        })

        // 隐藏添加用户对话框
        this.addUserDialogVisible = false
      })
    },

    // 显示编辑用户对话框
    async showEditDialog(row) {
      // 1. 通过当前行, 请求接口, 获取到当前行对象的数据
      const { data: res } = await this.$http.get(`users/${row.id}`)

      // 2. 赋值给数据中的editUserForm对象的属性
      this.editUserForm.id = res.data.id
      this.editUserForm.username = res.data.username
      this.editUserForm.email = res.data.email
      this.editUserForm.mobile = res.data.mobile

      this.editDialogVisible = true
    },

    // 当编辑用户对话框关闭后, 重置编辑用户表单的内容
    resetEditUserForm() {
      this.$refs.editUserRef.resetFields()
    },

    // 编辑用户
    async editUser() {
      // 表单预验证
      this.$refs.editUserRef.validate(async validate => {
        if (!validate) {
          // 填写数据格式错误
          return this.$message({
            type: 'danger',
            message: '用户格式错误!',
            duration: 800
          })
        }
        // 格式正确, 可以发送请求了
        const { data: res } = await this.$http.put(
          `users/${this.editUserForm.id}`,
          this.editUserForm
        )

        if (res.meta.status !== 200) {
          // 编辑用户失败
          this.$message({
            type: 'info',
            message: '编辑用户失败!',
            duration: 800
          })
        }

        // 成功!
        // 重新获取用户列表页面
        this.getUserList()
        this.$message({
          type: 'success',
          message: '编辑用户成功!',
          duration: 800
        })
        this.editDialogVisible = false
      })
    },

    // 删除用户
    async deleteUser(id) {
      // 弹框确认
      try {
        const confirmRes = await this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
          '提示',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        if (confirmRes) {
          // 请求接口服务器, 删除当前用户
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) {
            // 删除失败
            this.$message({
              type: 'danger',
              message: '删除失败',
              duration: 800
            })
          }

          // 删除成功, 重新获取用户列表
          this.getUserList()
          this.$message({
            type: 'success',
            message: '已删除当前用户',
            duration: 800
          })
        }
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消当前删除操作',
          duration: 800
        })
      }
    },

    // 显示分配用户权限对话框
    async showsetUserRoleDialog(row) {
      // 保存当前用户的信息到数据中
      this.userInfo = row

      // 在显示对话框之前, 请求接口, 获取到所有角色列表
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message({
          type: 'danger',
          message: '获取角色列表失败!',
          duration: 800
        })
      }

      this.roleList = res.data

      this.setUserRoleDialogVisible = true
    },

    // 保存当前用户的新角色
    async setUserRole() {
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status !== 200) {
        // 设置用户新角色失败
        return this.$message({
          type: 'danger',
          message: '设置用户新角色失败!',
          duration: 800
        })
      }

      // 提示成功信息
      this.$message({
        type: 'success',
        message: '设置用户新角色成功!',
        duration: 800
      })

      // 隐藏分配当前用户权限对话框
      this.setUserRoleDialogVisible = false

      // 刷新用户列表
      this.getUserList()

      // 清空选中selectedRoleId的值
      this.selectedRoleId = ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-col:nth-child(1) {
  margin-right: 20px;
}

.fontSize {
  font-size: 16px;
}
</style>
