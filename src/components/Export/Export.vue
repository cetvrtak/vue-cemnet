<script setup>
import {ref, reactive, onMounted, computed, watch } from "vue";
import { Table as ATable } from "ant-design-vue";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { LeftOutlined, RightOutlined, SyncOutlined, TableOutlined } from "@ant-design/icons-vue";

const props = defineProps({
    allCountriesWithRegionsString: String,
    locationType: {
        type: String,
        required: true,
    },
});

const locations = [
    {
        value: 13,
        label: 'Australasia',
        countries: [
            { value: '169', label: 'Australia' },
            { value: '170', label: 'Fiji' },
            { value: '171', label: 'New Zealand' },
            { value: '172', label: 'Papua New Guinea' },
        ],
    },
    {
        value: 8,
        label: 'Central Africa',
        countries: [
            { value: '43', label: 'Angola' },
            { value: '46', label: 'Cameroon' },
            { value: '184', label: 'Central African Republic' },
            { value: '48', label: 'Chad' },
            { value: '51', label: 'Congo - Dem. Republic' },
            { value: '50', label: 'Congo - Republic' },
            { value: '53', label: 'Equatorial Guinea' },
            { value: '56', label: 'Gabon' },
        ],
    },
    // Add more regions and their respective countries
];

const currentStep = ref(0);

const next = () => {
    currentStep.value++;
}

const prev = () => {
    currentStep.value--;
}

const steps = [
    {
        title: `Select ${props.locationType == 'countries' ? 'Country' : 'Region(s)'}`,
        content: 'First-content',
    },
    {
        title: 'Select Years',
        content: 'Second-content',
    },
    {
        title: 'Select Display Category',
        content: 'Last-content',
    },
    {
        title: 'Display Category',
        content: 'Second-content',
    },
    {
        title: 'Export',
        content: 'Last-content',
    },
];

const state = reactive({
    selectedEntities: null,
    selectedYearRange: null,
    selectedCategories: null,
});

const displayCategories = [
    {value: 1, label: 'Consumption'},
    {value: 2, label: 'Production'},
    {value: 4, label: 'Cement Capacity'},
    {value: 5, label: 'Cement Consumption Per Capita KG'},
    {value: 6, label: 'Export'},
    {value: 7, label: 'Import'},
];

const selectedRegions = ref([13, 8]);
const selectedYearRange = ref({from: 2020, to: 2022});
const selectedDisplayCategories = ref([1, 2, 4, 6, 7]);
const selectedDisplayValues = ref(0);
const selectedCountries = ref([]);
const displayCountries = ref('list');

const sortCategories = () => {
    selectedDisplayCategories.value.sort((a, b) => a - b);
};
watch(selectedDisplayCategories, sortCategories)

const selectAll = (type) => {
    if (type === 'locations') {
        selectedCountries.value = locations.flatMap((region) => region.countries.map((country) => country.value));
        selectedRegions.value = locations.map((region) => region.value);
    } else if (type === 'categories') {
        selectedDisplayCategories.value = displayCategories
            .filter((category) => props.locationType == 'countries' || category.value != 5)
            .map((category) => category.value);
    }
};

const unselectAll = (type) => {
    if (type === 'locations') {
        selectedCountries.value = [];
        selectedRegions.value = [];
    } else if (type === 'categories') {
        selectedDisplayCategories.value = [];
    }
};

const handleGroupCheckboxChange = (region) => {
    if (selectedRegions.value.includes(region.value)) {
        // Region checkbox is checked, add all countries to selectedCountries
        const countriesToAdd = region.countries.map((country) => country.value);
        selectedCountries.value.push(...countriesToAdd);
    } else {
        // Region checkbox is unchecked, remove all countries from selectedCountries
        const countriesToRemove = region.countries.map((country) => country.value);
        selectedCountries.value = selectedCountries.value.filter(
            (country) => !countriesToRemove.includes(country)
        );
    }
};

const startOver = () => {
    currentStep.value = 0;
    selectedRegions.value = [];
    selectedYearRange.value = { from: 2010, to: 2022 };
    selectedDisplayCategories.value = [];
    selectedCountries.value = [];
    displayCountries.value = 'list';
};

