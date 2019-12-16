import { cloneDeep, renderForm } from '@/utils';

export default {
  inject: ['crud'],

  data() {
    return {
      items: [],
      props: {},
      visible: false
    };
  },

  methods: {
    search() {
      const params = cloneDeep(this.form);
      const { fn } = this.crud;

      const next = params => {
        this.crud.refresh({
          ...params,
          page: 1
        });
      };

      if (fn.advSearch) {
        fn.advSearch(params, { next });
      } else {
        next(params);
      }

      this.close();
    },

    open() {
      let { items, props, form } = this.crud.search.adv;

      if (items) {
        this.items = items;
      }

      if (props) {
        this.props = props;
      }

      this.visible = true;
      this.form = form;

      this.items.map(e => {
        if (this.form[e.prop] === undefined) {
          this.$set(this.form, e.prop, e.value);
        }
      });
    },

    close() {
      this.visible = false;
    },

    reset() {
      this.items.forEach(e => (this.form[e.prop] = e.value));
      this.$refs['form'].resetFields();
    }
  },

  render() {
    let { on, props = {}, attrs, title, op } = this.crud.search.adv;
    let form = renderForm.call(this);

    return (
      this.visible && (
        <el-drawer
          {...{
            attrs,
            props: {
              direction: 'rtl',
              title,
              ...props,
              visible: this.visible
            },
            on: {
              'update:visible': f => {
                this.visible = f;
              },
              ...on
            }
          }}>
          <div class="crud-adv-search__drawer">
            <div class="crud-adv-search__drawer-container">{form}</div>

            <div class="crud-adv-search__drawer-footer">
              <el-button size="medium" type="primary" on-click={this.search}>
                {op.confirmButtonText}
              </el-button>
              <el-button size="medium" on-click={this.reset}>
                {op.resetButtonText}
              </el-button>
            </div>
          </div>
        </el-drawer>
      )
    );
  }
};
