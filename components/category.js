app.component("config-category", {
    props: {
        "name": String,
    },
    /*html*/
    template: `
    <div class="config-category">
        <div class="config-category-header">{{ name }}</div>
        <div class="config-category-content">
            <slot></slot>
        </div>
    </div>
    `
});