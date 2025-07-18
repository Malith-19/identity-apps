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
import { BrandingNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const branding: BrandingNS = {
    brandingCustomText: {
        revertScreenConfirmationModal: {
            content: "Once you confirm, your users will start to see the {{productName}} defaults and it will not be reversible. Please proceed with caution.",
            heading: "Are you sure?",
            message: "Reverting <1>{{screen}}</1> screen's customized text for the <3>{{locale}}</3> locale."
        },
        revertUnsavedConfirmationModal: {
            content: "If you switch the screen, your unsaved changes will be lost. Click <1>Confirm</1> to proceed.",
            heading: "Are you sure?",
            message: "Save your unsaved changes"
        },
        form: {
            genericFieldResetTooltip: "Reset to default",
            genericFieldPlaceholder: "Enter your text",
            fields: {
                copyright: {
                    hint: "Text that appears at the footer of the login screens. You can use `{{currentYear}}` placeholder to automatically display the current year."
                },
                "email.link.expiry.message": {
                    hint: "The message that appears when the email link expires. If not set, {{productName}} defaults are used."
                },
                "privacy.policy": {
                    hint: "The privacy policy text that appears at the footer of the login screens. If not set, {{productName}} defaults are used."
                },
                "site.title": {
                    hint: "The site title may appear in browser tabs, search engine results, social shares, etc. If not set, {{productName}} defaults are used."
                },
                "terms.of.service": {
                    hint: "The terms of service text that appears at the footer of the login screens. If not set, {{productName}} defaults are used."
                },
                "login.button": {
                    hint: "The text that appears on the main action button of the login box. If not set, {{productName}} defaults are used."
                },
                "login.heading": {
                    hint: "The heading of the login box. If not set, {{productName}} defaults are used."
                },
                "login.identifier.input.label": {
                    hint: "The label of the identifier input field in the login box. If not set, {{productName}} defaults are used.",
                    warning: "<0>IMPORTANT</0>: Customizing the login identifier label will replace the dynamic label when {{feature}} are <1>configured</1>."
                },
                "sms.otp.heading": {
                    hint: "The heading of the SMS OTP box. If not set, {{productName}} defaults are used."
                },
                "email.otp.heading": {
                    hint: "The heading of the Email OTP box. If not set, {{productName}} defaults are used."
                },
                "totp.heading": {
                    hint: "The heading of the TOTP box. If not set, {{productName}} defaults are used."
                },
                "sign.up.button": {
                    hint: "The text that appears on the main action button of the sign up box. If not set, {{productName}} defaults are used."
                },
                "sign.up.heading": {
                    hint: "The heading of the sign up box. If not set, {{productName}} defaults are used."
                },
                "password.recovery.body": {
                    hint: "The body text of the password recovery box. If not set, {{productName}} defaults are used."
                },
                "password.recovery.identifier.input.placeholder": {
                    hint: "The placeholder of the identifier input field in the password recovery box. If not set, {{productName}} defaults are used.",
                    warning: "<0>IMPORTANT</0>: Customizing the password recovery identifier placeholder will replace the dynamic placeholder when {{feature}} are <1>configured</1>."
                },
                "password.recovery.button.email.link": {
                    hint: "The text that appears on the main action button of the password recovery box. If not set, {{productName}} defaults are used."
                },
                "password.recovery.heading": {
                    hint: "The heading of the password recovery box. If not set, {{productName}} defaults are used."
                },
                "password.reset.button": {
                    hint: "The text that appears on the main action button of the password reset box. If not set, {{productName}} defaults are used."
                },
                "password.reset.heading": {
                    hint: "The heading of the password reset box. If not set, {{productName}} defaults are used."
                },
                "password.reset.success.action": {
                    hint: "The text that appears on the main action link of the password reset success box. If not set, {{productName}} defaults are used."
                },
                "password.reset.success.body": {
                    hint: "The body text of the password reset success box. If not set, {{productName}} defaults are used."
                },
                "password.reset.success.heading": {
                    hint: "The heading of the password reset success box. If not set, {{productName}} defaults are used."
                }
            }
        },
        localeSelectDropdown: {
            label: "Locale",
            placeholder: "Select locale"
        },
        modes: {
            text: {
                label: "Text Fields"
            },
            json: {
                label: "JSON"
            }
        },
        notifications: {
            getPreferenceError: {
                description: "Couldn't get {{screen}} screen's customized text for {{locale}}.",
                message: "Couldn't get the custom text"
            },
            revertError: {
                description: "Couldn't revert {{screen}} screen's customized text for {{locale}}.",
                message: "Couldn't revert the custom text"
            },
            resetSuccess: {
                description: "Successfully reverted {{screen}} screen's customized text for {{locale}}.",
                message: "Revert successful"
            },
            updateError: {
                description: "Couldn't update {{screen}} screen's customized text for {{locale}}.",
                message: "Couldn't update the custom text"
            },
            updateSuccess: {
                description: "Successfully updated {{screen}} screen's customized text for {{locale}}.",
                message: "Update Successful"
            }
        },
        screenSelectDropdown: {
            label: "Screen",
            placeholder: "Select screen"
        },
        screenSelectVariationDropdown: {
            label: "Variation",
            placeholder: "Select Variation"
        }
    },
    connectors: {
        multiAttributeLogin: "Multi Attribute Login Identifiers",
        alternativeLoginIdentifier: "Alternative Login Identifiers"
    },
    form: {
        actions: {
            resetAll: "Reset to Default",
            save: "Save & Publish"
        }
    },
    screens: {
        common: "Common",
        "email-link-expiry": "Email Link Expiry",
        "email-otp": "Email OTP",
        "email-template": "Email Templates",
        login: "Login",
        myaccount: "My Account",
        "password-recovery": "Password Recovery",
        "password-reset": "Password Reset",
        "password-reset-success": "Password Reset Link Sent",
        "push-auth": "Push Authentication",
        "sign-up": "Sign Up",
        "sms-otp": "SMS OTP",
        "totp": "TOTP",
        "username-recovery-claim": "Username Recovery Claim",
        "username-recovery-channel-selection": "Username Recovery Channel Selection",
        "username-recovery-success": "Username Recovery Success"
    },
    variations: {
        "sms-otp": "SMS OTP",
        "email-otp": "Email OTP",
        "email-link": "Email Link",
        "base": "Base",
        "multi": "Multi Option",
        "sms": "SMS",
        "email": "Email"
    },
    ai: {
        banner: {
            full: {
                heading: "Generate Your Branding Styles with AI",
                subHeading: "Enter your website URL and Branding AI will adjust the branding settings to match your theme.",
                button: "Try Branding AI"
            },
            input: {
                heading: "Generate Your Branding Styles with AI",
                subHeading: "Enter your website URL and Branding AI will adjust the branding settings to match your theme.",
                placeholder: "Enter website URL",
                button: "Generate Branding"
            },
            collapsed: {
                heading: "Generate Your Branding Styles with AI",
                subHeading: "Enter your website URL and Branding AI will adjust the branding settings to match your theme.",
                button: "Try Branding AI"
            }
        },
        disclaimer: "Branding AI can make errors. Verify the information for accuracy. Do not include any personal data such "+
        "as usernames, mobile numbers, or any other sensitive information.",
        notifications: {
            generateError: {
                description: "An error occurred while generating the branding.",
                message: "Branding generation failed"
            },
            generateLimitError: {
                description: "You have exceeded the limit for branding generation. " +
                    "Please try again in a few moments.",
                message: "Limit exceeded"
            },
            regenerateError: {
                description: "An error occurred while regenerating the branding.",
                message: "Branding regeneration failed"
            },
            resetSuccess: {
                description: "Successfully reset the AI generated branding.",
                message: "AI Branding reset successful"
            },
            renderingError: {
                description: "An error occurred while rendering the website.",
                message: "Website rendering failed"
            }
        },
        screens: {
            loading: {
                heading: "Generating your branding",
                didYouKnow: "Did you know?",
                facts: {
                    0: "{{productName}}'s advanced theming capabilities let you customize your site title, copyright info, and support email on login pages to match your brand identity.",
                    1: "You can enhance your login portal by updating links to your privacy policy, terms of service, and cookie policy for visible compliance with {{productName}}.",
                    2: "With {{productName}}'s branding features, you can ensure a consistent branding experience across all your applications."
                },
                states: {
                    0: "Getting things started",
                    1: "Analyzing your webpage...",
                    2: "Gathering visual elements...",
                    3: "Gathering visual elements...",
                    4: "Creating your branding theme...",
                    5: "Creating your branding theme...",
                    6: "Creating your branding theme...",
                    7: "Applying final touches...",
                    8: "Branding Generation Completed!"
                }
            }
        },
        title: "Branding AI",
        termsAndConditions: "Terms and Conditions"
    },
    tabs: {
        preview: {
            label: "Preview"
        },
        text: {
            label: "Text"
        }
    },
    customPageEditor: {
        backButton: "Go back",
        brandingNotConfiguredTooltip: "Branding is not enabled. Please configure and save the branding settings to " +
            "enable the custom layout editor.",
        tabs: {
            html: {
                label: "HTML"
            },
            css: {
                label: "CSS"
            },
            js: {
                label: "JavaScript"
            }
        },
        notifications: {
            successContentUpdate: {
                description: "Your changes have been saved and published.",
                message: "Custom layout content updated successfully"
            },
            errorContentUpdate: {
                description: "An error occurred while saving. Please try again.",
                message: "Custom layout content update failed"
            },
            errorContentSizeLimit: {
                description: "The content size exceeds the allowed limit. Please reduce the content size " +
                    "and try again.",
                message: "Content size limit exceeded"
            }
        }
    }
};
