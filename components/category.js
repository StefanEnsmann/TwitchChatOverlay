app.component("config-category", {
    props: {
        "name": String,
    },
    /*html*/
    template: `
    <div class="config-category">
        <div class="config-category-header">{{ name }}</div>
        <slot></slot>
    </div>
    `
});