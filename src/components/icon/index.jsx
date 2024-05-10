import { createFromIconfontCN } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * font icon How to use:
 * <Icon type="icon-kafka"/>
 * 参考：
 * https://ant.design/components/icon-cn/#components-icon-demo-iconfont
 * https://www.iconfont.cn/
 * */
const IconFont = createFromIconfontCN({
    // Each project creates its own scriptUrl on iconfont.cn
    scriptUrl: '//at.alicdn.com/t/font_2363884_0xyjyu18wny.js',
});

IconFont.propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    rotate: PropTypes.number,
    spin: PropTypes.bool,
    twoToneColor: PropTypes.string,
};

export default IconFont;
