import { NotificationType } from "vscode-languageclient";
/**
 * Common information provided by all live process notifications, for all types
 * of events and for all types of processes.
 */
export interface LiveProcess {
    type: string;
    processKey: string;
    processName: string;
}
/**
 * Information returned by notification for updated log level for the live process
 */
export interface LiveProcessUpdatedLogLevel {
    type: string;
    processKey: string;
    processName: string;
    packageName: string;
    effectiveLevel: string;
    configuredLevel: string;
}
/**
 * Specialized interface for type 'local' LiveProcess.
 */
export interface LocalLiveProcess extends LiveProcess {
    type: "local";
    pid: string;
}
export declare namespace LiveProcessConnectedNotification {
    const type: NotificationType<LiveProcess>;
}
export declare namespace LiveProcessDisconnectedNotification {
    const type: NotificationType<LiveProcess>;
}
export declare namespace LiveProcessUpdatedNotification {
    const type: NotificationType<LiveProcess>;
}
export declare namespace LiveProcessGcPausesMetricsUpdatedNotification {
    const type: NotificationType<LiveProcess>;
}
export declare namespace LiveProcessMemoryMetricsUpdatedNotification {
    const type: NotificationType<LiveProcess>;
}
export declare namespace SpringIndexUpdatedNotification {
    const type: NotificationType<void>;
}
export declare namespace LiveProcessLogLevelUpdatedNotification {
    const type: NotificationType<LiveProcessUpdatedLogLevel>;
}
