export default {
  name: 'data-table',

  inject: ['crud'],

  computed: {
    table() {
      return this.crud.table;
    }
  },

  data() {
    return {
      maxHeight: null
    };
  },

  methods: {
    column_handler(scope) {
      let value = scope.row[scope.prop];

      if (scope.dict) {
        let item = scope.dict.find(d => d.value == value);

        if (item) {
          value = item.label;
        }
      }

      return scope.slot ? '' : value || scope.emptyText;
    },

    sort(prop, order) {
      this.$refs['table'].sort(prop, order);
    },

    clearSort() {
      this.$refs['table'].clearSort();
    },

    selectionChange(selection) {
      const { ['selection-change']: selectionChange } = this.table.on || {};
      this.table.selection = selection;

      if (selectionChange) {
        selectionChange(selection);
      }
    },

    sortChange(value) {
      this.$emit('sort-change', value);
    },

    calcHeight() {
      const el = document.querySelector('.crud-index');
      const { height = '' } = this.table.props || {};

      if (el) {
        let rows = document.querySelectorAll('.crud-index > .el-row');

        let h = 20;

        for (let i = 0; i < rows.length; i++) {
          let f = true;

          for (let j = 0; j < rows[i].childNodes.length; j++) {
            if (rows[i].childNodes[j].className == 'data-table') {
              f = false;
            }
          }

          if (f) {
            h += rows[i].clientHeight + 10;
          }
        }

        let h1 = Number(String(height).replace('px', ''));
        let h2 = el.clientHeight - h;

        this.maxHeight = h1 > h2 ? h1 : h2;
      }
    },

    resize() {
      this.calcHeight();
    }
  },

  mounted() {
    window.onresize = () => {
      this.resize();
    };

    this.resize();
  },

  render() {
    const { rowEdit, rowDelete, dict, permission } = this.crud;
    const { data, props, on, columns, op, loading } = this.table;

    let columnEl = columns
      .filter(e => !e.hidden)
      .map(item => {
        let params = {
          props: item,
          on: item.on
        };

        if (!item.type) {
          params.scopedSlots = {
            default: scope => {
              let rn = this.$scopedSlots[`table-column-${item.prop}`];

              let newScope = {
                ...scope,
                ...item
              };

              if (rn) {
                return rn({
                  scope: newScope
                });
              } else {
                return this.column_handler(newScope);
              }
            },
            header: scope => {
              let rn = this.$scopedSlots[`table-header-${item.prop}`];

              if (rn) {
                return rn({
                  scope
                });
              } else {
                return scope.column.label;
              }
            }
          };
        }

        return <el-table-column {...params} />;
      });

    let opEl = (
      <el-table-column
        {...{
          props: op.props,
          scopedSlots: {
            default: scope => {
              return (
                <div class="column-op">
                  {op.layout.map(vnode => {
                    if (typeof vnode == 'string') {
                      if (vnode.includes('slot-')) {
                        let rn = this.$scopedSlots[vnode];

                        if (rn) {
                          return rn({
                            scope
                          });
                        }
                      } else {
                        switch (vnode) {
                          case 'edit':
                            return (
                              permission.update && (
                                <el-button
                                  size="mini"
                                  type="text"
                                  {...{
                                    on: {
                                      click: () => {
                                        rowEdit(scope.row);
                                      }
                                    }
                                  }}>
                                  {dict.label.update}
                                </el-button>
                              )
                            );
                          case 'delete':
                            return (
                              permission.delete && (
                                <el-button
                                  size="mini"
                                  type="text"
                                  {...{
                                    on: {
                                      click: () => {
                                        rowDelete(scope.row);
                                      }
                                    }
                                  }}>
                                  {dict.label.delete}
                                </el-button>
                              )
                            );
                        }
                      }
                    }
                  })}
                </div>
              );
            }
          }
        }}
      />
    );

    return (
      <div class="data-table">
        {
          <el-table
            ref="table"
            data={data}
            on-selection-change={this.selectionChange}
            on-sort-change={this.sortChange}
            v-loading={loading}
            max-height={this.maxHeight + 'px'}
            {...{
              on,
              props
            }}>
            {columnEl}
            {op.visible && opEl}
          </el-table>
        }
      </div>
    );
  }
};
