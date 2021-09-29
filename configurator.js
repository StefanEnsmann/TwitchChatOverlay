vm = null;
const app = Vue.createApp({
    data() {
        return {
            channelList: "",
            maxMessages: 20,
            backgroundColor: "#008000",
            useBackground: false,

            hiddenChannels: "",
            hideCommands: false,
            hideURLs: true,

            font: "Montserrat",
            fontSize: 20,
            fontColor: "#000000",
            textAlignment: "Left", // Left, Right, Justify
            actionDisplay: "Color", // None, Color, Italic
            emoteScaleFactor: 1.0,
            spaceBetweenMessages: 0,
            spaceAroundMessages: 4,
            wrapAroundName: true,
            senderSpaceRight: 4,
            senderSpaceBottom: 0,
            senderReservedSpace: 200
        };
    }
});

function mountApp() {
    vm = app.mount("body");
}

window.onload = mountApp;