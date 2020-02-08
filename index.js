function PoppyPopup () {
    let popupType = null;
    const POPUP_ALERT = "ALERT";
    const POPUP_CFIRM = "CONFIRM";
    const POPUP_PROMT = "PROMT";
    const KYBRD_ENTER = "Enter";
    const KYBRD_ESC = "Escape";

    /**
     * Options array for creating the popup
     * @typedef {Object} Options
     * @property {boolean} [showBackground] When the popup appears, it's over a semitransparent black div that prevents missclicks out of the popup
     * @property {boolean} [removeWhenClose] When it's set to true, the popup will be removed from the DOM when its closed, otherwise, the popup just disappears but it stays on the DOM
     * @property {string} [width] The width of the popup, a string with compatible units like em, px, %; i.e. "150px" or "50%"
     * @property {boolean} [keyboardSupport] Sets if Enter and Esc keys should work. Enter to accept and Esc to cancel
     * @property {boolean} [cancelButton] Sets if cancel button should be present on prompt and confirm popups
     * @property {string} [valueText] The value the input will contain (just prompt)
     * @property {string} [placeholderText] The placeholder the input will contain (just prompt)
     * @property {function} [accept] Function that will be called when the user clicks the accept button. On alerts and confirms it gets a param that returns the popup id; in prompts it has the value of the input
     * @property {function} [cancel] Function that will be called when the user clicks the cancel button
     */

    const popup = {
        customClassName: "",

        /**
         * alert: Creates an alert popup
         * @param {string} contentText The text to be displayed in the popup
         * @param {string} [titleText] The text to be displayed in the popup header
         * @param {Options} [customOptions] Options to configure the popup
         * @param {Function} [acceptCallback] Function to call when popup is accepted
         * @returns {string} The id of the created popup
         */
        alert: function (contentText, titleText, customOptions, acceptCallback) {
            let options, popup;

            popupType = POPUP_ALERT;

            titleText = (titleText !== undefined) ? titleText : "";
            options = mergeOptions(customOptions, acceptCallback);

            popup = new Popup(titleText, contentText, options);

            document.querySelector("body").appendChild(popup);
            popup.focus();

            setTimeout(() => {
                popup.classList.add("show");
            }, 1);

            return popup.id;
        },

        /**
         * confirm: Creates a confirm popup
         * @param {string} contentText The text to be displayed in the popup
         * @param {string} [titleText] The text to be displayed in the popup header
         * @param {Options} [customOptions] Options to configure the popup
         * @param {Function} [acceptCallback] Function to call when popup is accepted
         * @param {Function} [cancelCallback] Function to call when popup is cancel
         * @returns {string} The id of the created popup
         */
        confirm: function (contentText, titleText, customOptions, acceptCallback, cancelCallback) {
            let options, popup;

            titleText = (titleText !== undefined) ? titleText : "";
            options = mergeOptions(customOptions, acceptCallback, cancelCallback);

            popupType = POPUP_CFIRM;

            popup = new Popup(titleText, contentText, options);

            document.querySelector("body").appendChild(popup);
            popup.focus();

            setTimeout(function () {
                popup.classList.add("show");
            }, 1);

            return popup.id;
        },

        /**
         * prompt: Creates a prompt popup
         * @param {string} contentText The text to be displayed in the popup
         * @param {string} [titleText] The text to be displayed in the popup header
         * @param {Options} [customOptions] Options to configure the popup
         * @param {Function} [acceptCallback] Function to call when popup is accepted
         * @param {Function} [cancelCallback] Function to call when popup is cancel
         * @returns {string} The id of the created popup
         */
        prompt: function (contentText, titleText, customOptions, acceptCallback, cancelCallback) {
            let options, popup;

            titleText = (titleText !== undefined) ? titleText : "";
            options = mergeOptions(customOptions, acceptCallback, cancelCallback);

            popupType = POPUP_PROMT;

            popup = new Popup(titleText, contentText, options);

            document.querySelector("body").appendChild(popup);
            popup.focus();

            setTimeout(function () {
                popup.classList.add("show");
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
                options.accept(document.getElementById(popupId).querySelector("input").value);
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
        const basePopup = document.createElement("div");
        basePopup.className = "poppy-popup";
        basePopup.id = btoa(new Date().getTime().toString());
        basePopup.tabIndex = -1;

        if (options.keyboardSupport) {
            basePopup.addEventListener("keydown", (e) => {
                if (e.code === KYBRD_ENTER) {
                    popup.accept(basePopup.id, options);
                }
                // if cancel button is not present, prevent cancelling action with keyboard
                else if (e.code === KYBRD_ESC && options.cancelButton) {
                    popup.cancel(basePopup.id, options);
                }
            }, false);
        }

        if (options.showBackground) {
            const background = document.createElement("div");
            background.className = "poppy-popup-background";

            basePopup.appendChild(background);
        }

        let container, header, headerTitle, content, promptInput, buttons, accept, acceptButton, cancel, cancelButton;
        container = document.createElement("div");
        container.className = "poppy-popup-container";
        container.style.width = options.width;

        if (titleText !== "") {
            header = document.createElement("div");
            header.className = "poppy-popup-header";

            headerTitle = document.createElement("div");
            headerTitle.className = "poppy-popup-title-text";
            headerTitle.innerHTML = titleText;

            header.appendChild(headerTitle);
            container.appendChild(header);
        }

        content = document.createElement("div");
        content.className = "poppy-popup-content";
        content.innerHTML = contentText;

        if (popupType === POPUP_PROMT) {
            promptInput = document.createElement("input");
            promptInput.type = "text";
            promptInput.value = options.valueText;
            promptInput.placeholder = options.placeholderText;

            content.appendChild(promptInput);
        }

        buttons = document.createElement("div");
        buttons.className = "poppy-popup-buttons";

        accept = document.createElement("span");
        accept.className = "poppy-popup-accept";

        acceptButton = document.createElement("a");
        acceptButton.href = "#";
        acceptButton.addEventListener("click", function (ev) {
            ev.preventDefault();
            popup.accept(basePopup.id, options);
        }, false);
        acceptButton.innerHTML = "<i class='material-icons'>done</i> OK";

        accept.appendChild(acceptButton);
        buttons.appendChild(accept);

        // if cancel button is false prevent adding it to the popup
        if (options.cancelButton && (popupType === POPUP_CFIRM || popupType === POPUP_PROMT)) {
            cancel = document.createElement("span");
            cancel.className = "poppy-popup-cancel";

            cancelButton = document.createElement("a");
            cancelButton.href = "#";
            cancelButton.addEventListener("click", function (ev) {
                ev.preventDefault();
                popup.cancel(basePopup.id, options);
            }, false);
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
        const popup = document.getElementById(popupId);
        popup.classList.remove("show");

        popup.addEventListener("transitionend", (e) => {
            if (e.propertyName === "opacity") {
                if (options.removeWhenClose)
                    popup.parentNode.removeChild(popup);
            }
        });
    }

    function mergeOptions(customOptions, acceptCallback, cancelCallback) {
        const options = {
            showBackground: true,
            removeWhenClose: true,
            width: 400 + "px",
            keyboardSupport: true,
            cancelButton: true,
            valueText: "",
            placeholderText: "",
            accept: function () {
                return true;
            },
            cancel: function () {
                return false;
            }
        };

        if (acceptCallback && typeof acceptCallback === "function")
            options.accept = acceptCallback;

        if (cancelCallback && typeof cancelCallback === "function")
            options.cancel = cancelCallback;

        if (customOptions) {
            for (const option in options) {
                if (customOptions.hasOwnProperty(option)) {
                    options[option] = customOptions[option];
                }
            }
        }

        return options;
    }

    return popup;
}

export default PoppyPopup();
