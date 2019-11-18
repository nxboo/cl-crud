import { deepMerge, isFunction, dataset, certainProperty } from '../utils';

export const bootstrap = that => {
  // eslint-disable-next-line
  const {
    table,
    upsert,
    tips,
    dict,
    conf,
    search,
    layout,
    refresh,
    params,
    pagination,
    permission,
    fn
  } = that;

  const app = {
    refs(k) {
      const { upsert, table, [`adv-search`]: advSearch } = that.$refs;

      const refs = (that.refs = {
        table: table.$refs['table'],
        upsert,
        advSearch
      });

      return k ? refs[k] : refs;
    },

    component() {
      return that;
    },

    data(p) {
      return dataset(
        certainProperty(that, [
          'service',
          'conf',
          'tips',
          'dict',
          'table',
          'search',
          'upsert',
          'pagination',
          'params',
          'layout'
        ]),
        p
      );
    },

    setData(p, d) {
      deepMerge(
        that,
        dataset(
          certainProperty(that, [
            'service',
            'conf',
            'tips',
            'dict',
            'table',
            'search',
            'upsert',
            'pagination',
            'params',
            'layout'
          ]),
          p,
          d
        )
      );
    },

    changeSort(prop, order) {
      that.changeSort(prop, order);
    },

    clearSort() {
      that.clearSort();
    },

    delete(...d) {
      that.rowDelete.apply(this, d);
    },

    info(d) {
      return that.service.info(d);
    },

    add(d) {
      that.rowAdd(d);
    },

    append(d) {
      that.rowAppend(d);
    },

    edit(d) {
      that.rowEdit(d);
    },

    close(d) {
      that.rowClose(d);
    },

    renderList(d) {
      that.table.data = d;
      that.table.loading = false;
    },

    refresh(d) {
      isFunction(d) ? d(that.params, refresh) : refresh(d);
    }
  };

  const ctx = data => {
    deepMerge(that, data);

    return ctx;
  };

  ctx.conf = d => {
    deepMerge(conf, d);

    return ctx;
  };

  ctx.service = d => {
    that.service = d;

    return ctx;
  };

  ctx.permission = x => {
    if (isFunction(x)) {
      fn.permission = x;
    } else {
      deepMerge(that.permission, x);
      fn.permission = null;
    }

    return ctx;
  };

  ctx.set = (n, x) => {
    let a = that[n];
    let b = isFunction(x) ? x(a) : x;

    if (n == 'table') {
      if (b.props) {
        const { order, prop } = b.props['default-sort'] || {};

        params.order = !order ? '' : order == 'descending' ? 'desc' : 'asc';
        params.prop = prop;
      }
    }

    if (n == 'adv') {
      a = that.search.adv;
    }

    if (n == 'layout') {
      that[n] = b;
    } else {
      deepMerge(a, b);
    }

    return ctx;
  };

  ctx.on = (name, fn) => {
    that.fn[name] = fn;

    return ctx;
  };

  ctx.done = async cb => {
    const next = () => {
      that.done();

      if (fn.permission) {
        Object.assign(that.permission, fn.permission(that));
      }
    };

    if (isFunction(cb)) {
      await cb(next);
    } else {
      next();
    }

    console.log('ctx done');
  };

  return { ctx, app };
};