const generatedColumns = computed(() => {
    if (currentStep.value !== 3) {
        // Return an empty array if step 3 is not yet finished
        return [];
    }

    // Convert selectedYearRange values to strings
    const fromYear = selectedYearRange.value.from.toString();
    const toYear = selectedYearRange.value.to.toString();

    // Generate columns based on the selectedYearRange
    return [
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
        },
        ...Array.from({ length: parseInt(toYear) - parseInt(fromYear) + 1 }, (_, index) => {
            const year = parseInt(fromYear) + index;
            return {
                title: year.toString(),
                key: year.toString(),
                children: generateCategoryColumns(year),
            };
        }),
    ];
});
function generateCategoryColumns(year) {
    const columns = [];
    selectedDisplayCategories.value.forEach((categoryKey) => {
        const category = displayCategories.find((cat) => cat.value === categoryKey);
        if (category) {
            columns.push({
                title: category.label,
                dataIndex: `${year}_${category.value}`,
                key: `${year}_${category.value}`,
                slots: { customRender: "value" },
            });
        }
    });
    return columns;
}

const tableData = computed(() => {
    if (currentStep.value !== 3) {
        // Return an empty array if step 3 is not yet finished
        return [];
    }

    const selectedLocations = props.locationType === 'regions' ? selectedRegions.value : selectedCountries.value;

    return selectedLocations.map(location => {
        const locationData = props.locationType === 'regions' ? locations.find(item => item.value === location) : locations.find(region => region.countries.some(country => country.value === location))?.countries.find(country => country.value === location);
        const locationLabel = locationData?.label || '';
        const rowData = { region: locationLabel };

        for (let year = selectedYearRange.value.from; year <= selectedYearRange.value.to; year++) {
            selectedDisplayCategories.value.forEach(categoryKey => {
                const category = displayCategories.find(cat => cat.value === categoryKey);
                if (category) {
                    const categoryKeyString = `${year}_${category.value}`;
                    const categoryValue = Math.random() * 100;
                    rowData[categoryKeyString] = categoryValue.toFixed(3);
                }
            });
        }

        return rowData;
    });
});

const displayedTableData = computed(() => {
    if (selectedDisplayValues.value == 0) {
        // Display Actual Values
        return tableData.value;
    } else {
        // Display Percentage Values
        const displayedData = tableData.value.map((row) => {
            const newRow = { ...row };
            for (let i = 1; i < generatedColumns.value.length; i++) {
                const previousYear = generatedColumns.value[i - 1].title;
                const currentYearColumns = generatedColumns.value[i].children;

                currentYearColumns.forEach((category) => {
                    const dataIndex = category.key;
                    const previousDataIndex = `${previousYear}_${category.key.split('_')[1]}`;
                    newRow[dataIndex] = calculatePercentageChange(row[previousDataIndex], row[dataIndex]);
                });
            }
            return newRow;
        });
        return displayedData;
    }
});

// Helper function to calculate percentage change
function calculatePercentageChange(previousValue, currentValue) {
    previousValue = previousValue || Math.random() * 100;
    const change = (currentValue - previousValue) / previousValue * 100;
    return Number.isNaN(change) ? '' : `${change.toFixed(2)}%`;
}

const addTableHeaders = function(worksheet) {
    const parentColumnLabels = [];
    const childrenColumnLabels = [];

    generatedColumns.value.forEach((column) => {
        parentColumnLabels.push(column.title);
        if (column.children && column.children.length > 1) {
            const emptyFieldsCount = column.children.length - 1;
            parentColumnLabels.push(...Array(emptyFieldsCount).fill(''))
            const childTitles = column.children.map(child => child.title);
            childrenColumnLabels.push(...childTitles);
        }
    });

    worksheet.addRow(parentColumnLabels);
    worksheet.addRow(['', ...childrenColumnLabels]);
}

