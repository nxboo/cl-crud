import {
    renderForm,
    deepMerge,
    renderNode,
    certainProperty,
    dataset,
    cloneDeep,
    resetForm,
    clearForm
} from '@/utils';
import DialogMixin from '@/mixins/dialog';
import Flex1 from './flex1';
import '../assets/css/index.styl';

export default {
    mixins: [DialogMixin],
    name: 'cl-form',
    components: {
        Flex1
    },

    data() {
        return {
            items: [],
            hdr: {
                layout: ['fullscreen', 'close']
            },
            op: {
                visible: true,
                confirmButtonText: '保存',
                cancelButtonText: '取消',
                layout: ['cancel', 'confirm']
            },
            props: {
                drag: true,
                size: 'small',
                'append-to-body': true,
                'close-on-click-modal': false,
                'destroy-on-close': true
            },
            form: {},
            on: {},
            fn: {},
            saving: false,
            loading: false,
            visible: false,
            'v-loading': {
                'element-loading-text': '',
                'element-loading-spinner': '',
                'element-loading-background': ''
            },
            aid: {
                forceUpdate: null
            }
        };
    },

    computed: {
        crud() {
            return this;
        }
    },

    methods: {
        open(options) {
            if (!options) {
                return console.warn(`can't open form, because argument is null`);
            }

            let { props = {}, items, on, op, hdr, forceUpdate } = options;

            this.visible = true;
            this.aid.forceUpdate = forceUpdate;

            if (items) {
                this.items = items;
            }

            if (!props.top) {
                props.top = '15vh';
            }

            if (!props.width) {
                props.width = '50%';
            }

            this.dialog.fullscreen = props.fullscreen;

            if (props) {
                deepMerge(this.props, props);
            }

            if (on) {
                this.on = on;
            }

            if (op) {
                deepMerge(this.op, op);
            }

            if (hdr) {
                deepMerge(this.hdr, hdr);
            }

            this.items.forEach(e => {
                if (e.prop) {
                    this.$set(this.form, e.prop, cloneDeep(e.value));
                }
            });

            return this.cb();
        },

        done() {
            this.saving = false;
        },

        reset() {
            resetForm(this.items, this.form);
        },

        close() {
            clearForm(this.form);

            this.visible = false;
            this.saving = false;

            if (this.on.close) {
                this.on.close();
            }
        },

        showLoading(text) {
            this['v-loading']['element-loading-text'] = text;
            this.loading = true;
        },

        hideLoading() {
            this.loading = false;
        },

        getRef() {
            return this.$refs.form;
        },

        getData(p) {
            return dataset(certainProperty(this, ['items']), p);
        },

        setData(p, d) {
            deepMerge(this, dataset(certainProperty(this, ['items']), p, d));
        },

        hiddenItem(prop, flag = true) {
            this.setData(`items[prop:${prop}].hidden`, flag);
        },

        cb() {
            return {
                data: this.form,
                ...certainProperty(this, [
                    'done',
                    'items',
                    'save',
                    'close',
                    'reset',
                    'showLoading',
                    'hideLoading',
                    'setData',
                    'getData',
                    'getRef',
                    'hiddenItem'
                ])
            };
        },

        save() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.on.submit) {
                        this.saving = true;

                        this.on.submit(this.cb());
                    } else {
                        console.warn('Submit is not found');
                    }
                }
            });
        }
    },

    render() {
        const form = renderForm.call(this, this.aid);
        const footer = (this.op.layout || []).map(vnode => {
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
            } else if (vnode == 'flex1') {
                return <flex1 />;
            } else {
                return renderNode.call(this, vnode);
            }
        });

        return this.renderDialog({ form, footer });
    }
};
