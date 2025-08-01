/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Box from "@oxygen-ui/react/Box";
import Drawer, { DrawerProps } from "@oxygen-ui/react/Drawer";
import IconButton from "@oxygen-ui/react/IconButton";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronDownIcon } from "@oxygen-ui/react-icons";
import AICard from "@wso2is/common.ai.v1/components/ai-card";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, HTMLAttributes, ReactElement, SVGProps } from "react";
import { useSelector } from "react-redux";
import ResourcePanelDraggable from "./resource-panel-draggable";
import ResourcePanelStatic from "./resource-panel-static";
import { Element, ElementTypes } from "../../models/elements";
import { Resource, Resources } from "../../models/resources";
import { Step } from "../../models/steps";
import { Template } from "../../models/templates";
import { Widget } from "../../models/widget";
import "./resource-panel.scss";

/**
 * Props interface of {@link ResourcePanel}
 */
export interface ResourcePanelPropsInterface
    extends DrawerProps,
        IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    /**
     * Flow resources.
     */
    resources: Resources;
    /**
     * Callback to be triggered when a resource add button is clicked.
     * @param resource - Added resource.
     */
    onAdd: (resource: Resource) => void;
}

// TODO: Move this to Oxygen UI.
/* eslint-disable max-len */
const CubesIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000" { ...rest }>
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
        <g id="SVGRepo_iconCarrier">
            <path
                fill="none"
                stroke="#000000"
                strokeWidth="0.744"
                d="M6.5,10.5 L12,13.5 L17.5,10.5 L17.5,4.5 L12,1.5 L6.5,4.5 L6.5,10.5 Z M6.5,4.5 L12,7.5 L17.5,4.5 M12,7.5 L12,13.5 L12,7.5 Z M1,19.5 L6.5,22.5 L12,19.5 L12,13.5 L6.5,10.5 L1,13.5 L1,19.5 Z M1,13.5 L6.5,16.5 L12,13.5 M6.5,16.5 L6.5,22.5 L6.5,16.5 Z M12,19.5 L17.5,22.5 L23,19.5 L23,13.5 L17.5,10.5 L12,13.5 L12,19.5 Z M12,13.5 L17.5,16.5 L23,13.5 M17.5,16.5 L17.5,22.5 L17.5,16.5 Z"
            />
        </g>
    </svg>
);

// TODO: Move this to Oxygen UI.
const NodesIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="#000000" { ...rest }>
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
        <g id="SVGRepo_iconCarrier">
            <title>nodes</title>
            <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                    <rect width="48" height="48" fill="none" />
                </g>
                <g id="Layer_6" data-name="Layer 6">
                    <path d="M36,19.4v-9L24,2,12,10.4v9l-10,7V37.6L14,46l10-7.1L34,46l12-8.5V26.4Zm-14,16-8,5.7L6,35.5v-7l7.9-5.6L22,28.6Zm-6-16V12.5l8-5.6,8,5.6v6.9L24,25Zm26,16-8,5.7-8-5.6V28.6l8-5.7,8,5.6Z" />
                </g>
            </g>
        </g>
    </svg>
);

