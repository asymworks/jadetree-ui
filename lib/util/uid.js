/** Unique Id Generator */
import qinu from 'qinu';
/** @private Item UID Generator */
const uid = qinu.create({
    length: 6,
    template: "%arg[0]%-%qinu%"
});
export default uid;
