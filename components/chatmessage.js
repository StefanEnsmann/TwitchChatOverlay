app.component("chatmessage", {
    props: {
        message: Object,
        styleconfig: Object
    },
    /*html*/
    template: `
    <div class="chat-message" :style="styleconfig.box">
        <div class="chat-message-sndr-box" :style="styleconfig.sndrbox">
            <div class="chat-message-sndr" :style="styleconfig.sndr">{{ message.sender }}</div>
            <div class="chat-message-trgt" :style="styleconfig.trgt">{{ message.target }}</div>
        </div>
        <div class="chat-message-msg" :style="styleconfig.msg">{{ message.msg }}</div>
    </div>
    `
});