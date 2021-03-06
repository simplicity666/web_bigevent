$(function () {
    var form = layui.form
    var layer = layui.layer

    // 1. 自定义表单验证规则
    form.verify({
        // 用户昵称的验证
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })
    // 调用函数
    initUserInfo()

    // 2. 定义 '初始化用户的基本信息'函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res)

                // 调用form.val()方法快速为表单赋值
                // 第一个参数意思是要给那个表单赋值（通过lay-filter属性选取）
                // 第二个参数是指数据对象，而数据信息就在data里存着
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3. 重置按钮的点击事件：重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为（如果不阻止的话，所有表单内容都会被情况，比如登录名称）
        e.preventDefault()
        // 重新调用initUserInfo()函数，用来获取用户信息填充表单
        initUserInfo()
    })

    // 4. 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 4.1 阻止表单的默认提交行为
        e.preventDefault()
        // 4.2 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),  //可以快速拿到表单里的数据
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面中的getUserInfo()方法，重新渲染用户的头像和用户的信息
                // 如何在子页面（基本资料）里去调用父页面（大事件）的方法？
                // window就代表user_info页面
                window.parent.getUserInfo()
            }
        })
    })
})