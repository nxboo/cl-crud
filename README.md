# cl-crud

## 演示

[地址](https://show.cool-admin.com/)

账号 admin
密码 123456

## 版本信息

1、1.1.9 添加窗口操作
2、1.1.91 修改 update 自动校正
3、1.1.92 修改 el-dialog 拖动异常
4、1.1.93 修改 el-dialog 切换异常
5、1.1.94 修改 el-dialog 拖动异常，添加resize事件
6、1.1.95 修改 el-dialog 拖动指针显示

## 开始

我们将构建一个基本应用场景, 其中的涵盖了大量的基础功能。

## 包含的功能

- 数据表格
- 高级搜索
- 多、单关键字搜索
- 类目搜索
- 新增、删除、修改、查询
- 排序
- 分页

## 配置参数

```js
{
    // 服务类
    service: null, // 使用方式请看 `服务层`
    // 配置
    conf: {
        UPSERT_REFRESH: true,   // 新增、编辑后是否刷新列表
        DELETE_REFRESH: true,   // 删除后是否刷新列表
    },
    // 权限
    permission: {
        add: true,  // 新增权限
        delete: true,  // 删除权限
        update: true,  // 修改权限
        info: true,  // 详情权限
    },
    // 字典组
    dict: {
        // 替换请求接口的尾地址
        api: {
            list: 'list',
            add: 'add',
            update: 'update',
            delete: 'delete',
            info: 'info',
            page: 'page'
        },
        // 分页参数
        pagination: {
            page: 'page',   // 页数
            size: 'size',   // 每页显示的条目
        },
        // 搜索
        search: {
            keyWord: 'keyWord', // 模糊查询的关键字
            query: 'catecory',  // 类目
        },
        // 排序
        sort: {
            order: 'sort',  // 排序方式
            prop: 'order',  // 排序关键字
        },
        // 请求参数
        params: {
            infoId: 'id',   // 详情，默认使用 `id`
            deleteId: 'ids',    // 删除，默认使用 `ids`，多个用 `,`隔开
            selectionId: 'id',  // 选中项，默认使用 `id`
        },
        // 标签
        label: {
            add: '添加',
            delete: '删除',
            update: '编辑',
            refresh: '刷新',
            advSearch: '高级搜素'
        }
    },
    // 提示
    tips: {
        add: {
            success: '新增成功',
            error: ''
        },
        update: {
            success: '修改成功',
            error: ''
        },
        delete: {
            confirm: '此操作将永久删除选中数据，是否继续？',
            success: '删除成功',
            error: ''
        }
    },
    // 表格
    table: {
        // 数据
        data: [],
        // 表格列，同 element-ui Table-column Attributes
        columns: [
            {
                label,  // 列名
                prop,   // 关键字
                width,  // 宽度
                align,  // 对齐方式
                sortable, // 是否排序
                ...
            }
        ],
        // 同 element-ui Table Attributes
        props: {
            border: true,
            stripe: false,
            size: 'mini',
            'element-loading-text': '拼命加载中...',
            'element-loading-background': 'rgba(255, 255, 255, 0.7)',
            'element-loading-spinner': 'el-icon-loading',
            ...
        },
        // 同 element-ui Table Events
        on: {
            row-dblclick,   // 行双击
            ...
        },
        // 默认排序
        sort: {
            prop: '',   // 排序关键字
            order: '',  // 排序方式，desc、asc、null
        },
        // 操作列
        op: {
            visible: true,  // 是否显示
            // 同 element-ui Table-column Attributes
            props: {
                width: 150,
                align: 'center',
                fixed: 'right',
                label: '操作'
            },
            // 布局，请移步 `layout`
            layout: ['edit', 'delete']
        }
    },
    // 搜索
    search: {
        // 类目搜索
        query: {
            list: [],   // 类目列表， {label, value}
            value: null,    // 默认值，多个用 `,`隔开
            multiple: false,    // 是否多选类目
            callback: null, // 值发生改变时出触发该事件
        },
        // 关键字搜搜
        key: {
            selected: '',   // 默认选中关键字
            value: '',  // 默认值
            list: [],   // 多关键字列表
            placeholder: '请输入关键字',
        },
        // 高级搜索
        adv: {
            visible: false, // 是否可见
            items: [], // 表单项，请移步 `form-items`
            // 同 element-ui Form Attributes
            props: {
                size: 'mini',
                'label-width': '120px',
                ...
            }
        }
    },
    // 新增、更新
    upsert: {
        // 同 element-ui Form Attributes
        props: {
            width: '',
            labelWidth: '80px',
            'append-to-body': true,
            ...
        },
        // 表单项，请移步 `form-items`
        items: [],
        // 表单数据
        form: {}
    },
    // 分页
    pagination: {
        // 同 element-ui Attributes
        props: {
            background: true,
            small: false,
            layout: 'total, sizes, prev, pager, next, jumper',
            'page-sizes': [20, 50, 100, 200],
            ...
        },
        size: 20,
        page: 1,
        total: 0
    },
    // 请求参数
    params: {},
    // 布局，请移步 `layout`
    layout: [
        [
            'refresh-btn',
            'add-btn',
            'multi-delete-btn',
            'query',
            'flex1',
            'search-key',
            'adv-btn'
        ],
        ['data-table'],
        ['flex1', 'pagination']
    ],
}
```

## table

有时候需要复杂的业务需求，可使用自定义列插槽 `table-column-*`：

```html
<template #table-column-name="{ scope }">
  <el-tag type="primary">{{ scope.row.name }}</el-tag>
</template>
```

渲染表头：

```html
<template #table-header-name="{ scope }">
  <el-tooltip content="本月业绩之和">
    <span>总量<i class="el-icon-warning"></i></span>
  </el-tooltip>
</template>
```

## form-items

表单列，我们希望所有的表单列都能通过配置参数来实现。`items`对象结构如下：

```js
{
    prop,   // 关键字
    label,  // 列名
    component: {
        name,   // 组件名
        options,    // 当组件为 `el-select`, `el-radio-group`, `el-checkbox-group`的可选项
        props,  // 组件需传递的参数
        attrs, // 组件原生属性，如：placeholder
        on, // 组件监听的事件，主要处理 `emit`
        ...参考vue jsx渲染参数
    },
    rules,  // 校验规则
    span,   // 栅格占据的列数
    offset, // 栅格左侧的间隔格数
    ...
}
```

相关示例如下：

```js
// 1.使用 element-ui组件
{
    prop: 'name',
    label: '昵称',
    component: {
        name: 'el-input',
        props: {
            size: 'mini',
            clearable: true
        },
        attrs: {
            placeholder: '请输入昵称'
        }
    }
}
// 2.下拉选择
{
    prop: 'channel',
    label: '渠道',
    component: {
        name: 'el-select',
        options: [
            {
                label: '淘宝',
                value: 1
            },
            {
                label: '天猫',
                value: 2
            }
        ]
    }
}
// 3.自定义组件
{
    prop: 'avatar',
    label: '头像',
    component: {
        name: 'cl-upload'
    }
}
// 4.jsx方式
{
    prop: 'check',
    component: <el-button on-click={e => { alert('jsx!'); }}>click me!</el-button>
}
or
{
    prop: 'check,
    component: {
        name: 'tmp-check',

        props: ['value'],

        render() {
            return <div>{ this.value }</div>
        }
    }
}
```

## layout

布局，二维数组每一项表示这一行的所有元素。
默认支持的元素

- adv-search 高级搜索表单 （默认写入）
- refresh-btn 刷新表格按钮
- add-btn 新增按钮
- multi-delete-btn 批量删除按钮
- query 类目搜索
- flex1 弹性布局填充
- search-key 关键字搜索
- adv-btn 高级搜索按钮
- data-table 数据表格
- pagination 分页
- edit 行编辑（只适用在`table.op.layout`）
- delete 行删除（只适用在`table.op.layout`）
- 其他方式如下：

使用`slot-*`方式示例：

```html
<template #slot-name="{ scope }"> 昵称：<el-input v-model="scope.name" /> </template>
```

```js
['refresh-btn', 'slot-name'], ['data-table'], ['flex1', 'pagination'];
```

使用`jsx`方式示例：

```js
[
  [
    'refresh-btn',
    <el-button
      on-click={e => {
        alert('清空日志成功');
      }}>
      清空日志
    </el-button>
  ],
  ['data-table'],
  ['flex1', 'pagination']
];
```

使用组件实例的方式

```js
import TopFilter from '@/components/top-filter.vue'

...

[
    ["refresh-btn", TopFilter],
    ["data-table"],
    ["flex1", "pagination"]
];
```

## @load ({ ctx, app })

#### ctx 配置参数、事件

`service` 配置请求的服务，示例：

```js
// 自定义情况下
ctx.service({
  add: axios.get('//'),
  delete,
  update,
  page,
  info
});

// cool-admin 下
ctx.service(this.$service.system.user);
```

`permission` 配置操作权限，示例：

```js
// object
ctx.permission({
  add: true,
  delete: true,
  update: true,
  info: true
});

// function
ctx.permission(that => {
  const { permission } = that.$store.state.menu;
  const { add, delete: del, update } = that.service.permission;

  return {
    add: permission.includes(add),
    delete: permission.includes(del),
    update: permission.includes(update)
  };
});
```

`set` 设置数据，默认可操作有 `dict`,`tips`,`table`,`search`,`adv`,`upsert`,`pagination`，示例：

```js
// object
ctx.set('table', {
  columns: [
    {
      label: '姓名',
      prop: 'name',
      align: 'center',
      width: 200
    }
  ]
});

ctx.set('tips', {
  add: {
    success: '新增成功，请刷新后重试。'
  }
});

// function
ctx.set('tips', d => {
  return {
    add: {
      success: '新增成功，请刷新后重试。'
    }
  };
});
```

数据格式请参考 `配置参数`, 后者将合并默认参数

`on` 监听事件，默认可操作有 `refresh`, `open`, `close`, `submit`, `delete`，示例：

```js
// 刷新
// next 继续执行
// render 渲染数据列表
// done 关闭loading
ctx.on('refresh', async (params, { next, render, done }) => {
  // 业务需求：额外附带参数
  params.source = 1;

  // 继续执行刷新
  let { list, pagination } = await next(params);

  // 业务需求：名称只显示姓
  list.map(e => {
    e.name = e.name.substr(0, 1) + '**';
  });
});

// 编辑对话框打开
ctx.on('open', (isEdit, form) => {
  // isEdit 为 true 时表示新增或者追加新增，否则编辑
  // form 表示表单数据
});

// 编辑对话框关闭
ctx.op('close', isEdit => {
  // isEdit 为 true 时表示新增或者追加新增，否则编辑
});

// 提交
// next 继续执行
// done 关闭loading
ctx.on('submit', (isEdit, data, { next, done }) => {
  next(data);
});

// 删除
// next 继续执行
ctx.on('delete', (selection, { next }) => {
  // 默认根据id删除，id用 `,`拼接
  next({
    ids: selection.map(e => e.id).join(',')
  });
});

// 详情
// next 继续执行
ctx.on('info', (data, { next }) => {
  // 默认根据id获取详情
  next({
    id: data.id
  });
});
```

`done` 渲染后，开始执行

```js
ctx.done(next => {
  // 不传入参数，直接下一步。否则手动执行 next
  next();
});
```

#### app 处理参数、事件

`refs` 获取对应组件，默认可操作有 `table`, `advSearch`, `upsert`，示例：

```js
app.refs('table');
```

`data` 获取参数，默认可操作有 `dict`,`tips`,`table`,`search`,`adv`,`upsert`,`pagination`，示例：

```js
app.data('upsert');

app.data('upsert.form.name');

app.data('upsert.items[0].prop');

app.data('upsert.items[prop:name].label');
```

`setData` 重设参数

```js
app.setData('upsert.form.name', 'cool-admin');
```

`changeSort` 改变表格排序，会调用`page`接口

```js
app.changeSort('createTime', 'desc');
```

`clearSort` 清空排序

`delete`, `info`, `add`, `append`, `edit`, `close`

```js
// 删除
app.delete(...selection)

// 获取详情
app.info(data)

// 打开新增弹窗
app.add()

// 打开增弹窗，并追加参数
app.append({ source: 1 })

// 打开编辑弹窗
app.edit({ ... })

// 关闭弹窗
app.close()
```

`renderList` 渲染表格

```js
app.renderList([{ name: 'cool-admin' }]);
```

`refresh` 刷新表格，会调用`page`接口

```js
app.refresh({ ... })

// 配合在 ctx.done 后执行，也可以在其他地方调用
```

## example

来尝试写一个例子

```js
<template>
    <cl-crud @load='onLoad'></cl-crud>
</template>

export default {
    methods: {
        onLoad({ ctx, app }) {
            ctx.service(this.$service.system.user)
                .set('table', {
                    columns: [
                        {
                            type: 'index'
                        },
                        {
                            label: '姓名',
                            prop: 'name'
                        },
                        {
                            label: '身价',
                            prop: 'price'
                        }
                    ]
                })
                .on('submit', (data, { next }) => {
                    data.price += 100
                    next(data)
                })
                .on('refresh', async (params, { next }) => {
                    let { list } = await next(params)

                    list.map(e => {
                        e.name += '先生'
                    })
                })
                .done()

			app.refresh()
        }
    }
}
```

效果如图所示：
![示例图](https://docs.cool-admin.com/img/example-crud.jpg)
