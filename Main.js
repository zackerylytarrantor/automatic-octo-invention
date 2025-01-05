'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const OS = __importStar(require("os"));
const vscode_1 = require("vscode");
const commons = __importStar(require("@pivotal-tools/commons-vscode"));
const liveHoverUi = __importStar(require("./live-hover-connect-ui"));
const rewrite = __importStar(require("./rewrite"));
const debug_config_provider_1 = require("./debug-config-provider");
const apiManager_1 = require("./apiManager");
const classpath_1 = require("@pivotal-tools/commons-vscode/lib/classpath");
const java_data_1 = require("@pivotal-tools/commons-vscode/lib/java-data");
const setLogLevelUi = __importStar(require("./set-log-levels-ui"));
const test_jar_launch_1 = require("./test-jar-launch");
const convert_props_yaml_1 = require("./convert-props-yaml");
const copilot_1 = require("./copilot");
const springBootAgent = __importStar(require("./copilot/springBootAgent"));
const guideApply_1 = require("./copilot/guideApply");
const util_1 = require("./copilot/util");
const copilotRequest_1 = __importStar(require("./copilot/copilotRequest"));
const PROPERTIES_LANGUAGE_ID = "spring-boot-properties";
const YAML_LANGUAGE_ID = "spring-boot-properties-yaml";
const JAVA_LANGUAGE_ID = "java";
const XML_LANGUAGE_ID = "xml";
const FACTORIES_LANGUAGE_ID = "spring-factories";
const JPA_QUERY_PROPERTIES_LANGUAGE_ID = "jpa-query-properties";
const STOP_ASKING = "Stop Asking";
/** Called when extension is activated */
function activate(context) {
    // registerPipelineGenerator(context);
    let options = {
        DEBUG: false,
        CONNECT_TO_LS: false,
        extensionId: 'vscode-spring-boot',
        preferJdk: true,
        jvmHeap: '1024m',
        vmArgs: [
            "-Dspring.config.location=classpath:/application.properties"
        ],
        checkjvm: (context, jvm) => {
            let version = jvm.getMajorVersion();
            if (version < 17) {
                throw Error(`Spring Tools Language Server requires Java 17 or higher to be launched. Current Java version is ${version}`);
            }
            if (!jvm.isJdk()) {
                vscode_1.window.showWarningMessage('JAVA_HOME or PATH environment variable seems to point to a JRE. A JDK is required, hence Boot Hints are unavailable.', STOP_ASKING).then(selection => {
                    if (selection === STOP_ASKING) {
                        options.workspaceOptions.update('checkJVM', false);
                    }
                });
            }
        },
        workspaceOptions: vscode_1.workspace.getConfiguration("spring-boot.ls"),
        clientOptions: {
            markdown: {
                isTrusted: true
            },
            uriConverters: {
                code2Protocol: (uri) => {
                    /*
    * Workaround for docUri coming from vscode-languageclient on Windows
    *
    * It comes in as "file:///c%3A/Users/ab/spring-petclinic/src/main/java/org/springframework/samples/petclinic/owner/PetRepository.java"
    *
    * While symbols index would have this uri instead:
    * - "file:///C:/Users/ab/spring-petclinic/src/main/java/org/springframework/samples/petclinic/owner/PetRepository.java"
    *
    * i.e. lower vs upper case drive letter and escaped drive colon
    */
                    if (OS.platform() === "win32" && uri.scheme === 'file') {
                        let uriStr = uri.toString();
                        let idx = 5; // skip through `file:
                        for (; idx < uriStr.length - 1 && uriStr.charAt(idx) === '/'; idx++) { }
                        if (idx < uriStr.length - 1) {
                            // replace c%3A with C: or c: with C:
                            const replaceEscapedColon = idx < uriStr.length - 4 && uriStr.substring(idx + 1, idx + 4) === '%3A';
                            uriStr = `${uriStr.substring(0, idx)}${uriStr.charAt(idx).toUpperCase()}${replaceEscapedColon ? ':' : ''}${uriStr.substring(idx + (replaceEscapedColon ? 4 : 1))}`;
                        }
                        return uriStr;
                    }
                    return uri.toString();
                },
                protocol2Code: uri => vscode_1.Uri.parse(uri)
            },
            // See PT-158992999 as to why a scheme is added to the document selector
            // documentSelector: [ PROPERTIES_LANGUAGE_ID, YAML_LANGUAGE_ID, JAVA_LANGUAGE_ID ],
            documentSelector: [
                {
                    language: PROPERTIES_LANGUAGE_ID,
                    scheme: 'file'
                },
                {
                    language: YAML_LANGUAGE_ID,
                    scheme: 'file'
                },
                {
                    language: JAVA_LANGUAGE_ID,
                    scheme: 'file'
                },
                {
                    language: JAVA_LANGUAGE_ID,
                    scheme: 'jdt'
                },
                {
                    language: XML_LANGUAGE_ID,
                    scheme: 'file'
                },
                {
                    language: FACTORIES_LANGUAGE_ID,
                    scheme: 'file'
                },
                {
                    language: JPA_QUERY_PROPERTIES_LANGUAGE_ID,
                    pattern: "**/jpa-named-queries.properties"
                }
            ],
            synchronize: {
                configurationSection: ['boot-java', 'spring-boot', 'http']
            },
            initializationOptions: () => ({
                workspaceFolders: vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders.map(f => f.uri.toString()) : null,
                // Do not enable JDT classpath listeners at the startup - classpath service would enable it later if needed based on the Java extension mode
                // Classpath service registration requires commands to be registered and Boot LS needs to register classpath 
                // listeners when client has callbacks for STS4 extension java related messages registered via JDT classpath and Data Service registration
                enableJdtClasspath: false
            })
        },
        highlightCodeLensSettingKey: 'boot-java.highlight-codelens.on'
    };
    // Register launch config contributior to java debug launch to be able to connect to JMX
    context.subscriptions.push((0, debug_config_provider_1.startDebugSupport)());
    return commons.activate(options, context).then(client => {
        vscode_1.commands.registerCommand('vscode-spring-boot.ls.start', () => client.start().then(() => {
            // Boot LS is fully started
            (0, classpath_1.registerClasspathService)(client);
            (0, java_data_1.registerJavaDataService)(client);
            (0, copilot_1.activateCopilotFeatures)(context);
            // Force classpath listener to be enabled. Boot LS can only be launched iff classpath is available and there Spring-Boot on the classpath somewhere.
            vscode_1.commands.executeCommand('sts.vscode-spring-boot.enableClasspathListening', true);
            // Register TestJars launch support
            context.subscriptions.push((0, test_jar_launch_1.startTestJarSupport)());
        }));
        vscode_1.commands.registerCommand('vscode-spring-boot.ls.stop', () => client.stop());
        liveHoverUi.activate(client, options, context);
        rewrite.activate(client, options, context);
        setLogLevelUi.activate(client, options, context);
        (0, convert_props_yaml_1.startPropertiesConversionSupport)(context);
        if (util_1.isLlmApiReady)
            activateSpringBootParticipant(context);
        else
            vscode_1.window.showInformationMessage("Spring Boot chat participant is not available. Please use the vscode insiders version 1.90.0 or above and make sure all `lm` API is enabled.");
        registerMiscCommands(context);
        vscode_1.commands.registerCommand('vscode-spring-boot.agent.apply', guideApply_1.applyLspEdit);
        return new apiManager_1.ApiManager(client).api;
    });
}
exports.activate = activate;
function registerMiscCommands(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand('vscode-spring-boot.spring.modulith.metadata.refresh', () => __awaiter(this, void 0, void 0, function* () {
        const modulithProjects = yield vscode_1.commands.executeCommand('sts/modulith/projects');
        const projectNames = Object.keys(modulithProjects);
        if (projectNames.length === 0) {
            vscode_1.window.showErrorMessage('No Spring Modulith projects found');
        }
        else {
            const projectName = projectNames.length === 1 ? projectNames[0] : yield vscode_1.window.showQuickPick(projectNames, { placeHolder: "Select the target project." });
            vscode_1.commands.executeCommand('sts/modulith/metadata/refresh', modulithProjects[projectName]);
        }
    })), vscode_1.commands.registerCommand('vscode-spring-boot.open.url', (openUrl) => {
        const openWithExternalBrowser = vscode_1.workspace.getConfiguration("spring.tools").get("openWith") === "external";
        const browserCommand = openWithExternalBrowser ? "vscode.open" : "simpleBrowser.api.open";
        return vscode_1.commands.executeCommand(browserCommand, vscode_1.Uri.parse(openUrl));
    }));
}
function activateSpringBootParticipant(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const model = (_a = (yield vscode_1.lm.selectChatModels(copilotRequest_1.default.DEFAULT_MODEL_SELECTOR))) === null || _a === void 0 ? void 0 : _a[0];
        if (!model) {
            const models = yield vscode_1.lm.selectChatModels();
            copilotRequest_1.logger.error(`Not a suitable model. The available models are: [${models.map(m => m.name).join(', ')}]. Please make sure you have installed the latest "GitHub Copilot Chat" (v0.16.0 or later) and all \`lm\` API is enabled.`);
            return;
        }
        springBootAgent.activate(context);
    });
}
//# sourceMappingURL=Main.js.map