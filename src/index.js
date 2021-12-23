import Vue from 'vue';
import Map from './Map.vue';

const SIZE = {
    SMALL: 'small',
    MIDDLE: 'middle',
    LARGE: 'large'
}

function install(editor, params) {
    Vue.observable(params);
    params.enable = params.enable !== false;
    params.size = params.size || SIZE.MIDDLE;

    const el = document.createElement('div');
    const component = params.vueComponent || Map;
    const options = params.vueOptions || {};

    editor.view.container.appendChild(el);

    const app = new Vue({
        ...options,
        render: h => params.enable ? h(component, {
            props: {
                size: params.size,
                nodes: editor.nodes,
                views: editor.view.nodes,
                view: editor.view
            }
        }) : null
    }).$mount(el);

    const updateTransform = () => app.$children[0] && app.$children[0].updateTransform();

    editor.on('nodetranslated nodecreated noderemoved translated zoomed', updateTransform);
    window.addEventListener('resize', updateTransform)

    editor.on('destroy', () => {
        window.removeEventListener('resize', updateTransform)
    })
}

export default {
    install,
    MiniMapComponent: Map,
    ...SIZE
}