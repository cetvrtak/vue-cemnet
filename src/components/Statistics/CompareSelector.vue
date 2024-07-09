<template>
    <a-col :span="24" :sm="12" class="compare-selector-wrapper">
        <div class="compare-selector-container">
            <label class="compare-selector-label">{{ props.title }}</label>
            <a-select
                class="compare-selector"
                v-model:value="selectedOption"
                @change="emitSelectedOption"
            >
                <a-select-option v-for="{ value, text } in options" :value="value">{{ text }}</a-select-option>
            </a-select>
        </div>
    </a-col>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    index: Number,
    title: String,
    options: String,
})

const options = ref(JSON.parse(props.options))
const selectedOption = ref('')

const emit = defineEmits(['selectedOption'])
const emitSelectedOption = () => {
    emit('selectedOption', selectedOption.value, props.index);
}

</script>

<style scoped>
.compare-selector-wrapper {
    padding: 20px 2.5%;
}
.compare-selector-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 4px;
}
.compare-selector-label {
    line-height: 30px;
}

@media screen and (max-width: 575px) {
    .compare-selector-wrapper:first-child {
        padding-bottom: 0;
    }
    .compare-selector {
        flex-grow: 1;
    }
}
</style>