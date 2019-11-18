import { renderForm, renderLayout } from '../../utils';

export default {
  inject: ['crud'],

  data() {
    return {
      visible: false,
      loading: false,
      saving: false,
      isEdit: false,
      items: [],
      op: {},
      form: {},
      props: {}
    };
  },

  methods: {
    open(callback) {
      const { props, items, op } = this.crud.upsert;

      this.visible = true;

      this.items = items;
      this.props = props;
      this.op = op;

      this.items.forEach(e => {
        this.$set(this.form, e.prop, e.value);
      });

      this.$nextTick(() => {
        if (callback) callback();
      });
    },

    close() {
      this.$refs['form'].resetFields();
      this.visible = false;
      this.form = {};

      this.emit('close', this.isEdit);
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

        this.emit('open', true, this.form);
        this.loading = false;
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

      this.open(() => {
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
        this.emit('open', null);
      });
    },

    append(data) {
      this.isEdit = false;

      this.open(() => {
        if (data) {
          Object.assign(this.form, data);
        }

        this.emit('open', data);
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

          let data = Object.create(null);

          for (let i in this.form) {
            data[i] = this.form[i];
          }

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
    const form = renderForm.call(this);
    const { confirmButtonText, cancelButtonText, layout } = this.op;

    return (
      this.visible && (
        <el-dialog
          class="crud-upsert-dialog"
          visible={this.visible}
          title={this.isEdit ? '编辑' : '新增'}
          {...{
            props: this.props,

            on: {
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
