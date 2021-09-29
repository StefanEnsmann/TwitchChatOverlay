vm = null;
const app = Vue.createApp({
    data() {
        return {
            general: {
                channels: "",
                maxMessages: 20, //[1;50]
                backgroundColor: "#008000",
                useBackground: false
            },
            hidden: {
                channels: "",
                commands: false,
                URLs: true
            },
            font: {
                style: "Montserrat",
                size: 20, // [6;50]
                color: "#000000",
                action: "Color", // None, Color, Italic
                emoteFactor: 1.0, // [0.1;4.0]
            },
            spacing: {
                alignment: "Left", // Left, Right, Justify
                between: 0, // [0;20]
                around: 4, // [0;20]
                wrap: true,
                senderRight: 4, // [0;20]
                senderBottom: 0, // [0;20]
                senderReserved: 200 // [60;200]
            },
            sender: {
                badges: true,
                badgeSpace: 3, //[0;10]
                customStyle: false,
                font: "Montserrat",
                size: 20, //[6;50]
                alignment: "Left" // Left, Right
            },
            target: {
                showTarget: true,
                useImage: false,
                customStyle: false,
                font: "Montserrat",
                size: 20, //[6;50]
                color: "#000000",
                alignment: "Left" // Left, Right
            },
            special: {
                highlighted: {
                    highlightMessages: false,
                    channels: "",
                    fontColor: "#FFFFFF",
                    backgroundColor: "#755EBC",
                    alpha: 20 // [0;100]
                },
                subscriptions: {

                }
            },
            animation: {
                fadetime: 0.3, //[0.0;2.0]
                showtime: 4 // [0.0;20.0]
            }
        };
    }
});

function mountApp() {
    vm = app.mount("body");
}

window.onload = mountApp;