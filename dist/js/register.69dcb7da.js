(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["register"],{"02fa":function(e,t,a){"use strict";a("d425")},"73cf":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"login_root"}},[i("MusicButton"),i("el-row",{attrs:{type:"flex",justify:"center"}},[i("el-image",{attrs:{src:a("bc6c"),fit:e.fit}})],1),i("el-row",{attrs:{type:"flex",justify:"center"}},[i("el-card",{attrs:{shadow:"always"}},[i("h1",{staticStyle:{"text-align":"center"}},[e._v("注册信息")]),i("el-divider"),i("el-form",{ref:"validateForm",attrs:{model:e.validateForm,"status-icon":"",rules:e.rules,"label-width":"100px"}},[i("el-form-item",{attrs:{label:"用户名",prop:"username"}},[i("el-input",{attrs:{placeholder:"请输入用户名",type:"text",autocomplete:"off"},model:{value:e.validateForm.username,callback:function(t){e.$set(e.validateForm,"username",t)},expression:"validateForm.username"}})],1),i("el-form-item",{attrs:{label:"密码",prop:"password"}},[i("el-input",{attrs:{placeholder:"请输入密码",type:"password",autocomplete:"off"},model:{value:e.validateForm.password,callback:function(t){e.$set(e.validateForm,"password",t)},expression:"validateForm.password"}})],1),i("el-form-item",{attrs:{label:"确认密码",prop:"checkPassword"}},[i("el-input",{attrs:{type:"password",autocomplete:"off"},model:{value:e.validateForm.checkPassword,callback:function(t){e.$set(e.validateForm,"checkPassword",t)},expression:"validateForm.checkPassword"}})],1),i("el-form-item",{attrs:{label:"邀请码",prop:"invitationCode",rules:[{required:!0,message:"邀请码不能为空"}]}},[i("el-input",{attrs:{placeholder:"请输入邀请码",type:"text",autocomplete:"off"},model:{value:e.validateForm.invitationCode,callback:function(t){e.$set(e.validateForm,"invitationCode",t)},expression:"validateForm.invitationCode"}})],1),i("el-form-item",{staticClass:"shortMargin",attrs:{label:"验证码",prop:"vertificationCode",rules:[{required:!0,trigger:"blur",validator:e.vertificationCode}]}},[i("el-input",{attrs:{type:"text",placeholder:"请输入验证码",autocomplete:"off"},model:{value:e.validateForm.vertificationCode,callback:function(t){e.$set(e.validateForm,"vertificationCode",t)},expression:"validateForm.vertificationCode"}})],1),i("el-form-item",{staticClass:"shortMargin"},[i("el-collapse-transition",[i("div",{directives:[{name:"show",rawName:"v-show",value:e.vertificationCodeCorrect,expression:"vertificationCodeCorrect"}]},[i("el-alert",{attrs:{title:"验证成功",type:"success",center:"","show-icon":"",closable:!1}})],1)])],1),i("el-form-item",{staticClass:"shortMargin"},[i("div",{staticClass:"shortHeight"},[i("VerificationCodeModule",{attrs:{identifyCode:e.identifyCode}}),i("el-button",{attrs:{type:"text"},on:{click:e.refreshCode}},[e._v("看不清，换一张")])],1)]),i("el-button",{staticClass:"two-button-margin",attrs:{type:"primary"},on:{click:function(t){return t.stopPropagation(),t.preventDefault(),e.submitForm(t)}}},[e._v("注册")]),i("el-button",{on:{click:function(t){e.cancelDialogVisible=!0}}},[e._v("取消")])],1)],1)],1),i("el-row",{attrs:{type:"flex",justify:"center"}},[i("el-image",{attrs:{src:a("410c"),fit:e.fit}})],1),i("el-dialog",{attrs:{title:"提示",visible:e.cancelDialogVisible,width:e.dialogWidth,center:""},on:{"update:visible":function(t){e.cancelDialogVisible=t}}},[i("i",{staticClass:"el-icon-question"}),i("span",{staticStyle:{"text-align":"center"}},[e._v("确定放弃本次注册？")]),i("span",{attrs:{slot:"footer"},slot:"footer"},[i("el-button",{staticStyle:{"margin-right":"10%"},on:{click:function(t){e.cancelDialogVisible=!1}}},[e._v("取消")]),i("el-button",{attrs:{type:"danger"},on:{click:function(t){return e.cancelRegister()}}},[e._v("确定")])],1)])],1)},r=[],o=(a("d3b7"),a("3e79")),s=a("8d05"),l=a("e35f"),n=a("b775");function c(e){return Object(n["a"])({url:"/register",method:"post",data:e})}var d={name:"Register",data:function(){var e=this,t=function(e,t,a){if(""===t)a(new Error("请输入用户名"));else{var i=/^[a-zA-Z0-9_-]{4,16}$/;i.test(t)?a():a(new Error("使用4到16位字母,数字,下划线,减号")),a()}},a=function(t,a,i){""===a?i(new Error("请输入密码")):(""!==e.validateForm.checkPassword&&e.$refs.validateForm.validateField("checkPassword"),i())},i=function(t,a,i){""===a?i(new Error("请再次输入密码")):a!==e.validateForm.password?i(new Error("两次输入密码不一致!")):i()};return{fit:"fill",cancelDialogVisible:!1,duplicateRegisterFlag:!1,loading:null,validateForm:{username:"",password:"",checkPassword:"",invitationCode:"",vertificationCode:""},rules:{username:[{required:!0,validator:t,trigger:"blur"}],password:[{required:!0,validator:a,trigger:"blur"},{min:6,max:15,message:"长度在 6 到 15 个字符",trigger:"blur"}],checkPassword:[{required:!0,validator:i,trigger:"blur"}]}}},computed:{dialogWidth:function(){var e=document.body.clientWidth;return e<800?"60%":e<1024?"40%":e<1280?"30%":"20%"}},methods:{submitForm:function(){var e=this;this.duplicateRegisterFlag||(this.duplicateRegisterFlag=!0,this.$refs.validateForm.validate((function(t){t?(e.loading=e.$loading({lock:!0,text:"注册中",spinner:"el-icon-loading",background:"rgba(255, 255, 255, 0.7)"}),c({username:e.validateForm.username,password:e.validateForm.password,invitationCode:e.validateForm.invitationCode}).then((function(){e.$message({message:"注册成功，请登录",type:"success"}),e.$router.push({name:"Login"})})).catch({}).finally((function(){e.duplicateRegisterFlag=!1,e.loading.close()}))):(e.$message.error("请正确填写注册信息"),e.duplicateRegisterFlag=!1)})),this.refreshCode())},cancelRegister:function(){this.$message({message:"已取消注册，回到登录页面",type:"info"}),this.$router.push({name:"Login"}),this.cancelDialogVisible=!1}},components:{VerificationCodeModule:o["a"],MusicButton:s["a"]},mixins:[l["a"]]},u=d,m=(a("02fa"),a("2877")),f=Object(m["a"])(u,i,r,!1,null,"230644de",null);t["default"]=f.exports},d425:function(e,t,a){}}]);
//# sourceMappingURL=register.69dcb7da.js.map