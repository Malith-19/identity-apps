/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { DecodedIDTokenPayload, useAuthContext } from "@asgardeo/auth-react";
import { AllFeatureInterface } from "@wso2is/access-control";
import { OrganizationManagementConstants } from "@wso2is/admin.core.v1/constants/organization-constants";
import useRequest, {
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState } from "@wso2is/admin.core.v1/store";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { HttpMethods } from "@wso2is/core/models";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFeatureGateResourceEndpoints } from "../configs/endpoints";

/**
 * Custom hook to get all features from the feature gate.
 *
 * @example
 * `const { data, error, isLoading, isValidating, mutate } = useGetAllFeatures();`
 *
 * @returns The result of the request, including data, error, loading state, and mutate function.
 */
const useGetAllFeatures = <
    Data = AllFeatureInterface[],
    Error = RequestErrorInterface
>(): RequestResultInterface<Data, Error> => {
    const [ orgIdentifier, setOrgIdentifier ] = useState<string>();
    const { getDecodedIDToken } = useAuthContext();
    const organizationType: OrganizationType = useSelector(
        (state: AppState) => state.organization.organizationType
    );

    const baseUrl: string = window["AppUtils"]?.getServerOriginWithTenant(false);

    // TODO: Remove this config once the deployment issues are sorted out.
    const isFeatureGateEnabled: boolean = useSelector((state: AppState) => state?.config?.ui?.isFeatureGateEnabled);
    const shouldSendRequest : boolean = isFeatureGateEnabled
        && !!orgIdentifier
        && orgIdentifier !== OrganizationManagementConstants.ROOT_ORGANIZATION.name;

    useEffect(() => {
        getDecodedIDToken().then((response: DecodedIDTokenPayload) => {
            // Set tenant domain as organization identifier.
            setOrgIdentifier(response.org_handle);
        });
    }, [ organizationType ]);

    const requestConfig: any = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${getFeatureGateResourceEndpoints(baseUrl).allFeatures?.replace("{org-uuid}", orgIdentifier)}`
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldSendRequest ? requestConfig : null, {
        shouldRetryOnError: false
    });

    return {
        data,
        error: error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};

export default useGetAllFeatures;
