/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

export interface SCIMConfigInterface {

    oidc: string;

    scim: {
        core1Schema: string,
        coreSchema: string,
        enterpriseSchema: string,
        userSchema: string,
        systemSchema: string,
        customEnterpriseSchema:string
    };

    scimEnterpriseUserClaimUri: {
        accountDisabled: string,
        accountLocked: string,
        askPassword: string,
        isReadOnlyUser: string,
        oneTimePassword: string,
        profileUrl: string
    };

    scimUserSchema: {
        addressesHome: string;
        addressesWork: string;
        emails: string;
        emailsHome: string;
        emailsWork: string;
        emailsOther: string;
        phoneNumbersMobile: string;
        phoneNumbersHome: string;
        phoneNumbersWork: string;
        phoneNumbersOther: string;
        phoneNumbersPager: string;
        phoneNumbersFax: string;
    };

    scimSystemSchema: {
        country: string;
        emailAddresses: string;
        mobileNumbers: string;
    };
}
