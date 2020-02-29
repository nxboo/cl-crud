import { renderForm, renderNode, certainProperty, cloneDeep, clearForm } from '@/utils';
import DialogMixin from '@/mixins/dialog';

export default {
    inject: ['crud'],
    mixins: [DialogMixin],

    data() {
        return {
            // 显隐
            visible: false,
            // 加载
            loading: false,
            saving: false,
            // cnt
            cnt: false,
            // 是否编辑
            isEdit: false,
            // 表单项
            items: [],
            // 操作按钮
            op: {},
            // 表单值
            form: {},
            // 弹窗参数
            props: {},
            // 打开同步
            sync: false
        };
    },

    methods: {
        async open(callback) {
            let { props, items, op, form, sync } = this.crud.upsert;

            const dataset = () => {
                this.props = props;
                this.items = items;
                this.form = form;
                this.op = op;
                this.sync = sync;

                if (!props.title) {
                    props.title = this.isEdit ? '编辑' : '新增';
                }

                if (!props.top) {
                    props.top = '15vh';
                }

                if (!props.width) {
                    props.width = '50%';
                }

                this.dialog.fullscreen = props.fullscreen;

                this.items.forEach(e => {
                    this.$set(this.form, e.prop, cloneDeep(e.value));
                });
            };

            const expand = callback || new Function();

            // 同步打开
            if (sync) {
                dataset();
                expand();
            }
            // 异步打开
            else {
                this.visible = true;
                dataset();
                this.$nextTick(() => {
                    expand();
                });
            }
        },

        show(...args) {
            this.visible = true;
            this.emit.apply(this, ['open', this.isEdit, ...args]);
        },

        close() {
            // Reset value
            clearForm(this.form);

            // Clear status
            this.visible = false;
            this.loading = false;
            this.saving = false;

            this.emit('close', this.isEdit);
        },

        clear() {
            clearForm(this.form);
        },

        reset() {
            this.resetForm(this.items, this.form);
        },

        emit(name, ...args) {
            const fn = this.crud.fn[name];

            if (fn) {
                fn.apply(this, args);
            }
        },

        edit(data) {
            const { fn, dict, service } = this.crud;

            const done = obj => {
                for (let i in obj) {
                    this.form[i] = obj[i];
                }

                this.loading = false;
                this.show(this.form);
            };

            const next = data => {
                return new Promise((resolve, reject) => {
                    const reqName = dict.api.info;

                    if (!service[reqName]) {
                        this.loading = false;

                        return reject(`Request function '${reqName}' is not fount`);
                    }

                    service[reqName]({
                        id: data.id
                    })
                        .then(res => {
                            done(res);
                            resolve(res);
                        })
                        .catch(err => {
                            this.$message.error(err);
                            reject(err);
                        })
                        .done(() => {
                            this.loading = false;
                        });
                });
            };

            this.loading = true;
            this.isEdit = true;

            this.open(async () => {
                if (fn.info) {
                    this.emit('info', data, { next, done });
                } else {
                    next(data);
                }
            });
        },

        add() {
            this.isEdit = false;

            this.open(() => {
                this.show(null);
            });
        },

        append(data) {
            this.isEdit = false;

            this.open(() => {
                if (data) {
                    Object.assign(this.form, data);
                }
                this.show(data);
            });
        },

        save() {
            this.$refs['form'].validate(async valid => {
                if (valid) {
                    const { conf, dict, service, fn } = this.crud;

                    const done = () => {
                        this.saving = false;
                    };

                    const next = data => {
                        const method = this.isEdit ? 'update' : 'add';
                        const tips = this.crud.tips[method];

                        return new Promise((resolve, reject) => {
                            const reqName = dict.api[method];

                            if (!service[reqName]) {
                                this.saving = false;

                                return reject(`Request function '${reqName}' is not fount`);
                            }

                            service[reqName](data)
                                .then(res => {
                                    this.$message.success(tips.success);
                                    this.close();

                                    if (conf['UPSERT_REFRESH']) {
                                        this.crud.refresh();
                                    }

                                    resolve(res);
                                })
                                .catch(err => {
                                    this.$message.error(tips.error || err);
                                    reject(err);
                                })
                                .done(() => {
                                    this.saving = false;
                                });
                        });
                    };

                    let data = cloneDeep(this.form);

                    this.saving = true;

                    if (fn.submit) {
                        this.emit('submit', this.isEdit, data, { next, done });
                    } else {
                        next(data);
                    }
                }
            });
        }
    },

    render() {
        const formEl = renderForm.call(this);
        const titleEl = this.renderTitleSlot();

        return (
            this.visible && (
                <el-dialog
                    class="crud-upsert-dialog"
                    visible={this.visible}
                    {...{
                        props: this.props,

                        on: {
                            close: this.close
                        },

                        directives: [
                            {
                                name: 'dialog-drag',
                                value: certainProperty(this, ['props', 'dialog'])
                            }
                        ]
                    }}>
                    {formEl}
                    <template slot="title">{titleEl}</template>
                    <template slot="footer">
                        {this.op.visible &&
                            this.op.layout.map(vnode => {
                                if (vnode == 'confirm') {
                                    return (
                                        <el-button
                                            size={this.props.size}
                                            type="success"
                                            {...{
                                                on: {
                                                    click: this.save
                                                },

                                                props: {
                                                    loading: this.saving,
                                                    disabled: this.loading
                                                }
                                            }}>
                                            {this.op.confirmButtonText}
                                        </el-button>
                                    );
                                } else if (vnode == 'cancel') {
                                    return (
                                        <el-button size={this.props.size} on-click={this.close}>
                                            {this.op.cancelButtonText}
                                        </el-button>
                                    );
                                } else {
                                    return renderNode.call(this, vnode);
                                }
                            })}
                    </template>
                </el-dialog>
            )
        );
    }
};
