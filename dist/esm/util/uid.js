/*! JtControls v0.2.1 | (c) 2023 Jonathan Krauss | BSD-3-Clause License | git+https://github.com/asymworks/jadetree-ui.git */
import qinu from 'qinu';

/** Unique Id Generator */
/** @private Item UID Generator */
const uid = qinu.create({
    length: 6,
    template: "%arg[0]%-%qinu%"
});

export { uid as default };
