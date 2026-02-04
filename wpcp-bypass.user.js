// ==UserScript==
// @name         wpcp-bypass
// @namespace    https://github.com/tymongumienik
// @version      1.0
// @description  Bypasses the WordPress 'WP Content Copy Protection & No Right Click' plugin
// @author       Tymon Gumienik
// @match        *://*/*
// @run-at       document-start
// @license      MIT
// ==/UserScript==

// Copyright (c) 2026 Tymon Gumienik

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function () {
  "use strict";

  function unlock() {
    // reenable user select
    const style = document.createElement("style");
    style.innerHTML = `
            body {
                -webkit-user-select: text !important;
                user-select: text !important;
                pointer-events: auto !important;
            }
            #wpcp-error-message {
                display: none !important;
            }
        `;
    document.head.appendChild(style);

    // remove poisonous event handlers
    [
      "oncontextmenu",
      "onselectstart",
      "ondragstart",
      "onmousedown",
      "onkeydown",
    ].forEach((event) => {
      document[event] = null;
      document.body[event] = null;
    });

    // add event listeners to ignore further events
    ["contextmenu", "selectstart", "copy", "keydown"].forEach((event) => {
      window.addEventListener(event, (e) => e.stopImmediatePropagation(), true);
    });

    console.debug("wpcp detected and killed!");
  }

  function check() {
    const isPluginPresent =
      document.querySelector("#wpcp-error-message") || // the annoying Content is protected message
      document.querySelector("#wpcp_disable_selection") || // the script
      document.querySelector('style[id*="wpcp"]'); // the user-select style

    if (isPluginPresent) {
      unlock();
      return true;
    }

    return false;
  }

  if (!check()) {
    // try again after dom content loads
    document.addEventListener("DOMContentLoaded", check);
  }
})();
