import SignIn from "@/pages/auth/sign-in"
import SignUp from "@/pages/auth/sign-up"
import Dashboard from "@/pages/dashboard"
import Reports from "@/pages/reports"
import Settings from "@/pages/settings"
import Account from "@/pages/settings/account"
import Appearance from "@/pages/settings/appearance"
import Billing from "@/pages/settings/billing"
import Transactions from "@/pages/transactions"
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes/common/routePath"



export const authenticationRoutePaths = [
    { path: AUTH_ROUTES.SIGN_IN, Component: SignIn },
    { path: AUTH_ROUTES.SIGN_UP, Component: SignUp },
]

export const protectedRoutePaths = [
    { path: PROTECTED_ROUTES.OVERVIEW, Component: Dashboard },
    { path: PROTECTED_ROUTES.TRANSACTIONS, Component: Transactions },
    { path: PROTECTED_ROUTES.REPORTS, Component: Reports },
    {
        path: PROTECTED_ROUTES.SETTINGS, Component: Settings,
        children: [
            { index: true, Component: Account },
            { path: PROTECTED_ROUTES.SETTINGS, Component: Account },
            { path: PROTECTED_ROUTES.SETTINGS_APPEARANCE, Component: Appearance },
            { path: PROTECTED_ROUTES.SETTINGS_BILLING, Component: Billing },

        ]
    },

]