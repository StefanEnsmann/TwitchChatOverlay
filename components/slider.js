app.component("config-slider", {
    props: {
        "name": String,
        "min": Number,
        "max": Number,
        "modelValue": Number,
        "step": Number
    },
    emits : ["update:modelValue"],
    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", parseFloat(value));
            }
        }
    },
    /*html*/
    template: `
    <div class="config-slider">
        <div class="config-element-header">{{ name }}</div>
        <input class="config-slider-rangeinput" :min="min" :max="max" :step="step" v-model="value" type="range" />
        <input class="config-slider-numberinput" :min="min" :max="max" :step="step" v-model="value" type="number" />
    </div>
    `
});