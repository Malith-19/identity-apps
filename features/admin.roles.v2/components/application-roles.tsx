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

import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormGroup from "@oxygen-ui/react/FormGroup";
import Radio from "@oxygen-ui/react/Radio";
import TextField from "@oxygen-ui/react/TextField";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { updateApplicationDetails } from "@wso2is/admin.applications.v1/api/application";
import { useGetApplication } from "@wso2is/admin.applications.v1/api/use-get-application";
import { ApplicationInterface } from "@wso2is/admin.applications.v1/models/application";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    LinkButton,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon } from "semantic-ui-react";
import { AutoCompleteRenderOption } from "./auto-complete-render-option";
import { ApplicationRoleWizard } from "./wizard-updated/application-role-wizard";
import { getApplicationRolesByAudience } from "../api/roles";
import { RoleAudienceTypes } from "../constants/role-constants";
import useGetApplicationRolesByAudienceV3 from "../hooks/use-get-application-roles-by-audience-v3";
import {
    AssociatedRolesPatchObjectInterface,
    BasicRoleInterface, RolesV2Interface,
    RolesV2ResponseInterface
} from "../models/roles";


interface ApplicationRolesSettingsInterface extends IdentifiableComponentInterface {
    /**
     * on application update callback
     */
    onUpdate: (id: string) => void;
    /**
     * Make the component read only.
     */
    readOnly?: boolean;
    /**
     * Original template ID of the application for which the roles are created.
     */
    originalTemplateId?: string;
}

/**
 * Application roles component.
 *
 * @param props - Props related to application roles component.
 */
