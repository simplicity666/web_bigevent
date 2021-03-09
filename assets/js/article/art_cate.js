$(function () {
    var layer = layui.layer
    // 导入form
    var form = layui.form

    initArtCateList()

    // 1. 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 导入模板引擎后就可以在自己的js文件中调用模板引擎里template的方法
                // 提供模板id'tpl-table'和要渲染的数据对象res
                var htmlStr = template('tpl-table', res)
                // 渲染给tbody
                $('tbody').html(htmlStr)
            }
        })
    }

    // 2. 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            // 没有确定按钮的弹出层
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 3. 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                // 根据索引，自动关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 4.通过代理的形式，为`btn-edit` 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 5.展示弹出层后，根据id的值发起请求获取文章分类的数据
        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 6. 通过代理的形式，为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                // 根据所以关闭弹出层
                layer.close(indexEdit)
                // 舒心表格数据
                initArtCateList()
            }
        })
    })

    // 7. 通过代理的形式，为删除按钮点击点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 拿到id值
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    // 关闭弹出层
                    layer.close(index)
                    // 刷新列表数据
                    initArtCateList()
                }
            })
        })
    })
})