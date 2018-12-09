class KeyboardReader {
    
    static attachKeyboardReader() {
        if (document) {
            document.addEventListener('keydown', KeyboardReader.readInput);
        } else {
            log("Error: Document object does not exist. Can not attach keyboard reader.");
            alert("Error: Document object does not exist. Can not attach keyboard reader.");
        }
    }

    static readInput(event) {
        // Event has .keyCode (allways uppercase), .which (), .charCode (actual)
        
        // log("keyCode:" + event.keyCode + " which:" + event.which + " charCode:" + event.charCode);
        
        FGManager.keypressNotify(event.keyCode);
    }

    static dettachKeyboardReader() {
        if (document) {
            document.removeEventListener('keydown', KeyboardReader.readInput);
        } else {
            log("Error: Document object does not exist. Can not attach keyboard reader.");
            alert("Error: Document object does not exist. Can not attach keyboard reader.");
        }
    }
}