import { lazy } from 'react';
import { type RouteItemType } from '@/types';
import authRoles from "@/auth/roles"

const Dashboard = lazy(() => import('./dashboard'));

/**
 * The Dashboard page route.
 */
const DashboardRoute: RouteItemType = {
	path: 'dashboard',
	element: <Dashboard />,
	auth: authRoles.user,
};

export default DashboardRoute;
