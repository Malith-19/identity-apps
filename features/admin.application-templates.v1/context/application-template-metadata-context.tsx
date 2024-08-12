/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { Context, createContext } from "react";
import { ApplicationTemplateMetadataInterface } from "../models/templates";

/**
 * Props interface for ApplicationTemplateMetadataContext.
 */
export interface ApplicationTemplateMetadataContextProps {
    /**
     * Application Template Metadata.
     */
    templateMetadata: ApplicationTemplateMetadataInterface;
    /**
     * Flag to determine if the application template metadata is being loaded.
     */
    isTemplateMetadataRequestLoading: boolean;
}

/**
 * Context object for managing application template metadata.
 */
const ApplicationTemplateMetadataContext: Context<ApplicationTemplateMetadataContextProps> =
  createContext<null | ApplicationTemplateMetadataContextProps>(null);

/**
 * Display name for the ApplicationTemplateMetadataContext.
 */
ApplicationTemplateMetadataContext.displayName = "ApplicationTemplateMetadataContext";

export default ApplicationTemplateMetadataContext;
