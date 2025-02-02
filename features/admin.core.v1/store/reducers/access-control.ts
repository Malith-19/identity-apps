/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccessControlReducerStateInterface } from "../../models/reducer-state";
import { AccessControlActionType, AccessControlActions } from "../actions/types/access-control";
 
/**
  * Common access control reducer initial state.
  */
const initialState: AccessControlReducerStateInterface = {
    isDevelopAllowed: true,
    isManageAllowed: true
};
 
/**
 * Reducer to handle the state of access control related actions.
 *
 * @param {AccessControlReducerStateInterface} state - Previous state
 * @param {AccessControlActionType} action - Action type.
 * @returns The new state
 */
export const accessControlReducer = (state: AccessControlReducerStateInterface = initialState,
    action: AccessControlActions): AccessControlReducerStateInterface => {

    switch (action.type) {
        case AccessControlActionType.SET_DEVELOPER_VISIBILITY:
            return {
                ...state,
                isDevelopAllowed: action.payload
            };
        case AccessControlActionType.SET_MANAGE_VISIBILITY:
            return {
                ...state,
                isManageAllowed: action.payload
            };
        default:
            return state;
    }
};
