===================================================================
--- Current Version
+++ New Version
@@ -1,7 +1,7 @@
 // ==UserScript==
 // @name         Hydra
-// @version      3.87
+// @version      3.88
 // @description  NASC Ops Chase Tool
 // @author       eddobrev, dylbecke
 // @updateURL    https://axzile.corp.amazon.com/-/carthamus/download_script/hydra.user.js
 // @downloadURL  https://axzile.corp.amazon.com/-/carthamus/download_script/hydra.user.js
@@ -23689,10 +23689,13 @@
         aiInit();
         // Version check — notify user if newer version exists on code.amazon.com
         (function checkForUpdate() {
             var CURRENT_VERSION = (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) || '2.24';
-            var UPDATE_URL = 'https://raw.githubusercontent.com/edobre4/Hydra/main/Hydra.user.js';
-            var META_URL = 'https://raw.githubusercontent.com/edobre4/Hydra/main/Hydra.meta.js';
+            // Check against the live Carthamus copy (the actual deploy target),
+            // NOT a GitHub mirror. Both URLs point at the same served file; the
+            // metadata block at the top is enough to read @version.
+            var UPDATE_URL = 'https://axzile.corp.amazon.com/-/carthamus/download_script/hydra.user.js';
+            var META_URL = 'https://axzile.corp.amazon.com/-/carthamus/download_script/hydra.user.js';
             function _cmpVer(x, y) {
                 var xa = String(x).split('.'), ya = String(y).split('.');
                 for (var i = 0; i < Math.max(xa.length, ya.length); i++) {
                     var xi = parseInt(xa[i] || '0', 10), yi = parseInt(ya[i] || '0', 10);
@@ -23700,9 +23703,9 @@
                 }
                 return 0;
             }
             GM_xmlhttpRequest({
-                method: 'GET', url: META_URL, timeout: 10000,
+                method: 'GET', url: META_URL + '?t=' + Date.now(), timeout: 10000,
                 onload: function(resp) {
                     if (resp.status !== 200) return;
                     var m = resp.responseText.match(/@version\s+(\S+)/);
                     if (!m) return;
