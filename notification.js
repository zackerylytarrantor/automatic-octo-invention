"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveProcessLogLevelUpdatedNotification = exports.SpringIndexUpdatedNotification = exports.LiveProcessMemoryMetricsUpdatedNotification = exports.LiveProcessGcPausesMetricsUpdatedNotification = exports.LiveProcessUpdatedNotification = exports.LiveProcessDisconnectedNotification = exports.LiveProcessConnectedNotification = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
var LiveProcessConnectedNotification;
(function (LiveProcessConnectedNotification) {
    LiveProcessConnectedNotification.type = new vscode_languageclient_1.NotificationType('sts/liveprocess/connected');
})(LiveProcessConnectedNotification = exports.LiveProcessConnectedNotification || (exports.LiveProcessConnectedNotification = {}));
var LiveProcessDisconnectedNotification;
(function (LiveProcessDisconnectedNotification) {
    LiveProcessDisconnectedNotification.type = new vscode_languageclient_1.NotificationType('sts/liveprocess/disconnected');
})(LiveProcessDisconnectedNotification = exports.LiveProcessDisconnectedNotification || (exports.LiveProcessDisconnectedNotification = {}));
var LiveProcessUpdatedNotification;
(function (LiveProcessUpdatedNotification) {
    LiveProcessUpdatedNotification.type = new vscode_languageclient_1.NotificationType('sts/liveprocess/updated');
})(LiveProcessUpdatedNotification = exports.LiveProcessUpdatedNotification || (exports.LiveProcessUpdatedNotification = {}));
var LiveProcessGcPausesMetricsUpdatedNotification;
(function (LiveProcessGcPausesMetricsUpdatedNotification) {
    LiveProcessGcPausesMetricsUpdatedNotification.type = new vscode_languageclient_1.NotificationType('sts/liveprocess/gcpauses/metrics/updated');
})(LiveProcessGcPausesMetricsUpdatedNotification = exports.LiveProcessGcPausesMetricsUpdatedNotification || (exports.LiveProcessGcPausesMetricsUpdatedNotification = {}));
var LiveProcessMemoryMetricsUpdatedNotification;
(function (LiveProcessMemoryMetricsUpdatedNotification) {
    LiveProcessMemoryMetricsUpdatedNotification.type = new vscode_languageclient_1.NotificationType('sts/liveprocess/memory/metrics/updated');
})(LiveProcessMemoryMetricsUpdatedNotification = exports.LiveProcessMemoryMetricsUpdatedNotification || (exports.LiveProcessMemoryMetricsUpdatedNotification = {}));
var SpringIndexUpdatedNotification;
(function (SpringIndexUpdatedNotification) {
    SpringIndexUpdatedNotification.type = new vscode_languageclient_1.NotificationType('spring/index/updated');
})(SpringIndexUpdatedNotification = exports.SpringIndexUpdatedNotification || (exports.SpringIndexUpdatedNotification = {}));
var LiveProcessLogLevelUpdatedNotification;
(function (LiveProcessLogLevelUpdatedNotification) {
    LiveProcessLogLevelUpdatedNotification.type = new vscode_languageclient_1.NotificationType('sts/liveprocess/loglevel/updated');
})(LiveProcessLogLevelUpdatedNotification = exports.LiveProcessLogLevelUpdatedNotification || (exports.LiveProcessLogLevelUpdatedNotification = {}));
//# sourceMappingURL=notification.js.map