const exportExcel = function () {
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();

    // Add a worksheet to the workbook
    const worksheet = workbook.addWorksheet('Sheet1');

    addTableHeaders(worksheet);

    // Add table rows
    displayedTableData.value.forEach((row) => {
        const rowData = Object.values(row);
        worksheet.addRow(rowData);
    });

    styleTable(worksheet);

    // Add the source text
    const currentYear = new Date().getFullYear();
    const sourceText = `Source: The Global Cement Report, Tradeship Publications Ltd (UK), www.CemNet.com (${currentYear})`;
    const additionalRow = worksheet.addRow([sourceText]);
    additionalRow.alignment = { vertical: 'middle', horizontal: 'left' };
    additionalRow.font = { italic: true };

    // Generate the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
        // Create a Blob from the buffer
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Save the file using FileSaver.js
        saveAs(blob, 'table_data.xlsx');
    });
};
const styleTable = function(worksheet) {
    worksheet.columns.forEach((column, i) => {
        // Expand columns to fit content
        let maxContentLength = 0;
        column.eachCell((cell) => {
            const contentLength = cell.value ? cell.value.toString().length : 0;
            if (contentLength > maxContentLength) {
                maxContentLength = contentLength;
            }
        });
        column.width = maxContentLength + 2; // Add some extra padding

        // Apply left alignment to regions column, right alignment to category columns
        column.alignment = i === 0 ? { horizontal: 'left' } : { horizontal: 'right' };
    });

    // Style the first row to be bold and centered
    const firstRow = worksheet.getRow(1);
    firstRow.font = { bold: true };
    firstRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Merge cells for each year label
    generatedColumns.value.forEach((column, index) => {
        if (column.children && column.children.length > 1) {
            let startColumn = 2 + (index - 1) * column.children.length;
            let endColumn = startColumn + column.children.length - 1;
            worksheet.mergeCells(1, startColumn, 1, endColumn);
        }
    })

    // Center second row (category labels)
    worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };
};

defineExpose({exportExcel});


</script>

