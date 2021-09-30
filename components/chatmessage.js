app.component("chatmessage", {
    props: {
        "message": Object
    },
    /*html*/
    template: `
    <div class="config-element config-checkbox">
        <span class="config-element-header">{{ name }}</span>
        <input class="config-checkbox-input" v-model="value" type="checkbox" />
    </div>
    `
});