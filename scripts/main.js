requirejs(["PoppyPopupAMD"], function(PoppyPopup) {
    document.getElementById("alert").addEventListener("click", function() {
        PoppyPopup.alert("Hi, this is a PopUp!", "With title!");
    }, false);

    document.getElementById("confirm").addEventListener("click", function() {
        PoppyPopup.confirm("Hi, this is a PopUp!", "Confirm");
    }, false);

    document.getElementById("prompt").addEventListener("click", function() {
        PoppyPopup.prompt("Type your name", "User control", {placeholderText: 'Name', valueText: 'Insert your name'}, function(value) {
            PoppyPopup.alert("Welcome " + value);
        })
    }, false);
});