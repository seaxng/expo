"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBareExtensions = getBareExtensions;
exports.getExtensions = getExtensions;
exports.getLanguageExtensionsInOrder = getLanguageExtensionsInOrder;
exports.getPlatformExtensions = getPlatformExtensions;
function _assert() {
  const data = _interopRequireDefault(require("assert"));
  _assert = function () {
    return data;
  };
  return data;
}
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function getExtensions(platforms, extensions, workflows) {
  // In the past we used spread operators to collect the values so now we enforce type safety on them.
  (0, _assert().default)(Array.isArray(platforms), 'Expected: `platforms: string[]`');
  (0, _assert().default)(Array.isArray(extensions), 'Expected: `extensions: string[]`');
  (0, _assert().default)(Array.isArray(workflows), 'Expected: `workflows: string[]`');
  const fileExtensions = [];
  // support .expo files
  for (const workflow of [...workflows, '']) {
    // Ensure order is correct: [platformA.js, platformB.js, js]
    for (const platform of [...platforms, '']) {
      // Support both TypeScript and JavaScript
      for (const extension of extensions) {
        fileExtensions.push([platform, workflow, extension].filter(Boolean).join('.'));
      }
    }
  }
  return fileExtensions;
}
function getLanguageExtensionsInOrder({
  isTS,
  isModern,
  isReact
}) {
  // @ts-ignore: filter removes false type
  const addLanguage = lang => [lang, isReact && `${lang}x`].filter(Boolean);

  // Support JavaScript
  let extensions = addLanguage('js');
  if (isModern) {
    extensions.unshift('mjs');
  }
  if (isTS) {
    extensions = [...addLanguage('ts'), ...extensions];
  }
  return extensions;
}
function getBareExtensions(platforms, languageOptions = {
  isTS: true,
  isModern: true,
  isReact: true
}) {
  const fileExtensions = getExtensions(platforms, getLanguageExtensionsInOrder(languageOptions), []);
  // Always add these last
  _addMiscellaneousExtensions(platforms, fileExtensions);
  return fileExtensions;
}
const PLATFORM_EXTENSIONS = {
  tvos: ['tvos', 'ios', 'native'],
  macos: ['macos', 'ios', 'native']
};
const _platformExtensionsCache = new Map();

/** Expand `extensions` with OOT platform extensions for platform */
function getPlatformExtensions(platform, extensions) {
  const platforms = PLATFORM_EXTENSIONS[platform];
  if (!platforms) {
    return null;
  }
  const cached = _platformExtensionsCache.get(platform);
  if (cached?.sourceExts === extensions) {
    return cached.result;
  }
  const result = getExtensions(platforms, extensions, []);
  if (cached != null) {
    cached.sourceExts = extensions;
    cached.result = result;
  } else {
    _platformExtensionsCache.set(platform, {
      sourceExts: extensions,
      result
    });
  }
  return result;
}
function _addMiscellaneousExtensions(platforms, fileExtensions) {
  // Always add these with no platform extension
  // In the future we may want to add platform and workspace extensions to json.
  fileExtensions.push('json');
  // Native doesn't currently support web assembly.
  if (platforms.includes('web')) {
    fileExtensions.push('wasm');
  }
  return fileExtensions;
}
//# sourceMappingURL=extensions.js.map