<template>
    <a-form
        name="basic"
        :label-col="{ span: 10 }"
        :wrapper-col="{ span: 14 }"
        class="form-container"
    >
        <a-form-item class="form-header">
            <span class="ant-form-text form-title">Facility Details</span>
            <a-button type="primary" html-type="submit" class="form-submit-btn">Save Facility</a-button>
        </a-form-item>
        <a-form-item label="Name" name="name">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="Parent company" name="parentCompany">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="Address" name="address1">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item name="address2" :wrapper-col="{ offset: 10 }">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item name="address3" :wrapper-col="{ offset: 10 }">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="City" name="city">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="State" name="state">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="Post Code" name="postCode">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="Country" name="country">
            <a-select>
                <a-select-option value="china">China</a-select-option>
                <a-select-option value="usa">U.S.A</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="Phone" name="phone">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="Fax" name="fax">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="Email" name="email">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="Website" name="website">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="Status" name="status">
            <a-select>
                <a-select-option value="announced">Announced</a-select-option>
                <a-select-option value="closed">Closed</a-select-option>
                <a-select-option value="operational">Operational</a-select-option>
                <a-select-option value="underConstruction">Under construction</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="Cement Type" name="cementType">
            <a-select>
                <a-select-option value="grey">Grey Cement</a-select-option>
                <a-select-option value="white">White Cement</a-select-option>
                <a-select-option value="slag">Slag</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="Type Of Works" name="typeOfWorks">
            <a-select>
                <a-select-option value="clinker">Clinker</a-select-option>
                <a-select-option value="grinding">Grinding</a-select-option>
                <a-select-option value="integrated">Integrated</a-select-option>
                <a-select-option value="terminal">Terminal</a-select-option>
            </a-select>
        </a-form-item>
        <a-form-item label="Clinker Capacity (Mta)" name="clinkerCapacity">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="Cement Capacity (Mta)" name="cementCapacity">
            <a-input placeholder="Enter text" />
        </a-form-item>
        <a-form-item label="Note" name="note">
            <a-textarea :rows="6"/>
        </a-form-item>
    </a-form>
</template>

<script>
export default {
    name: "PlantNewForm"
}
</script>

<style scoped>
    .form-container {
        margin-top: 0;
        margin-bottom: 25px;
        border-radius: 4px;
        padding: 12px 20px 15px;
        background-color: #fff;
        border: 1px solid #e7ecf1 !important;
    }
    .form-header {
        width: 100%;
        display: inline-block;
    }

    .form-title {
        text-transform: uppercase;
        text-align: left;
        padding: 10px 0;
        font-size: 16px;
        line-height: 18px;
        font-weight: 700;
    }

    .form-submit-btn {
        color: #FFF;
        background-color: #032239;
        border-color: #5e738b;
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 13px;
        line-height: 1.5;
        margin: 10px 0;
        transition: all .3s;
    }

    .form-submit-btn:hover,
    .form-submit-btn:focus {
        background: #04375C;
        border-color: #455566;
    }

    #basic_clinkerCapacity::placeholder,
    #basic_cementCapacity::placeholder {
        text-align: right;
    }
</style>