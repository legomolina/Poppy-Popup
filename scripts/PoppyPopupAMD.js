define(function () {
    var popupType = null;
    var POPUP_ALERT = "ALERT";
    var POPUP_CFIRM = "CONFIRM";
    var POPUP_PROMT = "PROMT";
    var KYBRD_ENTER = 13;
    var KYBRD_ESC = 27;

    /**
     * Options array for creating the popup
     * @typedef {Object} Options
     * @property {boolean} [showBackground] When the popup appears, it's over a semitransparent black div that prevents missclicks out of the popup
     * @property {boolean} [removeWhenClose] When it's set to true, the popup will be removed from the DOM when its closed, otherwise, the popup just disappears but it stays on the DOM
     * @property {string} [width] The width of the popup, a string with compatible units like em, px, %; i.e. "150px" or "50%"
     * @property {boolean} [keyboardSupport] Sets if Enter and Esc keys should work. Enter to accept and Esc to cancel
     * @property {string} [valueText] The value the input will contain (just prompt)
     * @property {string} [placeholderText] The placeholder the input will contain (just prompt)
     * @property {function} [accept] Function that will be called when the user clicks the accept button. On alerts and confirms it gets a param that returns the popup id; in prompts it has the value of the input
     * @property {function} [cancel] Function that will be called when the user clicks the cancel button
     */

    var popup = {
        customClassName: '',

        /**
         * alert: Creates an alert popup
         * @param {string} contentText The text to be displayed in the popup
         * @param {string} [titleText] The text to be displayed in the popup header
         * @param {Options} [customOptions] Options to configure the popup
         * @param {Function} [acceptCallback] Funciton to call when popup is accepted
         * @returns {string} The id of the created popup
         */
        alert: function (contentText, titleText, customOptions, acceptCallback) {
            var options, popup;

            popupType = POPUP_ALERT;

            titleText = (titleText !== undefined) ? titleText : "";
            options = mergeOptions(customOptions, acceptCallback);

            popup = new Popup(titleText, contentText, options);

            document.querySelector('body').appendChild(popup);
            popup.focus();

            setTimeout(function () {
                popup.classList.add('show');
            }, 1);

            return popup.id;
        },

        /**
         * confirm: Creates a confirm popup
         * @param {string} contentText The text to be displayed in the popup
         * @param {string} [titleText] The text to be displayed in the popup header
         * @param {Options} [customOptions] Options to configure the popup
         * @param {Function} [acceptCallback] Funciton to call when popup is accepted
         * @param {Function} [cancelCallback] Funciton to call when popup is cancel
         * @returns {string} The id of the created popup
         */
        confirm: function (contentText, titleText, customOptions, acceptCallback, cancelCallback) {
            var options, popup;

            titleText = (titleText !== undefined) ? titleText : "";
            options = mergeOptions(customOptions, acceptCallback, cancelCallback);

            popupType = POPUP_CFIRM;

            popup = new Popup(titleText, contentText, options);

            document.querySelector('body').appendChild(popup);
            popup.focus();

            setTimeout(function () {
                popup.classList.add('show');
            }, 1);

            return popup.id;
        },

        /**
         * prompt: Creates a prompt popup
         * @param {string} contentText The text to be displayed in the popup
         * @param {string} [titleText] The text to be displayed in the popup header
         * @param {Options} [customOptions] Options to configure the popup
         * @param {Function} [acceptCallback] Funciton to call when popup is accepted
         * @param {Function} [cancelCallback] Funciton to call when popup is cancel
         * @returns {string} The id of the created popup
         */
        prompt: function (contentText, titleText, customOptions, acceptCallback, cancelCallback) {
            var options, popup;

            titleText = (titleText !== undefined) ? titleText : "";
            options = mergeOptions(customOptions, acceptCallback, cancelCallback);

            popupType = POPUP_PROMT;

            popup = new Popup(titleText, contentText, options);

            document.querySelector('body').appendChild(popup);
            popup.focus();

            setTimeout(function () {
                popup.classList.add('show');
            }, 1);

            return popup.id;
        },

        /**
         * accept: method to manually call the accept method of any popup
         * @param {string} popupId The popup id which you want to close
         * @param {Options} options Options to configure the popup
         * @returns {boolean} True if all went well, false if not
         */
        accept: function (popupId, options) {
            if (popupType === POPUP_ALERT) {
                close(popupId, options);
                options.accept(popupId);
                return true;
            }

            if (popupType === POPUP_CFIRM) {
                close(popupId, options);
                options.accept(popupId);
                return true;
            }

            if (popupType === POPUP_PROMT) {
                options.accept(document.getElementById(popupId).querySelector('input').value);
                close(popupId, options);
                return true;
            }

            return false;
        },

        /**
         * cancel: method to manually call de cancel method of any popup
         * @param {string} popupId The popup id which you want to close
         * @param {Options} options Options to configure the popup
         * @returns {boolean} Always returns false to indicate that it's closed
         */
        cancel: function (popupId, options) {
            close(popupId, options);
            options.cancel();
            return false;
        }
    };

    /**
     * Popup creator
     * @param {string} contentText The text to be displayed in the popup
     * @param {string} [titleText] The text to be displayed in the popup header
     * @param {Options} [options] Options to configure the popup
     * @returns {HTMLElement} The created popup element
     * @constructor
     */
    function Popup(titleText, contentText, options) {
        var basePopup = document.createElement("DIV");
        basePopup.className = "poppy-popup";
        basePopup.id = btoa(new Date().getTime().toString());
        basePopup.tabIndex = -1;

        if (options.keyboardSupport) {
            basePopup.onkeydown = function (e) {
                if (e.keyCode === KYBRD_ENTER)
                    popup.accept(basePopup.id, options);
                else if (e.keyCode === KYBRD_ESC)
                    popup.cancel(basePopup.id, options);
            };
        }

        if (options.showBackground) {
            var background = document.createElement("DIV");
            background.className = "poppy-popup-background";

            basePopup.appendChild(background);
        }

        var container, header, headerTitle, content, promptInput, buttons, accept, acceptButton, cancel, cancelButton;
        container = document.createElement("DIV");
        container.className = "poppy-popup-container";
        container.style.width = options.width;
        container.style.height = options.height;

        if (titleText !== "") {
            header = document.createElement("DIV");
            header.className = "poppy-popup-header";

            headerTitle = document.createElement("DIV");
            headerTitle.className = "poppy-popup-title-text";
            headerTitle.innerHTML = titleText;

            header.appendChild(headerTitle);
            container.appendChild(header);
        }

        content = document.createElement("DIV");
        content.className = "poppy-popup-content";
        content.innerHTML = contentText;

        if (popupType === POPUP_PROMT) {
            promptInput = document.createElement("INPUT");
            promptInput.type = "text";
            promptInput.value = options.valueText;
            promptInput.placeholder = options.placeholderText;

            content.appendChild(promptInput);
        }

        buttons = document.createElement("DIV");
        buttons.className = "poppy-popup-buttons";

        accept = document.createElement("SPAN");
        accept.className = "poppy-popup-accept";

        acceptButton = document.createElement("A");
        acceptButton.href = "#";
        acceptButton.onclick = function () {
            popup.accept(basePopup.id, options);
        };
        acceptButton.innerHTML = "<i class='material-icons'>done</i> OK";

        accept.appendChild(acceptButton);
        buttons.appendChild(accept);

        if (popupType === POPUP_CFIRM || popupType === POPUP_PROMT) {
            cancel = document.createElement("SPAN");
            cancel.className = "poppy-popup-cancel";

            cancelButton = document.createElement("A");
            cancelButton.href = "#";
            cancelButton.onclick = function () {
                popup.cancel(basePopup.id, options);
            };
            cancelButton.innerHTML = "<i class='material-icons'>close</i> Cancel";

            cancel.appendChild(cancelButton);
            buttons.appendChild(cancel);
        }

        container.appendChild(content);
        container.appendChild(buttons);

        basePopup.appendChild(container);

        return basePopup;
    }

    function close(popupId, options) {
        var popup = document.getElementById(popupId);
        popup.classList.remove('show');

        popup.addEventListener('transitionend', function (e) {
            if (e.propertyName === 'opacity') {
                if (options.removeWhenClose)
                    popup.parentNode.removeChild(popup);
            }
        });
    }

    function mergeOptions(customOptions, acceptCallback, cancelCallback) {
        var options = {
            showBackground: true,
            removeWhenClose: true,
            width: 400 + "px",
            keyboardSupport: true,
            valueText: "",
            placeholderText: "",
            accept: function () {
                return true;
            },
            cancel: function () {
                return false;
            }
        };

        if (typeof acceptCallback === 'function' && acceptCallback !== undefined)
            options.accept = acceptCallback;

        if (typeof cancelCallback === 'function' && cancelCallback !== undefined)
            options.cancel = cancelCallback;

        if (customOptions !== undefined) {
            for (var option in options) {
                if (customOptions.hasOwnProperty(option)) {
                    options[option] = customOptions[option];
                }
            }
        }

        return options;
    }

    return popup;
});