<template>
    <a-steps :current="currentStep" labelPlacement="vertical">
        <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
    </a-steps>

    <div class="export-wrapper box">
        <div class="export-container">
            <div v-if="currentStep === 0" class="region_wrapper">
                <!-- First Step: Region Selection -->
                <template v-if="locationType === 'regions'">
                    <div>
                        <div class="export-buttons-container">
                            <span><button class="btn btn-primary" id="SelectAll" @click="selectAll('locations')">Select All</button></span>
                            <span><button class="btn btn-primary" id="UnselectAll" @click="unselectAll('locations')">Unselect All</button></span>
                        </div>

                        <div id="selectRegions" class="">
                            <h3>Select Region(s):<br></h3>
                            <p v-for="region in locations" :key="region.value" class="export-select-item">
                                <input
                                    type="checkbox"
                                    name="regions"
                                    class="regionsCheckbox text_vertical_middle margin_right_5"
                                    :value="region.value"
                                    v-model="selectedRegions"
                                >
                                {{ region.label }}
                            </p>
                        </div>
                    </div>
                </template>

                <template v-else-if="locationType === 'countries'">
                    <!-- First Step: Country Selection -->
                    <div>
                        <div class="export-display-countries">
                            <span><input type="radio" name="toggle" class="toggleList" value="list" checked="" v-model="displayCountries">&nbsp;&nbsp;Display as list(A-Z)</span>
                            <span><input type="radio" name="toggle" class="toggleList" value="group" v-model="displayCountries">&nbsp;&nbsp;Display group</span>
                        </div>

                        <div class="export-buttons-container">
                            <span><button class="btn btn-primary" id="SelectAll" @click="selectAll('locations')">Select All</button></span>
                            <span><button class="btn btn-primary" id="UnselectAll" @click="unselectAll('locations')">Unselect All</button></span>
                        </div>

                        <div id="selectCountries" class="">
                            <h3>Select Country(s):<br></h3>
                            <!-- Display countries as a list -->
                            <ul v-if="displayCountries === 'list'" class="splitcolumns">
                                <template v-for="region in locations">
                                    <li v-for="country in region.countries" :key="country.value" class="export-select-item">
                                        <input
                                            type="checkbox"
                                            name="countries"
                                            class="regionsCheckbox text_vertical_middle margin_right_5"
                                            :value="country.value"
                                            v-model="selectedCountries"
                                        >
                                        {{ country.label }}
                                    </li>
                                </template>
                            </ul>

                            <!-- Display grouped countries -->
                            <ul v-else-if="displayCountries === 'group'" class="splitcolumns">
                                <template v-for="region in locations" :key="region.value" class="export-select-item">
                                    <li class="export-select-item-group">
                                        <h5>
                                            <input
                                                type="checkbox"
                                                :value="region.value"
                                                v-model="selectedRegions"
                                                @change="handleGroupCheckboxChange(region)"
                                            />
                                            {{ region.label }}
                                        </h5>
                                    </li>
                                    <li v-for="country in region.countries" :key="country.value" class="export-select-item">
                                        <input
                                            type="checkbox"
                                            name="countries"
                                            class="regionsCheckbox text_vertical_middle margin_right_5"
                                            :value="country.value"
                                            v-model="selectedCountries"
                                        >
                                        {{ country.label }}
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                </template>
            </div>

            <div v-else-if="currentStep === 1" id="selectYears" class="">
                <!-- Second Step: Year Range Selection -->
                <div class="export-buttons-container">
                    <div class="export-start-over-container">
                        <a-button type="button" class="btn btn-primary pull_right margin_right_0" id="start-over" @click="startOver">
                            Start Over
                            <template #icon>
                                <SyncOutlined/>
                            </template>
                        </a-button>
                    </div>
                </div>

                <h3>Select Year Range:<br></h3>

                <p class="export-select-item">
                    From:
                    <select id="dropdown-yearFrom" class="form-control select2me form_control"
                            v-model="selectedYearRange.from">
                        <option value="2010">2010</option>
                        <option value="2011">2011</option>
                        <option value="2012">2012</option>
                        <option value="2013">2013</option>
                        <option value="2014">2014</option>
                        <option value="2015">2015</option>
                        <option value="2016">2016</option>
                        <option value="2017">2017</option>
                        <option value="2018">2018</option>
                        <option value="2019">2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                    </select>
                    &nbsp;&nbsp;
                    To:
                    <select id="dropdown-yearTo" class="form-control select2me form_control" v-model="selectedYearRange.to">
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015">2015</option>
                        <option value="2014">2014</option>
                        <option value="2013">2013</option>
                        <option value="2012">2012</option>
                        <option value="2011">2011</option>
                        <option value="2010">2010</option>
                    </select>
                </p>
            </div>

            <div v-else-if="currentStep === 2" id="selectData" class="">
                <!-- Third Step: Data Selection -->
                <div class="export-buttons-container">
                    <span><button class="btn btn-primary" id="SelectAllData" @click="selectAll('categories')">Select All</button></span>
                    <span><button class="btn btn-primary" id="UnselectAllData" @click="unselectAll('categories')">Unselect All</button></span>

                    <div class="export-start-over-container">
                        <a-button type="button" class="btn btn-primary pull_right margin_right_0" id="start-over" @click="startOver">
                            Start Over
                            <template #icon>
                                <SyncOutlined/>
                            </template>
                        </a-button>
                    </div>
                </div>
                <h3>Select Display Category:<br></h3>

                <p v-for="category in displayCategories" :key="category.value">
                    <!-- Remove "Consumption Per Capita" on Regions export -->
                    <template v-if="locationType == 'countries' || category.value != 5">
                        <input
                            type="checkbox"
                            name="cpei"
                            class="dropdown-CPEI text_vertical_middle margin_right_5"
                            :value="category.value"
                            v-model="selectedDisplayCategories"
                        >
                        {{ category.label }}
                    </template>
                </p>

                <div class="clearfix"></div>
                <hr>

                <div class="export-display-values">
                    <p class="quarter padding_top_20">
                        <input
                            type="radio"
                            name="displayPercentage"
                            id="displayPercentageActual"
                            class="displayPercentage text_vertical_middle"
                            value="0"
                            v-model="selectedDisplayValues"
                        >&nbsp;&nbsp;&nbsp;Display Actual Values
                    </p>
                    <p class="quarter padding_top_20">
                        <input
                            type="radio"
                            name="displayPercentage"
                            id="displayPercentageChange"
                            class="displayPercentage text_vertical_middle"
                            value="1"
                            v-model="selectedDisplayValues"
                        >&nbsp;&nbsp;&nbsp;Display Percentage Values
                    </p>
                </div>
            </div>

            <div v-else-if="currentStep === 3" id="data-wrapper" class="">
                <!-- Fourth Step: Data Display -->
                <div class="export-buttons-container">
                    <a-button type="button" class="btn btn-primary pull_right margin_right_0" id="start-over" @click="startOver">
                        Start Over
                        <template #icon>
                            <SyncOutlined/>
                        </template>
                    </a-button>
                    <div class="export-start-over-container">
                        <a-button type="button" class="btn btn-primary margin_right_0 pull_right" id="excel-export-new" @click="exportExcel">
                            Export Excel
                            <template #icon>
                                <TableOutlined/>
                            </template>
                        </a-button>
                    </div>
                </div>

                <div style="clear:both"></div>
                <div id="compare-data" class="scrollable margin_top_30 border_top">
                    <a-table class="table-scrollable table-full-width custom_table_cels" :columns="generatedColumns"
                             :dataSource="displayedTableData" :pagination="false" size="small"
                             bordered>
                    </a-table>
                </div>
            </div>

            <div class="steps-action">
                <a-button v-if="currentStep === steps.length - 1" type="primary"
                          @click="message.success('Processing complete!')">Done
                </a-button>
                <a-button v-if="currentStep > 0" style="margin-right: 8px" @click="prev">
                    <template #icon>
                        <LeftOutlined/>
                    </template>
                    Previous
                </a-button>
                <a-button v-if="currentStep < steps.length - 1" type="primary" id="next" @click="next">
                    Next
                    <template #icon>
                        <RightOutlined/>
                    </template>
                </a-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #gcr-app .ant-steps {
        margin-bottom: 20px;
    }
    #gcr-app .export-wrapper {
        padding: 20px;
    }
    #gcr-app .export-container {
        position: relative;
    }
    #gcr-app .export-container .export-buttons-container {
        margin-bottom: 16px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
    }
    #gcr-app .export-container .ant-btn,
    #gcr-app .export-container .btn-primary,
    #gcr-app .export-container .btn-primary:visited,
    #gcr-app .export-container .btn-primary:after {
        display: inline-block;
        font-size: 11px;
        font-weight: 300 !important;
        text-transform: uppercase;
        line-height: 11px;
        text-shadow: -1px -1px 1px rgba(66, 139, 202, 1);
        padding: 10px 16px 8px 16px !important;
        color: #fff;
        background-color: #89C4F4;
        border-left: 0;
        border-top: 0;
        border-right: 0;
        border-bottom: 4px solid #428bca;
        border-radius: 6px 6px 6px 6px;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease-out;
    }
    #gcr-app .export-container button.ant-btn:hover,
    #gcr-app .export-container button.btn-primary:hover {
        color: #fff;
        background-color: #FFB848;
        border-left: 0;
        border-top: 0;
        border-right: 0;
        border-bottom: 4px solid #C27800;
        text-decoration: none;
        text-shadow: -1px -1px 1px rgba(194, 120, 0, 1);
        cursor: pointer;
        transition: all 0.2s ease-out;
    }
    #gcr-app .export-container h3,
    #gcr-app .export-container h5 {
        margin-bottom: 0;
        letter-spacing: -.5px;
        font-weight: 800;
        font-family: 'Lato', sans-serif !important;
        padding-bottom: 15px;
        color: #3289af;
        font-size: 21px;
        line-height: 24px;
        text-transform: initial;
    }
    #gcr-app .export-container h5 {
        font-size: 16px;
        line-height: 17px;
    }
    #gcr-app .export-container .export-select-item-group {
        padding-top: 10px;
    }
    #gcr-app .export-container .export-select-item:last-child {
        margin-bottom: 0;
    }
    #gcr-app .export-container .export-display-countries {
        margin-bottom: 20px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
    }
    #gcr-app .export-container .splitcolumns {
        margin: 0;
        padding: 0;

        -moz-column-count: 2;
        -moz-column-gap: 20px;
        -webkit-column-count: 2;
        -webkit-column-gap: 20px;
        column-count: 2;
        column-gap: 20px;
        list-style: none;
    }
    #gcr-app .export-container .export-start-over-container {
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    #gcr-app .export-container .form_control {
        height: 28px;
        padding: 5px 10px;
        font-size: 13px;
        font-weight: normal;
        color: #878686;
        background-color: #fff;
        border: 1px solid #dddddd;
        border-radius: 3px 3px 3px 3px;
        -moz-border-radius: 3px 3px 3px 3px;
        -webkit-border-radius: 3px 3px 3px 3px;
        -webkit-box-shadow: none;
        box-shadow: none;
        -webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    }
    #gcr-app .export-container .export-display-values {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 50px
    }
    #gcr-app .export-container #compare-data {
        overflow: auto;
        border-top: 1px solid #dddddd;
        margin-top: 30px !important;
    }
    #gcr-app .export-container .steps-action {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    #gcr-app .export-container #start-over,
    #gcr-app .export-container #next,
    #gcr-app .export-container #excel-export-new {
        display: flex;
        gap: 8px;
    }
    #gcr-app .export-container .anticon-sync,
    #gcr-app .export-container .anticon-right,
    #gcr-app .export-container .anticon-table {
        order: 1;
    }
    @media screen and (max-width: 670px) {
        #gcr-app .export-container .export-display-values {
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
        }
    }
    @media screen and (max-width: 425px) {
        #gcr-app .export-container .export-buttons-container {
            justify-content: center;
        }
        #gcr-app .export-container .export-start-over-container {
            margin-left: 0;
        }
        #gcr-app .export-container .splitcolumns {
            column-count: initial;
        }
    }
</style>