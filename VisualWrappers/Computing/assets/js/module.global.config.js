var appUi = {
  viewJsPlumb: $("#draw-canvas"),
}

/**
 * JSPlumb Global config variables
 * @type {number}
 */
// Init code
var POS_TRUE_ENDPOINT = 0,
  POS_FALSE_ENDPOINT = 1,
  POS_INPUT_ENDPOINT = 2,
  POS_ELEMENT_ID = 3,
  POS_ELEMENT_NAME = 4,
  POS_ELEMENT_TYPE = 5,
  POS_ELEMENT_STATUS = 6,
  POS_ELEMENT_PROPERTIES = 7,
  POS_ELEMENT_IMAGE_PATH = 8,
  POS_ELEMENT_HTML_TEMPLATE = 9,
  POS_ELEMENT_OPERATOR = 10,
  POS_ELEMENT_SOCKET = 11,
  POS_ELEMENT_PIN = 12,
  POS_ELEMENT_TAG = 13,
  POS_ELEMENT_DEBUG = 14,
  POS_ELEMENT_HTML_TEMPLATE_WIDTH = 15,
  POS_ELEMENT_HTML_TEMPLATE_HEIGHT = 16,
  POS_ELEMENT_VERSION = 17,
  POS_ELEMENT_UNREGISTER_EVENT = 18,
  GUEST_LOGIN = "GUEST_LOGIN",
  STATUS_OK = 0,
  STATUS_DUPLICATE_TEMPLATE_NAME = 2,
  STATUS_DUPLICATE_VIEW_NAME = 4,
  templateDialog,
  templatesDialog,
  exportDialog,
  toolboxDialog,
  propertiesDialog,
  guestInfoDialog,
  wizardDialog,
  templateSettingsDialog,
  sharedTemplatesDialog,
  sharedTemplateDialog,
  sharedTemplateNameDialog,
  viewsDialog,
  verifyDialog,
  copyTemplateDialog,
  versionsInfoDialog,
  experiencePageDialog,
  addElementToExperienceDialog,
  addNewGraphDialog,
  experienceViewDialog,
  experienceViewsDialog,
  experienceDetailsDialog,
  propertyBleGattServicesDialog,
  bleGattCharacteristicDialog,
  propertyOneWireCommandsDialog,
  oneWireCommandDialog,
  trueAnchors = [
    [0.2, 0, 0, -1, 0, 0, "foo"],
    [1, 0.2, 1, 0, 0, 0, "bar"],
    [0.8, 1, 0, 1, 0, 0, "baz"],
    [0, 0.8, -1, 0, 0, 0, "qux"]
  ],
  falseAnchors = [
    [0.6, 0, 0, -1],
    [1, 0.6, 1, 0],
    [0.4, 1, 0, 1],
    [0, 0.4, -1, 0]
  ],
  inputAnchors = [
    [0, 0.5, -1, 0],
    [0.5, 0, 1, 0],
    [1, 0.5, 0, 1],
    [0.5, 1, -1, 0]
  ],
  colorInputConnector = "#A9A9A9",
  colorTrueConnector = "#008000",
  colorFalseConnector = "#FF0000",
  connector = [
    "Flowchart",
    { cssClass: "connectorClass", hoverClass: "connectorHoverClass" }
  ],
  connectorTrueStyle = {
    gradient: {
      stops: [
        [0, colorTrueConnector],
        [0.5, "#008000"],
        [1, colorTrueConnector]
      ]
    },
    lineWidth: 1,
    strokeStyle: colorTrueConnector
  },
  connectorFalseStyle = {
    gradient: {
      stops: [
        [0, colorFalseConnector],
        [0.5, "#FF0000"],
        [1, colorFalseConnector]
      ]
    },
    lineWidth: 1,
    strokeStyle: colorFalseConnector
  },
  connectorInputStyle = {
    gradient: {
      stops: [
        [0, colorInputConnector],
        [0.5, "#09998f"],
        [1, colorInputConnector]
      ]
    },
    lineWidth: 1,
    strokeStyle: colorInputConnector
  },
  hoverTrueStyle = {
    strokeStyle: "#449999"
  },
  hoverFalseStyle = {
    strokeStyle: "#4000999"
  },
  hoverInputStyle = {
    strokeStyle: "#4000999"
  },
  trueOverlays = [["Diamond", { fillStyle: "#09098e", width: 8, length: 10 }]],
  falseOverlays = [["Diamond", { fillStyle: "#09099f", width: 8, length: 10 }]],
  inputOverlays = [["Diamond", { fillStyle: "#09099f", width: 8, length: 10 }]],
  trueEndpoint = [
    "Dot",
    { cssClass: "endpointClass", radius: 10, hoverClass: "endpointHoverClass" }
  ],
  falseEndpoint = [
    "Dot",
    { cssClass: "endpointClass", radius: 10, hoverClass: "endpointHoverClass" }
  ],
  inputEndpoint = [
    "Dot",
    { cssClass: "endpointClass", radius: 10, hoverClass: "endpointHoverClass" }
  ],
  trueEndpointStyle = { fillStyle: colorTrueConnector },
  falseEndpointStyle = { fillStyle: colorFalseConnector },
  inputEndpointStyle = { fillStyle: colorInputConnector },
  TrueEndpoint = {
    endpoint: trueEndpoint,
    paintStyle: trueEndpointStyle,
    hoverPaintStyle: { fillStyle: "#449999" },
    isSource: true,
    isTarget: false,
    scope: "aaa",
    maxConnections: -1,
    connector: connector,
    connectorStyle: connectorTrueStyle,
    connectorHoverStyle: hoverTrueStyle,
    connectorOverlays: trueOverlays
  },
  FalseEndpoint = {
    endpoint: falseEndpoint,
    paintStyle: falseEndpointStyle,
    hoverPaintStyle: { fillStyle: "#449999" },
    isSource: true,
    isTarget: false,
    scope: "aaa",
    maxConnections: -1,
    connector: connector,
    connectorStyle: connectorFalseStyle,
    connectorHoverStyle: hoverFalseStyle,
    connectorOverlays: falseOverlays
  },
  InputEndpoint = {
    endpoint: inputEndpoint,
    paintStyle: inputEndpointStyle,
    hoverPaintStyle: { fillStyle: "#449999" },
    isSource: false,
    isTarget: true,
    scope: "aaa",
    maxConnections: -1,
    connector: connector,
    connectorStyle: connectorInputStyle,
    connectorHoverStyle: hoverInputStyle,
    connectorOverlays: inputOverlays
  },
  instance,
  endpoints = {},
  currentlySelectedItem;