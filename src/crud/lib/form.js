import { renderForm, deepMerge, renderLayout } from '../../utils';
import '../index.styl';

export default {
  name: 'cl-form',

  props: {
    options: Object
  },

  data() {
    return {
      items: [],
      op: {
        confirmButtonText: '保存',
        cancelButtonText: '取消',

        layout: ['cancel', 'confirm']
      },
      props: {
        size: 'small',
        'append-to-body': true,
        'close-on-click-modal': false
      },
      form: {},
      on: {},
      fn: {},
      saving: false,
      loading: false,
      visible: false
    };
  },

  methods: {
    open(options) {
      if (!options) {
        return console.warn(`can't open form, because argument is null`);
      }

      const { props, items, on, op } = options;

      this.visible = true;

      if (items) {
        this.items = items;
      }

      if (props) {
        deepMerge(this.props, props);
      }

      if (on) {
        this.on = on;
      }

      if (op) {
        deepMerge(this.op, op);
      }

      this.form = {};

      this.items.forEach(e => {
        this.$set(this.form, e.prop, e.value);
      });

      return this.emit();
    },

    emit() {
      const done = () => {
        this.saving = false;
      };

      return {
        done,
        data: this.form,
        items: this.items,
        save: this.save,
        close: this.close
      };
    },

    close() {
      this.$refs['form'].resetFields();
      this.visible = false;
      this.saving = false;

      if (this.on.close) {
        this.on.close();
      }
    },

    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.on.submit) {
            this.saving = true;

            this.on.submit(this.emit());
          } else {
            console.warn('function[submit] is not fount');
          }
        }
      });
    }
  },

  render() {
    const form = renderForm.call(this);
    const { confirmButtonText, cancelButtonText, layout } = this.op;

    return (
      this.visible && (
        <el-dialog
          visible={this.visible}
          {...{
            props: this.props,

            on: {
              open: this.open,
              close: this.close
            }
          }}>
          {form}
          <template slot="footer">
            {layout.map(vnode => {
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
                    {confirmButtonText}
                  </el-button>
                );
              } else if (vnode == 'cancel') {
                return (
                  <el-button size={this.props.size} on-click={this.close}>
                    {cancelButtonText}
                  </el-button>
                );
              } else {
                return renderLayout.call(this, vnode);
              }
            })}
          </template>
        </el-dialog>
      )
    );
  }
};
