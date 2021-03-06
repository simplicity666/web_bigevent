$(function () {
    // 导入layui里的form
    var form = layui.form

    // 1. 密码框的三个校验规则
    form.verify({
        // 1.1 所有密码框要遵守的规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 1.2 新密码的规则：不能与原密码框里的值相同
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        // 1.3 确认新密码框的规则：要与新密码框里的值相同
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 2. 给表单做一个提交事件
    $('.layui-form').on('submit', function (e) {
        // 2.1 阻止默认行为
        e.preventDefault()
        // 2.2 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 表单的快速获取方式
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})
