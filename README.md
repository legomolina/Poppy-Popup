# PoppyPopup
Custom popups to replace vanilla JavaScript prompts.

### ChangeLog
- Added comments to all code
- Added support for require.js and AMD
- Added main.js file to test modules

### Installation
1. Run ```npm install poppy-popup```
2. Copy style in your project. You can choose between .css or .scss file.
3. Require it in your project: ```const PoppyPopup = require('poppy-popup')'```
4. Enjoy using new Prompts!

### Usage
To display an alert popup:
```javascript
PoppyPopup.alert("Hey, pay attention! A popup appears.");
```

To display a confirm popup:
```javascript
PoppyPopup.confirm("Do you know how to use this?");
```

To display a prompt popup:
```javascript
PoppyPopup.prompt("Write your name:");
```

All methods accept the popup content (you can use HTML also), next the title of the popup and an object with some options.
```javascript
PoppyPopup.alert("Popop content", "Title", options);
```

Default `options` params:
```javascript
const options = {
    showBackground: true,
    removeWhenClose: true,
    width: 400 + "px",
    keyboardSupport: true,
    cancelButton: true,
    valueText: "",
    placeholderText: "",
    accept: function() { return true; },
    cancel: function() { return false; }
}
```

- **showBackground**: when the popup appears, it's over a semitransparent black div that prevents missclicks out of the popup.
- **removeWhenClose**: when it's set to true, the popup will be removed from the DOM when its closed, otherwise, the popup just disappears but it stays on the DOM.
- **width**: the width of the popup, a string with compatible units like _em_, _px_, _%_; i.e. "150px" or "50%".
- **keyboardSupport**: sets if Enter and Esc keys should work. Enter to accept and Esc to cancel.
- **cancelButton**: sets if cancel button should be present on prompt and confirm popups
- **valueText**: the value the input will contain (just prompt).
- **placeholderText**: the placeholder the input will contain (just prompt).
- **accept**: function that will be called when the user clicks the accept button. On alerts and confirms it gets a param that returns the popup id; in prompts it has the value of the input.
- **cancel**: function that will be called when the user clicks the cancel button.

Alert, confirm and prompt have an acceptCallback after options, so you can omit the accept param at `options`.

And confirm and prompt have a cancelCallback after the accept one so you can omit the cancel param at `options`.

These are all the params methods accept: _(just content is not optional)_
```javascript
PoppyPopup.alert(content, title, options, acceptCallback);
PoppyPopup.confirm(content, title, options, acceptCallback, cancelCallback);
PoppyPopup.prompt(content, title, options, acceptCallback, cancelCallback);
```

### Configuration
All colors and measures are SCSS variables so you can change them and recompile the file in order to replace previous values quickly.

### Screenshots

<img src="https://raw.githubusercontent.com/legomolina/Poppy-Popup/master/art/poppy.gif">
<img src="https://raw.githubusercontent.com/legomolina/Poppy-Popup/master/art/poppy_1.png">
<img src="https://raw.githubusercontent.com/legomolina/Poppy-Popup/master/art/poppy_2.png">
<img src="https://raw.githubusercontent.com/legomolina/Poppy-Popup/master/art/poppy_3.png">
