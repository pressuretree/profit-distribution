<template>
	<div>
		<h1>Login page!!!!</h1>
		<el-button type='primary' size="small" @click = 'handleLogin'>登录</el-button>
	</div>
</template>

<script>
export default {
	data() {
		return {

		}
	},
	methods: {
		handleLogin(){
			console.log("navigate to main page!!!")
			this.$router.push('/help');
		}
	}
}
	
</script>


