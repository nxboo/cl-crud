export const DialogDrag = {
  bind(el, binding, vnode, oldVnode) {
    const dlg = el.querySelector('.el-dialog');
    const hdr = el.querySelector('.el-dialog__header');
    const sty = dlg.currentStyle || window.getComputedStyle(dlg, null);
    const pad = 5;
    const { dialog, props } = binding.value;
    const { drag, fullscreen, top } = props;

    if (dialog.drag === null) {
      dialog.drag = drag;
    }

    dlg.style.marginTop = 0;
    dlg.style.marginBottom = 0;
    dlg.style.top = fullscreen ? 0 : top;

    const moveDown = e => {
      const { clientWidth, clientHeight } = document.body;
      const { fullscreen, drag } = binding.value.dialog;

      if (fullscreen) {
        return false;
      }

      if (drag === false || !drag) {
        return false;
      }

      const disX = e.clientX - hdr.offsetLeft;
      const disY = e.clientY - hdr.offsetTop;

      let styL, styT;

      if (sty.left.includes('%')) {
        styL = +clientWidth * (+sty.left.replace(/\%/g, '') / 100);
        styT = +clientHeight * (+sty.top.replace(/\%/g, '') / 100);
      } else {
        styL = +sty.left.replace(/\px/g, '');
        styT = +sty.top.replace(/\px/g, '');
      }

      const minL = -(clientWidth - dlg.clientWidth) / 2 + pad;
      const maxL =
        (dlg.clientWidth >= clientWidth / 2
          ? dlg.clientWidth / 2 - (dlg.clientWidth - clientWidth / 2)
          : dlg.clientWidth / 2 + clientWidth / 2 - dlg.clientWidth) - pad;

      const minT = pad;
      const maxT = clientHeight - dlg.clientHeight - pad;

      document.onmousemove = function(e) {
        if (drag === false || !drag) {
          return false;
        }

        let l = e.clientX - disX + styL;
        let t = e.clientY - disY + styT;

        if (l < minL) {
          l = minL;
        } else if (l >= maxL) {
          l = maxL;
        }

        if (t < minT) {
          t = minT;
        } else if (t >= maxT) {
          t = maxT;
        }

        dlg.style.top = t + 'px';
        dlg.style.left = l + 'px';
      };

      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };

    hdr.onmousedown = moveDown;
  },
  update(el, binding) {
    const dlg = el.querySelector('.el-dialog');
    const { props, dialog } = binding.value;
    const { top } = props;
    const { fullscreen, drag } = dialog;

    dialog.drag = dlg.clientHeight <= document.body.clientHeight;

    if (drag === false) {
      dlg.style.marginTop = fullscreen ? 0 : top;
      dlg.style.marginBottom = fullscreen ? 0 : '50px';
      dlg.style.top = 0;

      document.onmousemove = null;
      document.onmouseup = null;
    }

    if (drag === true) {
      dlg.style.marginTop = 0;
      dlg.style.marginBottom = 0;
      dlg.style.top = fullscreen ? 0 : top;
    }
  }
};
