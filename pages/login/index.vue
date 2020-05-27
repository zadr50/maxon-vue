<template>
  <el-container>
    <el-col  style="text-align:center">
    <h1>Login</h1>
    <el-divider></el-divider>
    <span style="color:red"><i>{{message}}</i></span>

    <div >
      <div style="margin-bottom:20px">
         <el-button @click="$auth.loginWith(facebook)"  round type="primary"
            >Login with Facebook</el-button>
      </div>
      <div style="margin-bottom:20px">
         <el-button @click="$auth.loginWith(google)"  round type="danger"
            >Login with Google</el-button>
      </div>
      <div style="margin-bottom:20px">
         <el-button @click="$auth.loginWith(auth0)"  round type="warning"
            >Login with Auth0</el-button>
      </div>
      <div style="margin-bottom:20px">
         <el-button @click="$auth.loginWith(github)"  round type="default"
            >Login with Github</el-button>
      </div>
    </div>        

    </el-col>
  </el-container>
</template>

<script>
  export default {
    middleware: ['auth'],
    head: {
      title: 'Login'
    },
    data() {
      return {
        message:'',
        auth: {
          email:null,
          password:null
        },
        error:null,
      }
    },
    
    methods: {
        async login() {
          this.error = null
          return this.$auth
            .loginWith('local', {
              data: {
                username: this.username,
                password: this.password
              }
            })
            .catch(e => {
              this.error = e + ''
            })
        }
        
    },
    computed: {
      redirect() {
        return (
          this.$route.query.redirect &&
          decodeURIComponent(this.$route.query.redirect)
        )
      },
      isCallback() {
        return Boolean(this.$route.query.callback)
      }
    },
    mounted(){
      
    }
  }
</script>
