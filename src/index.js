import './common/index';
import { __crud, __vue } from './options';
import { deepMerge } from './utils/index';
import Crud from './crud/index';
import Form from './crud/lib/form';

export default {
  install: function(Vue, options = {}) {
    const { crud, version = '' } = options;

    const v = name => {
      return `${name}${version}`;
    };

    deepMerge(__crud, crud);
    deepMerge(__vue, Vue);

    Vue.component(v('cl-crud'), Crud);
    Vue.component(v('cl-form'), Form);
  }
};
