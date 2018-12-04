var contextpath = getRootPath();
var transferApp = new Vue({
    el: '#transferMain',
    data: {
        queryIdCard: contextpath + '/card/getIdCard',
        confirmUrl: contextpath + '/card/confirm',
        confirmPhotoUrl: contextpath + '/face/comparisonBase64',
        photoImgUrl: contextpath + '/static/img/9.png',
        activeStep: 0,
        cardForm: {},
        photoBtn: '拍照',
        photoMsg: ''
    },
    methods: {
        stepChangeHandler: function (action) {
            if ('pre' == action && this.activeStep > 0) {
                this.activeStep--;
            } else if ('next' == action && this.activeStep < 5) {
                this.activeStep++;
            }
        },
        handleConfirm: function () {
            var vm = this;
            this.$refs['cardForm'].validate(function (valid) {
                if (valid) {
                    // var loading = vm.$loading({
                    //     lock: true,
                    //     text: '请稍后，正在保存数据',
                    //     spinner: 'el-icon-loading',
                    //     background: 'rgba(0, 0, 0, 0.7)'
                    // })
                    // axios({
                    //         method: 'post',
                    //         url: vm.confirmUrl,
                    //         data: vm.cardForm
                    //     })
                    //     .then(function(res) {
                    //         loading.close();
                    //         vm.activeStep++;
                    //     }).catch(function(error) {
                    //         console.log(error)
                    //         loading.close()
                    //     })
                    vm.activeStep++;
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleConfirmPhoto: function () {
            var vm = this;
            var loading = vm.$loading({
                lock: true,
                text: '请稍后，正在联网核查身份',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            var img = document.createElement('img');
            img.src = vm.photoImgUrl; //此处自己替换本地图片的地址
            console.log('当前图片:' + vm.photoImgUrl);
            img.onload = function () {
                var base64Img = getBase64Image(img);
                axios({
                    method: 'post',
                    url: vm.confirmPhotoUrl,
                    data: {
                        firstImg: vm.cardForm.base64Img,
                        secondImg: base64Img
                    }
                })
                    .then(function (res) {
                        loading.close();
                        console.log(res.data)
                        if (res.data.code === '0') {
                            if (res.data.data > 0.7) {
                                //验证通过
                                vm.activeStep++;
                                vm.$message({
                                    showClose: true,
                                    message: '恭喜您，头像验证通过！',
                                    type: 'success'
                                });
                            } else {
                                vm.photoMsg = '拍摄的照片和身份证照片差别过大，重拍后再试试吧';
                            }

                        } else {
                            vm.photoMsg = '拍摄错误，请重新拍照！';
                        }
                        //vm.activeStep++;
                    }).catch(function (error) {
                    console.log(error)
                    loading.close()
                })
            }
        },
        handleRestPhoto: function () {
            this.photoBtn = '重拍';
            var imgArray = ['/static/img/9.png', '/static/img/li.jpg', '/static/img/xu.jpg'];
            var index = parseInt(Math.random() * 3, 10);
            this.photoImgUrl = contextpath + imgArray[index];
        },
        handleConfirmPwd: function () {
            var pwd1 = document.getElementById("pwd1").value;
            var pwd2 = document.getElementById("pwd2").value;
            if(pwd1 ==null || pwd1 ==='' || pwd2 ==null || pwd2 ===''){
                this.$message({
                    showClose: true,
                    message: '请输入密码',
                    type: 'warning'
                });
            }else if(pwd1 != pwd2){
                this.$message({
                    showClose: true,
                    message: '两次输入密码不一致',
                    type: 'warning'
                });
            }else{
                this.activeStep++;
            }

        },
        handleConfirmSign: function(){
            this.activeStep++;
        },
        handleGoBack: function(){
            this.activeStep--;
        }

    }
});