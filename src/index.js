import { __crud, __vue, __components, __plugins } from './options';
import { deepMerge } from './utils/index';
import { DialogDrag } from './directive/index';
import Crud from './crud/index';
import Form from './crud/lib/form';
import './common/index';

export const CRUD = {
    version: '1.6.42',

    install: function(Vue, options = {}) {
        const { crud, components, plugins, version = '' } = options;

        const Ver = name => {
            return `${name}${version}`;
        };

        deepMerge(__crud, crud);
        deepMerge(__vue, Vue);
        deepMerge(__components, components);
        deepMerge(__plugins, plugins);

        Vue.directive('dialog-drag', DialogDrag);

        Vue.component(Ver('cl-crud'), Crud({ __crud, __components }));
        Vue.component(Ver('cl-form'), Form);
    }
};

export default CRUD;