// TODO: Move this to Oxygen UI.
const WidgetsIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" { ...rest }>
        <g id="SVGRepo_bgCarrier" strokeWidth="0" />
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
        <g id="SVGRepo_iconCarrier">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.448 1.75H6.552C7.45047 1.74997 8.19971 1.74995 8.79448 1.82991C9.42228 1.91432 9.98908 2.09999 10.4445 2.55546C10.9 3.01093 11.0857 3.57773 11.1701 4.20552C11.2501 4.8003 11.25 5.54951 11.25 6.44798V17.552C11.25 18.4505 11.2501 19.1997 11.1701 19.7945C11.0857 20.4223 10.9 20.9891 10.4445 21.4445C9.98908 21.9 9.42228 22.0857 8.79448 22.1701C8.1997 22.2501 7.45048 22.25 6.552 22.25H6.44801C5.54953 22.25 4.80031 22.2501 4.20552 22.1701C3.57773 22.0857 3.01093 21.9 2.55546 21.4445C2.09999 20.9891 1.91432 20.4223 1.82991 19.7945C1.74995 19.1997 1.74997 18.4505 1.75 17.552V6.448C1.74997 5.54954 1.74995 4.8003 1.82991 4.20552C1.91432 3.57773 2.09999 3.01093 2.55546 2.55546C3.01093 2.09999 3.57773 1.91432 4.20552 1.82991C4.8003 1.74995 5.54954 1.74997 6.448 1.75ZM4.4054 3.31654C3.94393 3.37858 3.74644 3.4858 3.61612 3.61612C3.4858 3.74644 3.37858 3.94393 3.31654 4.4054C3.2516 4.88843 3.25 5.53599 3.25 6.5V17.5C3.25 18.464 3.2516 19.1116 3.31654 19.5946C3.37858 20.0561 3.4858 20.2536 3.61612 20.3839C3.74644 20.5142 3.94393 20.6214 4.4054 20.6835C4.88843 20.7484 5.53599 20.75 6.5 20.75C7.46401 20.75 8.11157 20.7484 8.59461 20.6835C9.05607 20.6214 9.25357 20.5142 9.38389 20.3839C9.5142 20.2536 9.62143 20.0561 9.68347 19.5946C9.74841 19.1116 9.75 18.464 9.75 17.5V6.5C9.75 5.53599 9.74841 4.88843 9.68347 4.4054C9.62143 3.94393 9.5142 3.74644 9.38389 3.61612C9.25357 3.4858 9.05607 3.37858 8.59461 3.31654C8.11157 3.2516 7.46401 3.25 6.5 3.25C5.53599 3.25 4.88843 3.2516 4.4054 3.31654Z"
                fill="#000000"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.448 10.75H17.552C18.4505 10.75 19.1997 10.7499 19.7945 10.8299C20.4223 10.9143 20.9891 11.1 21.4445 11.5555C21.9 12.0109 22.0857 12.5777 22.1701 13.2055C22.2501 13.8003 22.25 14.5495 22.25 15.4479V17.552C22.25 18.4505 22.2501 19.1997 22.1701 19.7945C22.0857 20.4223 21.9 20.9891 21.4445 21.4445C20.9891 21.9 20.4223 22.0857 19.7945 22.1701C19.1997 22.2501 18.4505 22.25 17.5521 22.25H17.448C16.5496 22.25 15.8003 22.2501 15.2055 22.1701C14.5777 22.0857 14.0109 21.9 13.5555 21.4445C13.1 20.9891 12.9143 20.4223 12.8299 19.7945C12.7499 19.1997 12.75 18.4505 12.75 17.552V15.448C12.75 14.5495 12.7499 13.8003 12.8299 13.2055C12.9143 12.5777 13.1 12.0109 13.5555 11.5555C14.0109 11.1 14.5777 10.9143 15.2055 10.8299C15.8003 10.7499 16.5495 10.75 17.448 10.75ZM15.4054 12.3165C14.9439 12.3786 14.7464 12.4858 14.6161 12.6161C14.4858 12.7464 14.3786 12.9439 14.3165 13.4054C14.2516 13.8884 14.25 14.536 14.25 15.5V17.5C14.25 18.464 14.2516 19.1116 14.3165 19.5946C14.3786 20.0561 14.4858 20.2536 14.6161 20.3839C14.7464 20.5142 14.9439 20.6214 15.4054 20.6835C15.8884 20.7484 16.536 20.75 17.5 20.75C18.464 20.75 19.1116 20.7484 19.5946 20.6835C20.0561 20.6214 20.2536 20.5142 20.3839 20.3839C20.5142 20.2536 20.6214 20.0561 20.6835 19.5946C20.7484 19.1116 20.75 18.464 20.75 17.5V15.5C20.75 14.536 20.7484 13.8884 20.6835 13.4054C20.6214 12.9439 20.5142 12.7464 20.3839 12.6161C20.2536 12.4858 20.0561 12.3786 19.5946 12.3165C19.1116 12.2516 18.464 12.25 17.5 12.25C16.536 12.25 15.8884 12.2516 15.4054 12.3165Z"
                fill="#000000"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.4748 1.75C16.0303 1.75 15.6592 1.74999 15.3546 1.77077C15.0375 1.79241 14.738 1.83905 14.4476 1.95933C13.7738 2.23844 13.2384 2.7738 12.9593 3.44762C12.8391 3.73801 12.7924 4.03754 12.7708 4.35464C12.75 4.65925 12.75 5.03029 12.75 5.47475V5.52525C12.75 5.96972 12.75 6.34075 12.7708 6.64537C12.7924 6.96247 12.8391 7.26199 12.9593 7.55238C13.2384 8.22621 13.7738 8.76156 14.4476 9.04067C14.738 9.16095 15.0375 9.2076 15.3546 9.22923C15.6592 9.25002 16.0303 9.25001 16.4747 9.25H18.5253C18.9697 9.25001 19.3408 9.25002 19.6454 9.22923C19.9625 9.2076 20.262 9.16095 20.5524 9.04067C21.2262 8.76156 21.7616 8.22621 22.0407 7.55238C22.161 7.26199 22.2076 6.96247 22.2292 6.64537C22.25 6.34076 22.25 5.96972 22.25 5.52526V5.47475C22.25 5.03029 22.25 4.65925 22.2292 4.35464C22.2076 4.03754 22.161 3.73801 22.0407 3.44762C21.7616 2.7738 21.2262 2.23844 20.5524 1.95933C20.262 1.83905 19.9625 1.79241 19.6454 1.77077C19.3408 1.74999 18.9698 1.75 18.5254 1.75H16.4748ZM15.0216 3.34515C15.0988 3.3132 15.216 3.28372 15.4567 3.26729C15.7042 3.25041 16.0238 3.25 16.5 3.25H18.5C18.9762 3.25 19.2958 3.25041 19.5433 3.26729C19.784 3.28372 19.9012 3.3132 19.9784 3.34515C20.2846 3.47202 20.528 3.71536 20.6549 4.02165C20.6868 4.0988 20.7163 4.21602 20.7327 4.45674C20.7496 4.70421 20.75 5.0238 20.75 5.5C20.75 5.97621 20.7496 6.2958 20.7327 6.54326C20.7163 6.78399 20.6868 6.9012 20.6549 6.97836C20.528 7.28464 20.2846 7.52799 19.9784 7.65485C19.9012 7.68681 19.784 7.71629 19.5433 7.73271C19.2958 7.7496 18.9762 7.75 18.5 7.75H16.5C16.0238 7.75 15.7042 7.7496 15.4567 7.73271C15.216 7.71629 15.0988 7.68681 15.0216 7.65485C14.7154 7.52799 14.472 7.28464 14.3452 6.97836C14.3132 6.9012 14.2837 6.78399 14.2673 6.54326C14.2504 6.2958 14.25 5.97621 14.25 5.5C14.25 5.0238 14.2504 4.70421 14.2673 4.45675C14.2837 4.21602 14.3132 4.0988 14.3452 4.02165C14.472 3.71536 14.7154 3.47202 15.0216 3.34515Z"
                fill="#000000"
            />
        </g>
    </svg>
);
/* eslint-enable max-len */

