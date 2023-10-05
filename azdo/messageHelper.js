define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageHelper = void 0;
    var MessageHelper = /** @class */ (function () {
        function MessageHelper() {
        }
        MessageHelper.prototype.format = function (workItemIds) {
            return "Selected work item ids: ".concat(workItemIds.join(", "));
        };
        return MessageHelper;
    }());
    exports.MessageHelper = MessageHelper;
});
//# sourceMappingURL=messageHelper.js.map