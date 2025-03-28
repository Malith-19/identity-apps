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

import OxygenAlert, { AlertProps } from "@oxygen-ui/react/Alert";
import AppShell from "@oxygen-ui/react/AppShell";
import Navbar, { NavbarItems } from "@oxygen-ui/react/Navbar";
import Snackbar from "@oxygen-ui/react/Snackbar";
import { FeatureStatus, useCheckFeatureStatus } from "@wso2is/access-control";
import { getProfileInformation } from "@wso2is/admin.authentication.v1/store";
import Header from "@wso2is/admin.core.v1/components/header";
import { ProtectedRoute } from "@wso2is/admin.core.v1/components/protected-route";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { ConfigReducerStateInterface } from "@wso2is/admin.core.v1/models/reducer-state";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AppUtils } from "@wso2is/admin.core.v1/utils/app-utils";
import { CommonUtils as ConsoleCommonUtils } from "@wso2is/admin.core.v1/utils/common-utils";
import { RouteUtils } from "@wso2is/admin.core.v1/utils/route-utils";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import useUserPreferences from "@wso2is/common.ui.v1/hooks/use-user-preferences";
import {
    AlertInterface,
    AnnouncementBannerInterface,
    CategorizedRouteInterface,
    ChildRouteInterface,
    FeatureAccessConfigInterface,
    FeatureFlagsInterface,
    NavRouteInterface,
    ProfileInfoInterface,
    RouteInterface
} from "@wso2is/core/models";
import { initializeAlertSystem } from "@wso2is/core/store";
import { RouteUtils as CommonRouteUtils, CommonUtils } from "@wso2is/core/utils";
import {
    Alert,
    ContentLoader,
    EmptyPlaceholder,
    ErrorBoundary,
    GenericIcon,
    LinkButton
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import sortBy from "lodash-es/sortBy";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    ReactNode,
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { System } from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { Action } from "reduce-reducers";
import { ThunkDispatch } from "redux-thunk";
import { getAppViewRoutes } from "../configs/routes";

/**
 * Parent component for features inherited from Dashboard layout skeleton.
 *
 * @param props - Props injected to the component.
 *
 * @returns Dashboard Layout Wrapper.
 */
const DashboardLayout: FunctionComponent<RouteComponentProps> = (
    props: RouteComponentProps
): ReactElement => {
    const { location } = props;

    const dispatch: ThunkDispatch<AppState, void, Action> = useDispatch();

    const { t } = useTranslation();

    const { setPreferences, leftNavbarCollapsed } = useUserPreferences();

    const isMarketingConsentBannerEnabled: boolean = useSelector((state: AppState) => {
        return state?.config?.ui?.isMarketingConsentBannerEnabled;
    });

    const [ announcement, setAnnouncement ] = useState<
        AnnouncementBannerInterface
    >();

    const [ showAnnouncement, setShowAnnouncement ] = useState<boolean>(true);

    const config: ConfigReducerStateInterface = useSelector(
        (state: AppState) => state.config
    );
    const profileInfo: ProfileInfoInterface = useSelector(
        (state: AppState) => state.profile.profileInfo
    );
    const alert: AlertInterface = useSelector(
        (state: AppState) => state.global.alert
    );
    const alertSystem: System = useSelector(
        (state: AppState) => state.global.alertSystem
    );
    const developFilteredRoutes: RouteInterface[] = useSelector(
        (state: AppState) => state.routes.developeRoutes.filteredRoutes
    );
    const developSanitizedRoutes: RouteInterface[] = useSelector(
        (state: AppState) => state.routes.developeRoutes.sanitizedRoutes
    );

    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const [ selectedRoute, setSelectedRoute ] = useState<
        RouteInterface | ChildRouteInterface
    >(getAppViewRoutes()[ 0 ]);

    const organizationLoading: boolean = useSelector(
        (state: AppState) => state?.organization?.getOrganizationLoading
    );
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const initLoad: MutableRefObject<boolean> = useRef(true);


    const sanitizedRoutes: RouteInterface[] = useMemo(() => {
        return [
            ...sortBy(developSanitizedRoutes, "order") ];
    }, [ developSanitizedRoutes ]);

    const filteredRoutes: RouteInterface[] = useMemo(() => {
        const developRoutes: RouteInterface[] = developFilteredRoutes.filter(
            (route: RouteInterface) => route.path != "*");

        return [ ...developRoutes ];
    }, [ developFilteredRoutes ]);

    const { isSubOrganization } = useGetCurrentOrganizationType();

    useEffect(() => {
        if (!location?.pathname) {
            return;
        }

        if (initLoad.current) {
            // Try to handle any un-expected routing issues. Returns a void if no issues are found.
            RouteUtils.gracefullyHandleRouting(
                filteredRoutes,
                AppConstants.getAdminViewBasePath(),
                location.pathname
            );
            initLoad.current = false;
        }

        setSelectedRoute(
            CommonRouteUtils.getInitialActiveRoute(
                location.pathname,
                filteredRoutes
            )
        );
    }, [ location.pathname, filteredRoutes ]);

    useEffect(() => {
        if (!isEmpty(profileInfo)) {
            return;
        }

        dispatch(getProfileInformation());
    }, [ dispatch, profileInfo ]);
    /*
     * Callback for side panel hamburger click.
     */
    const handleSidePanelToggleClick = (): void => {
        setPreferences({ leftNavbarCollapsed: !leftNavbarCollapsed });
    };

    /**
     * Conditionally renders a route. If a route has defined a Redirect to
     * URL, it will be directed to the specified one. If the route is stated
     * as protected, It'll be rendered using the `ProtectedRoute`.
     *
     * @param route - Route to be rendered.
     * @param key - Index of the route.
     * @returns Resolved route to be rendered.
     */
    const renderRoute = (route: RouteInterface, key: number): ReactNode =>
        route.redirectTo ? (
            <Redirect key={ key } to={ route.redirectTo } />
        ) : route.protected ? (
            <ProtectedRoute
                component={ route.component ? route.component : null }
                path={ route.path }
                key={ key }
                exact={ route.exact }
            />
        ) : (
            <Route
                path={ route.path }
                render={ (renderProps: RouteComponentProps): ReactNode =>
                    route.component ? (
                        <route.component { ...renderProps } />
                    ) : null
                }
                key={ key }
                exact={ route.exact }
            />
        );

    /**
     * Resolves the set of routes for the react router.
     * This function recursively adds any child routes
     * defined.
     *
     * @returns Set of resolved routes.
     */
    const resolveRoutes = (): RouteInterface[] | ReactNode[] => {
        const resolvedRoutes: ReactNode[] = [];

        filteredRoutes.forEach((route: RouteInterface, key: number) => {
            resolvedRoutes.push(renderRoute(route, key));
        });

        return resolvedRoutes;
    };

    const handleAlertSystemInitialize = (system: System) => {
        dispatch(initializeAlertSystem(system));
    };

    /**
     * Listens to `config` changes and set the announcement.
     */
    useEffect(() => {
        if (isEmpty(config)) {
            return;
        }

        if (
            !config?.ui?.announcements ||
            !(config?.ui?.announcements instanceof Array) ||
            config?.ui?.announcements.length < 1
        ) {
            return;
        }

        setAnnouncement(
            CommonUtils.getValidAnnouncement(
                config.ui.announcements,
                ConsoleCommonUtils.getSeenAnnouncements()
            )
        );
    }, [ config ]);

    /**
     * Handles announcement dismiss callback.
     */
    const handleAnnouncementDismiss = () => {
        ConsoleCommonUtils.setSeenAnnouncements(announcement.id);

        const validAnnouncement: AnnouncementBannerInterface = CommonUtils.getValidAnnouncement(
            config.ui.announcements,
            ConsoleCommonUtils.getSeenAnnouncements()
        );

        if (!validAnnouncement) {
            setAnnouncement(null);

            return;
        }

        setShowAnnouncement(false);
        setAnnouncement(validAnnouncement);
    };

    /**
     * Resolves the feature flag status of a given feature.
     *
     * @param featureName - Name of the feature.
     * @param featureKey - Key of the feature.
     *
     * @returns Feature status label.
     */
    const resolveFeatureFlag = (featureName: string, featureKey: string): FeatureStatusLabel=> {
        const config: FeatureAccessConfigInterface = featureConfig?.[featureName];

        if (!config) {
            return null;
        }

        const featureFlag: FeatureFlagsInterface = config?.featureFlags?.find(
            (featureFlag: FeatureFlagsInterface) => featureFlag.feature === featureKey);

        if (featureFlag?.subOrgsOnly === "TRUE" && !isSubOrganization()) {
            return null;
        }

        return FeatureStatusLabel[featureFlag?.flag];
    };

    const generateNavbarItems = (): NavbarItems[] => {
        const categorizedRoutes: CategorizedRouteInterface = {};

        let index: number = 0;
        const UNCATEGORIZED: string = "uncategorized";

        for (const route of RouteUtils.groupNavbarRoutes(sanitizedRoutes, saasFeatureStatus)) {
            if (route.navCategory) {
                if (categorizedRoutes[ route.navCategory.id ]) {
                    categorizedRoutes[ route.navCategory.id ].push(route);

                    continue;
                }

                categorizedRoutes[ route.navCategory.id ] = [ route ];
            } else {
                categorizedRoutes[ `${ UNCATEGORIZED }-${ index} ` ] = [ route ];
            }

            index++;
        }

        return Object.entries(categorizedRoutes).map(
            ([ _navCategory, routes ]: [ navCategory: string, routes: NavRouteInterface[] ]) => {
                return {
                    items: routes.map((route: NavRouteInterface) => {
                        const routeFlag: string = resolveFeatureFlag(route.id, route.featureFlagKey);

                        return {
                            "data-componentid": `side-panel-items-${ kebabCase(route.id) }`,
                            "data-testid":  `side-panel-items-${ kebabCase(route.id) }`,
                            icon: <GenericIcon
                                transparent
                                className="route-icon"
                                { ...route.icon }
                            />,
                            items: route.items?.map((subRoute: NavRouteInterface) => {

                                const subRouteFlag: string = resolveFeatureFlag(subRoute.id, subRoute.featureFlagKey);

                                return {
                                    "data-componentid": `side-panel-items-${ kebabCase(subRoute.id) }`,
                                    "data-testid":  `side-panel-items-${ kebabCase(subRoute.id) }`,
                                    icon: <GenericIcon
                                        transparent
                                        className="route-sub-icon"
                                        { ...subRoute.icon }
                                    />,
                                    label: t(subRoute.name),
                                    onClick: () => history.push(subRoute.path),
                                    selected: subRoute.selected ?? selectedRoute?.path === subRoute.path,
                                    tag: t(subRouteFlag)
                                };
                            }),
                            label: t(route.name),
                            onClick: () => history.push(route.path),
                            selected: route.selected ?? isRouteActive(route.path),
                            tag: t(routeFlag)
                        };
                    })
                };
            }
        );
    };

    /**
     *
     * @param routePath - current route path
     * @returns if the navigation item is active.
     */
    const isRouteActive = (routePath: string): boolean => {
        return history.location.pathname === routePath;
    };

    return (
        <>
            <Alert
                dismissInterval={ UIConstants.ALERT_DISMISS_INTERVAL }
                alertsPosition="br"
                alertSystem={ alertSystem }
                alert={ alert }
                onAlertSystemInitialize={ handleAlertSystemInitialize }
                withIcon={ true }
            />
            { announcement ? (
                <Snackbar
                    open={ showAnnouncement }
                    anchorOrigin={ { horizontal: "center", vertical: "top" } }
                    onClose={ handleAnnouncementDismiss }
                >
                    <OxygenAlert
                        severity={ announcement.color as AlertProps[ "severity" ] }
                        onClose={ handleAnnouncementDismiss }
                    >
                        { announcement.message }
                    </OxygenAlert>
                </Snackbar>
            ) : null }
            <AppShell
                header={
                    (<Header
                        onCollapsibleHamburgerClick={ handleSidePanelToggleClick }
                    />)
                }
                navigation={
                    (<Navbar
                        items={
                            !organizationLoading ? generateNavbarItems() : []
                        }
                        fill={ "solid" }
                        open={ !leftNavbarCollapsed as boolean }
                        collapsible={ false }
                    />)
                }
            >
                <ErrorBoundary
                    onChunkLoadError={ AppUtils.onChunkLoadError }
                    handleError={ (_error: Error, _errorInfo: React.ErrorInfo) => {
                        sessionStorage.setItem("auth_callback_url_console", config.deployment.appHomePath);
                    } }
                    fallback={
                        (<EmptyPlaceholder
                            action={
                                (<LinkButton
                                    onClick={ () => CommonUtils.refreshPage() }
                                >
                                    { t(
                                        "console:common.placeholders.brokenPage.action"
                                    ) }
                                </LinkButton>)
                            }
                            image={
                                getEmptyPlaceholderIllustrations().brokenPage
                            }
                            imageSize="tiny"
                            subtitle={ [
                                t(
                                    "console:common.placeholders.brokenPage.subtitles.0"
                                ),
                                t(
                                    "console:common.placeholders.brokenPage.subtitles.1"
                                )
                            ] }
                            title={ t(
                                "console:common.placeholders.brokenPage.title"
                            ) }
                        />)
                    }
                >
                    <Suspense fallback={ <ContentLoader dimmer={ false } /> }>
                        {
                            isMarketingConsentBannerEnabled
                                && applicationConfig.marketingConsent.getBannerComponent()
                        }
                        <Switch>{ resolveRoutes() as ReactNode[] }</Switch>
                    </Suspense>
                </ErrorBoundary>
            </AppShell>
        </>
    );
};

export default DashboardLayout;