/**
 * Flow builder resource panel that contains draggable components.
 *
 * @param props - Props injected to the component.
 * @returns The ResourcePanel component.
 */
const ResourcePanel: FunctionComponent<ResourcePanelPropsInterface> = ({
    "data-componentid": componentId = "resource-panel",
    children,
    open,
    resources,
    onAdd,
    ...rest
}: ResourcePanelPropsInterface): ReactElement => {
    const {
        elements: unfilteredElements,
        widgets: unfilteredWidgets,
        steps: unfilteredSteps,
        templates: unfilteredTemplates
    } = resources;

    const aiFeature: FeatureAccessConfigInterface = useSelector((state: any) => state?.config?.ui?.features?.ai);

    const elements: Element[] = unfilteredElements.filter(
        (element: Element) => element.display?.showOnResourcePanel !== false
    );
    const widgets: Widget[] = unfilteredWidgets.filter(
        (widget: Widget) => widget.display?.showOnResourcePanel !== false
    );
    const steps: Step[] = unfilteredSteps.filter((step: Step) => step.display?.showOnResourcePanel !== false);
    const templates: Template[] = unfilteredTemplates.filter(
        (template: Template) => template.display?.showOnResourcePanel !== false
    );
    const AITemplates: Template[] = unfilteredTemplates.filter(
        (template: Template) => template.type === "GENERATE_WITH_AI");

    return (
        <Box
            width="100%"
            height="100%"
            id="drawer-container"
            position="relative"
            bgcolor="white"
            component="div"
            data-componentid={ componentId }
            { ...rest }
        >
            { children }
            <Drawer
                open={ open }
                onClose={ () => {} }
                elevation={ 5 }
                PaperProps={ { className: "flow-builder-element-panel" } }
                BackdropProps={ { style: { position: "absolute" } } }
                ModalProps={ {
                    container: document.getElementById("drawer-container"),
                    keepMounted: true,
                    style: { position: "absolute" }
                } }
                SlideProps={ {
                    onExiting: (node: HTMLElement) => {
                        node.style.webkitTransform = "scaleX(0)";
                        node.style.transform = "scaleX(0)";
                        node.style.transformOrigin = "top left ";
                    }
                } }
                hideBackdrop={ true }
                className={ classNames("flow-builder-element-panel", { mini: !open }) }
                variant={ open ? "permanent" : "temporary" }
            >
                <div
                    className={ classNames("flow-builder-element-panel-content", {
                        "full-height": true
                    }) }
                >
                    <Accordion
                        square
                        disableGutters
                        defaultExpanded
                        className={ classNames("flow-builder-element-panel-categories", "starter-templates") }
                    >
                        <AccordionSummary
                            className="flow-builder-element-panel-category-heading"
                            expandIcon={ <ChevronDownIcon size={ 14 } /> }
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography variant="h6">Starter Templates</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="flow-builder-element-panel-category-details">
                            <Typography variant="body2">
                                Choose one of these templates to start building registration experience
                            </Typography>
                            <Stack direction="column" spacing={ 1 }>
                                { aiFeature?.enabled && AITemplates.map((aiTemplate: Template, index: number) => (
                                    <ResourcePanelStatic
                                        id={ `${aiTemplate.resourceType}-${aiTemplate.type}-${index}` }
                                        key={ aiTemplate.type }
                                        resource={ aiTemplate }
                                    >
                                        <AICard resource={ aiTemplate } onAdd={ onAdd }/>
                                    </ResourcePanelStatic>
                                )) }
                                { templates.map((template: Template, index: number) => (
                                    <ResourcePanelStatic
                                        id={ `${template.resourceType}-${template.type}-${index}` }
                                        key={ template.type }
                                        resource={ template }
                                        onAdd={ onAdd }
                                    />
                                )) }
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion square disableGutters className={ classNames("flow-builder-element-panel-categories") }>
                        <AccordionSummary
                            className="flow-builder-element-panel-category-heading"
                            expandIcon={ <ChevronDownIcon size={ 14 } /> }
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <IconButton>
                                <WidgetsIcon height={ 16 } width={ 16 } />
                            </IconButton>
                            <Typography variant="h6">Widgets</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="flow-builder-element-panel-category-details">
                            <Typography variant="body2">
                                Use these widgets to build up the flow using pre-created flow blocks
                            </Typography>
                            <Stack direction="column" spacing={ 1 }>
                                { widgets.map((widget: Widget, index: number) => (
                                    <ResourcePanelDraggable
                                        id={ `${widget.resourceType}-${widget.type}-${index}` }
                                        key={ widget.type }
                                        resource={ widget }
                                    />
                                )) }
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion square disableGutters className={ classNames("flow-builder-element-panel-categories") }>
                        <AccordionSummary
                            className="flow-builder-element-panel-category-heading"
                            expandIcon={ <ChevronDownIcon size={ 14 } /> }
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <IconButton>
                                <NodesIcon height={ 16 } width={ 16 } />
                            </IconButton>
                            <Typography variant="h6">Steps</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="flow-builder-element-panel-category-details">
                            <Typography variant="body2">Use these as steps in your flow</Typography>
                            <Stack direction="column" spacing={ 1 }>
                                { steps.map((step: Step, index: number) => (
                                    <ResourcePanelDraggable
                                        id={ `${step.resourceType}-${step.type}-${index}` }
                                        key={ `${step.type}-${kebabCase(step.display.label)}` }
                                        resource={ step }
                                    />
                                )) }
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion square disableGutters className={ classNames("flow-builder-element-panel-categories") }>
                        <AccordionSummary
                            className="flow-builder-element-panel-category-heading"
                            expandIcon={ <ChevronDownIcon size={ 14 } /> }
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <IconButton>
                                <CubesIcon height={ 16 } width={ 16 } />
                            </IconButton>
                            <Typography variant="h6">Components</Typography>
                        </AccordionSummary>
                        <AccordionDetails className="flow-builder-element-panel-category-details">
                            <Typography variant="body2">Use these components to build up your views</Typography>
                            <Stack direction="column" spacing={ 1 }>
                                { elements.map((element: Element, index: number) => (
                                    <ResourcePanelDraggable
                                        id={ `${element.resourceType}-${element.type}-${index}` }
                                        key={ element.type === ElementTypes.Input ?
                                            `${element.type}_${element.variant}` : element.type }
                                        resource={ element }
                                    />
                                )) }
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </Drawer>
        </Box>
    );
};

export default ResourcePanel;