export const ApplicationRoles: FunctionComponent<ApplicationRolesSettingsInterface> = (
    props: ApplicationRolesSettingsInterface
): ReactElement => {

    const {
        onUpdate,
        originalTemplateId,
        readOnly,
        [ "data-componentid" ]: componentId
    } = props;

    const path: string[] = history.location.pathname.split("/");
    const appId: string = path[path.length - 1].split("#")[0];

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();
    const { getLink } = useDocumentation();
    const { data: application } = useGetApplication(appId, !!appId);

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ shouldUpdateRoleAudience, setShouldUpdateRoleAudience ] = useState<boolean>(false);
    const [ showSwitchAudienceWarning, setShowSwitchAudienceWarning ] = useState<boolean>(false);
    const [ roleAudience, setRoleAudience ] =
        useState<RoleAudienceTypes>(application?.associatedRoles?.allowedAudience ?? RoleAudienceTypes.ORGANIZATION);
    const [ tempRoleAudience, setTempRoleAudience ] =
        useState<RoleAudienceTypes>(application?.associatedRoles?.allowedAudience ?? RoleAudienceTypes.ORGANIZATION);

    const [ roleList, setRoleList ] = useState<BasicRoleInterface[]>([]);
    const [ selectedRoles, setSelectedRoles ] =
        useState<BasicRoleInterface[]>(application?.associatedRoles?.roles ?? []);
    const [ initialSelectedRoles, setInitialSelectedRoles ] =
        useState<BasicRoleInterface[]>(application?.associatedRoles?.roles ?? []);
    const [ activeOption, setActiveOption ] = useState<BasicRoleInterface>(undefined);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const userRolesV3FeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3
    );
    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const hasRoleCreatePermissions: boolean = useRequiredScopes(
        userRolesV3FeatureEnabled
            ? userRolesV3FeatureConfig?.scopes?.create
            : featureConfig?.userRoles?.scopes?.create
    );

    // Use the SWR hook for V3 API or fallback to direct API call for legacy
    const {
        data: rolesV3Data,
        error: rolesV3Error,
        isLoading: isRolesV3Loading,
        mutate: mutateRolesV3
    } = useGetApplicationRolesByAudienceV3(
        roleAudience,
        appId,
        null,
        null,
        null,
        "users,groups,permissions,associatedApplications",
        userRolesV3FeatureEnabled
    );

    /**
     * Fetch application roles on component load and audience switch.
     */
    useEffect(() => {
        getApplicationRoles();
        if (roleAudience === application?.associatedRoles?.allowedAudience) {
            setSelectedRoles(application?.associatedRoles?.roles);
            setInitialSelectedRoles(application?.associatedRoles?.roles);
        } else {
            setSelectedRoles([]);
            setInitialSelectedRoles([]);
        }
    }, [ roleAudience ]);

    /**
     * Send a request to update roles when one of the role audience radio buttons is selected.
     */
    useEffect(() => {

        if (!shouldUpdateRoleAudience) {
            return;
        }

        updateRoles();
    }, [ shouldUpdateRoleAudience, roleAudience ]);

    /**
     * Handles the click event of the New Role button.
     */
    const handleAddNewRoleWizardClick = (): void => {
        setShowWizard(true);
    };

    /**
     * Fetch application roles.
     */
    const getApplicationRoles = (shouldUpdateSelectedRolesList?: boolean): void => {
        if (userRolesV3FeatureEnabled) {
            // For V3 API, use SWR data
            if (rolesV3Data) {
                const rolesArray: BasicRoleInterface[] = [];

                rolesV3Data?.Resources?.forEach((role: RolesV2Interface) => {
                    rolesArray.push({
                        id: role?.id,
                        name: role?.displayName
                    });
                });

                setRoleList(rolesArray);

                if (shouldUpdateSelectedRolesList) {
                    setSelectedRoles(rolesArray);
                }
            }

            if (rolesV3Error) {
                if (rolesV3Error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: rolesV3Error?.response?.data?.description ??
                            rolesV3Error?.response?.data?.detail ??
                            t("extensions:develop.applications.edit.sections.roles.notifications." +
                                "fetchApplicationRoles.error.description"),
                        level: AlertLevels.ERROR,
                        message: rolesV3Error?.response?.data?.message ??
                            t("extensions:develop.applications.edit.sections.roles.notifications." +
                                "fetchApplicationRoles.error.message")
                    }));

                    return;
                }
                dispatch(addAlert({
                    description: t("extensions:develop.applications.edit.sections.roles.notifications." +
                        "fetchApplicationRoles.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.roles.notifications." +
                        "fetchApplicationRoles.genericError.message")
                }));

                setRoleList([]);
            }
        } else {
            // For legacy API, use direct API call
            setIsLoading(true);
            getApplicationRolesByAudience(roleAudience, appId, null, null, null,
                "users,groups,permissions,associatedApplications")
                .then((response: RolesV2ResponseInterface) => {
                    const rolesArray: BasicRoleInterface[] = [];

                    response?.Resources?.forEach((role: RolesV2Interface) => {
                        rolesArray.push({
                            id: role?.id,
                            name: role?.displayName
                        });
                    });

                    setRoleList(rolesArray);

                    if (shouldUpdateSelectedRolesList) {
                        setSelectedRoles(rolesArray);
                    }
                }).catch((error: AxiosError) => {
                    if (error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error?.response?.data?.description ??
                                error?.response?.data?.detail ??
                                t("extensions:develop.applications.edit.sections.roles.notifications." +
                                    "fetchApplicationRoles.error.description"),
                            level: AlertLevels.ERROR,
                            message: error?.response?.data?.message ??
                                t("extensions:develop.applications.edit.sections.roles.notifications." +
                                    "fetchApplicationRoles.error.message")
                        }));

                        return;
                    }
                    dispatch(addAlert({
                        description: t("extensions:develop.applications.edit.sections.roles.notifications." +
                            "fetchApplicationRoles.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("extensions:develop.applications.edit.sections.roles.notifications." +
                            "fetchApplicationRoles.genericError.message")
                    }));

                    setRoleList([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    /**
     * Triggers on role update.
     */
    const updateRoles = (): void => {
        setIsSubmitting(true);
        const isRoleAudienceChanged: boolean = roleAudience !== application?.associatedRoles?.allowedAudience;
        const data: AssociatedRolesPatchObjectInterface = {
            allowedAudience: roleAudience,
            roles: (isRoleAudienceChanged || !selectedRoles)
                ? []
                : selectedRoles.map((role: BasicRoleInterface) => {
                    return {
                        id: role.id
                    };
                })
        };

        const updatedApplication: ApplicationInterface = {
            associatedRoles: data,
            id: appId,
            name: application.name
        };

        updateApplicationDetails(updatedApplication)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.updateApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.updateApplication.success.message")
                }));

                onUpdate(appId);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.updateApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.updateApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.updateApplication.genericError" +
                        ".message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
                setShouldUpdateRoleAudience(false);
            });
    };

    /**
     * Prompt the user to confirm the role audience switch.
     *
     * @param selectedAudience - selected audience
     */
    const promptAudienceSwitchWarning = (selectedAudience: RoleAudienceTypes): void => {
        setTempRoleAudience(selectedAudience);
        setShowSwitchAudienceWarning(true);
    };

    /**
     * Handles the on role created callback.
     */
    const onRoleCreated = () => {
        if (userRolesV3FeatureEnabled) {
            // For V3 API, use SWR mutate to refresh data
            mutateRolesV3();
        } else {
            // For legacy API, use direct API call
            getApplicationRoles(true);
        }
        onUpdate(appId);
    };

    return (
        <>
            <EmphasizedSegment
                loading={ userRolesV3FeatureEnabled ? isRolesV3Loading : isLoading }
                padded="very"
                data-componentid={ componentId }
            >
                <Grid>
                    <Grid.Row>
                        <Grid.Column className="heading-wrapper" width={ 10 }>
                            <Heading as="h4">
                                { t("extensions:develop.applications.edit.sections.rolesV2.heading") }
                            </Heading>
                            <Heading subHeading ellipsis as="h6">
                                { t("extensions:develop.applications.edit.sections.rolesV2.subHeading") }
                                <DocumentationLink
                                    link={ getLink("develop.applications.roles.learnMore") }
                                >
                                    { t("common:learnMore") }
                                </DocumentationLink>
                            </Heading>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <Heading as="h5" className="mb-2">
                                { t("extensions:develop.applications.edit.sections.rolesV2.roleAudience") }
                            </Heading>
                        </Grid.Column>
                        <Grid.Column width={ 10 }>
                            <FormGroup>
                                <Grid>
                                    <Grid.Row columns={ 2 } className="pb-0">
                                        <Grid.Column width={ 4 }>
                                            <FormControlLabel
                                                className="mt-1"
                                                checked={ roleAudience === RoleAudienceTypes.APPLICATION }
                                                control={ <Radio size="small" /> }
                                                onChange={ () =>
                                                    promptAudienceSwitchWarning(RoleAudienceTypes.APPLICATION) }
                                                label={
                                                    t("extensions:develop.applications.edit.sections." +
                                                    "rolesV2.application")
                                                }
                                                data-componentid={ `${ componentId }-application-audience-checkbox` }
                                                disabled={ readOnly }
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={ 6 }>
                                            {
                                                !readOnly &&
                                                roleAudience === RoleAudienceTypes.APPLICATION &&
                                                hasRoleCreatePermissions
                                                    && (
                                                        <LinkButton
                                                            fluid
                                                            data-componentid="create-application-role-button"
                                                            onClick={ handleAddNewRoleWizardClick }
                                                        >
                                                            <Icon name="plus"/>
                                                            {
                                                                t("applications:edit." +
                                                                "sections.roles.createApplicationRoleWizard.button")
                                                            }
                                                        </LinkButton>
                                                    )
                                            }
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className="pt-0">
                                        <Grid.Column width={ 6 }>
                                            <FormControlLabel
                                                checked={ roleAudience === RoleAudienceTypes.ORGANIZATION }
                                                control={ <Radio size="small"/> }
                                                onChange={ () =>
                                                    promptAudienceSwitchWarning(RoleAudienceTypes.ORGANIZATION) }
                                                label={
                                                    t("extensions:develop.applications.edit.sections." +
                                                    "rolesV2.organization")
                                                }
                                                data-componentid={ `${ componentId }-organization-audience-checkbox` }
                                                disabled={ readOnly }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </FormGroup>
                        </Grid.Column>
                    </Grid.Row>
                    { tempRoleAudience === RoleAudienceTypes.APPLICATION ? (
                        <Grid.Row>
                            <Grid.Column width={ 16 }>
                                <Heading as="h5">
                                    { t("extensions:develop.applications.edit.sections.rolesV2.assignedRoles") }
                                </Heading>
                            </Grid.Column>
                            { /* {
                            // Will be enabled once the feature is completed.
                            roleAudience === RoleAudienceTypes.APPLICATION
                                && (
                                    <Grid.Column width={ 4 } textAlign="right">
                                        <Button
                                            startIcon={ <PlusIcon/> }
                                            variant="text"
                                        >
                                            Create Role
                                        </Button>
                                    </Grid.Column>
                                )
                        } */ }
                            <Grid.Column width={ 8 }>
                                <Autocomplete
                                    multiple
                                    disableCloseOnSelect
                                    readOnly={ readOnly }
                                    loading={ userRolesV3FeatureEnabled ? isRolesV3Loading : isLoading }
                                    options={ roleList }
                                    value={ selectedRoles ?? [] }
                                    data-componentid={ `${ componentId }-assigned-roles-list` }
                                    getOptionLabel={
                                        (role: BasicRoleInterface) => role.name
                                    }
                                    renderInput={ (params: AutocompleteRenderInputParams) => (
                                        <TextField
                                            { ...params }
                                            placeholder={ !readOnly && t("extensions:develop.applications.edit." +
                                            "sections.rolesV2.searchPlaceholder") }
                                        />
                                    ) }
                                    onChange={ (event: SyntheticEvent, roles: BasicRoleInterface[]) => {
                                        setSelectedRoles(roles);
                                    } }
                                    isOptionEqualToValue={
                                        (option: BasicRoleInterface, value: BasicRoleInterface) =>
                                            option.id === value.id
                                    }
                                    renderTags={ (
                                        value: BasicRoleInterface[],
                                        getTagProps: AutocompleteRenderGetTagProps
                                    ) => value.map((option: BasicRoleInterface, index: number) => (
                                        <>
                                            { /* `activeOption` and `setActiveOption` are not part of Chip API */ }
                                            { /* TODO: Tracker: https://github.com/wso2/product-is/issues/21351 */ }
                                            { /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */ }
                                            { /* @ts-ignore */ }
                                            <Chip
                                                { ...getTagProps({ index }) }
                                                key={ index }
                                                label={ option.name }
                                                activeOption={ activeOption }
                                                setActiveOption={ setActiveOption }
                                                variant={
                                                    initialSelectedRoles?.find(
                                                        (role: BasicRoleInterface) => role.id === option.id
                                                    )
                                                        ? "filled"
                                                        : "outlined"
                                                }
                                            />
                                        </>
                                    )) }
                                    renderOption={ (
                                        props: HTMLAttributes<HTMLLIElement>,
                                        option: BasicRoleInterface,
                                        { selected }: { selected: boolean }
                                    ) => (
                                        <AutoCompleteRenderOption
                                            selected={ selected }
                                            displayName={ option.name }
                                            renderOptionProps={ props }
                                        />
                                    ) }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    ) : null }
                    {
                        !readOnly && (
                            <Grid.Row className="mt-4">
                                <Grid.Column width={ 16 }>
                                    <PrimaryButton
                                        size="small"
                                        loading={ isSubmitting }
                                        onClick={ () => updateRoles() }
                                        ariaLabel="Roles update button"
                                        data-componentid={ `${ componentId }-update-button` }
                                    >
                                        { t("common:update") }
                                    </PrimaryButton>
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                </Grid>
            </EmphasizedSegment>
            <ConfirmationModal
                onClose={ (): void => {
                    setTempRoleAudience(roleAudience);
                    setShowSwitchAudienceWarning(false);
                } }
                type="negative"
                open={ showSwitchAudienceWarning }
                assertionHint={ t("extensions:develop.applications.edit.sections." +
                    "rolesV2.switchRoleAudience.applicationConfirmationModal.assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => {
                    setTempRoleAudience(roleAudience);
                    setShowSwitchAudienceWarning(false);
                } }
                onPrimaryActionClick={ (): void => {
                    setRoleAudience(tempRoleAudience);
                    setShouldUpdateRoleAudience(true);
                    setShowSwitchAudienceWarning(false);
                } }
                data-componentid={ `${ componentId }-switch-role-audience-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-componentid={ `${ componentId }-switch-role-audience-confirmation-modal-header` }
                >
                    { tempRoleAudience === RoleAudienceTypes.APPLICATION
                        ? t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.applicationConfirmationModal.header")
                        : t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.organizationConfirmationModal.header")
                    }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-componentid={ `${ componentId }-switch-role-audience-confirmation-modal-message` }
                >
                    { tempRoleAudience === RoleAudienceTypes.APPLICATION
                        ? t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.applicationConfirmationModal.message")
                        : t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.organizationConfirmationModal.message")
                    }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-componentid={ `${ componentId }-switch-role-audience-confirmation-modal-content` }
                >
                    { tempRoleAudience === RoleAudienceTypes.APPLICATION
                        ? t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.applicationConfirmationModal.content")
                        : t("extensions:develop.applications.edit.sections." +
                        "rolesV2.switchRoleAudience.organizationConfirmationModal.content")
                    }
                </ConfirmationModal.Content>
            </ConfirmationModal>
            {
                showWizard
                && roleAudience === RoleAudienceTypes.APPLICATION
                && (
                    <ApplicationRoleWizard
                        setUserListRequestLoading={ null }
                        data-testid="user-mgt-add-user-wizard-modal"
                        data-componentid="user-mgt-add-user-wizard-modal"
                        closeWizard={ () => {
                            setShowWizard(false);
                        } }
                        application={ application }
                        onRoleCreated={ onRoleCreated }
                        originalTemplateId={ originalTemplateId }
                    />
                )
            }
        </>
    );
};

/**
 * Default props for application roles tab component.
 */
ApplicationRoles.defaultProps = {
    "data-componentid": "application-roles-tab",
    readOnly: true
};
