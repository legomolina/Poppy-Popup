var PoppyPopup = function() {
    var popupType = null;
    var POPUP_ALERT = "ALERT";
    var POPUP_CFIRM = "CONFIRM";
    var POPUP_PROMT = "PROMT";

    var popup = {
        customClassName: '',

        alert: function(contentText, titleText, customOptions, acceptCallback) {
            var options, popup;

            popupType = POPUP_ALERT;

            titleText = (titleText !== undefined) ? titleText : "";
            options = mergeOptions(customOptions, acceptCallback);

            popup = new Popup(titleText, contentText, options);

            document.querySelector('body').appendChild(popup);

            setTimeout(function() {
                popup.classList.add('show');
            }, 1);

            return popup.id;
        },

        confirm: function(contentText, titleText, customOptions, acceptCallback, cancelCallback) {
            var options, popup;

            titleText = (titleText !== undefined) ? titleText : "";
            options = mergeOptions(customOptions, acceptCallback, cancelCallback);

            popupType = POPUP_CFIRM;

            popup = new Popup(titleText, contentText, options);

            document.querySelector('body').appendChild(popup);

            setTimeout(function() {
                popup.classList.add('show');
            }, 1);

            return popup.id;
        },

        prompt: function(contentText, titleText, customOptions, acceptCallback, cancelCallback) {
            var options, popup;

            titleText = (titleText !== undefined) ? titleText : "";
            options = mergeOptions(customOptions, acceptCallback, cancelCallback);

            popupType = POPUP_PROMT;

            popup = new Popup(titleText, contentText, options);

            document.querySelector('body').appendChild(popup);

            setTimeout(function() {
                popup.classList.add('show');
            }, 1);

            return popup.id;
        },

        accept: function(popupId, options) {
            if(popupType === POPUP_ALERT) {
                close(popupId, options);
                options.accept(popupId);
                return true;
            }

            if(popupType === POPUP_CFIRM) {
                close(popupId, options);
                options.accept(popupId);
                return true;
            }

            if(popupType === POPUP_PROMT) {
                options.accept(document.getElementById(popupId).querySelector('input').value);
                close(popupId, options);
                return true;
            }
        },

        cancel: function(popupId, options) {
            close(popupId, options);
            options.cancel();
            return false;
        }
    };

    function Popup(titleText, contentText, options) {
        var basePopup = document.createElement("DIV");
        basePopup.className = "poppy-popup";
        basePopup.id = btoa(new Date().getTime().toString());

        if(options.showBackground) {
            var background = document.createElement("DIV");
            background.className = "poppy-popup-background";

            basePopup.appendChild(background);
        }

        var container, header, headerTitle, content, promptInput, buttons, accept, acceptButton, cancel, cancelButton;
        container = document.createElement("DIV");
        container.className = "poppy-popup-container";
        container.style.width = options.width;
        container.style.height = options.height;

        if(titleText !== "") {
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

        if(popupType === POPUP_PROMT) {
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
        acceptButton.onclick = function() {PoppyPopup.accept(basePopup.id, options);};
        acceptButton.innerHTML = "<i class='material-icons'>done</i> OK";

        accept.appendChild(acceptButton);
        buttons.appendChild(accept);

        if(popupType === POPUP_CFIRM || popupType === POPUP_PROMT) {
            cancel = document.createElement("SPAN");
            cancel.className = "poppy-popup-cancel";

            cancelButton = document.createElement("A");
            cancelButton.href = "#";
            cancelButton.onclick = function () {
                PoppyPopup.cancel(basePopup.id, options);
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

        popup.addEventListener('transitionend', function(e) {
            if(e.propertyName === 'opacity') {
                if(options.removeWhenClose)
                    popup.parentNode.removeChild(popup);
            }
        });
    }

    function mergeOptions(customOptions, acceptCallback, cancelCallback) {
        var options = {
            showBackground: true,
            removeWhenClose: true,
            width: 400 + "px",
            valueText: "",
            placeholderText: "",
            accept: function() {return true;},
            cancel: function() {return false;}
        };

        if(typeof acceptCallback === 'function' && acceptCallback !== undefined)
            options.accept = acceptCallback;

        if(typeof cancelCallback === 'function' && cancelCallback !== undefined)
            options.cancel = cancelCallback;

        if(customOptions !== undefined) {
            for(var option in options) {
                if (customOptions.hasOwnProperty(option)) {
                    options[option] = customOptions[option];
                }
            }
        }

        return options;
    }

    return popup;
}();