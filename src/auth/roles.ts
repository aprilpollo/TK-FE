/**
 * The authRoles object defines the authorization roles for the Fuse application.
 */
const authRoles = {
	/**
	 * The owner role grants access to users with the 'owner' role.
	 */
	owner: ['owner'],

	/**
	 * The admin role grants access to users with the 'admin' role.
	 */
	admin: ['admin'],

	/**
	 * The staff role grants access to users with the 'admin' or 'staff' role.
	 */
	staff: ['admin', 'staff'],

	/**
	 * The user role grants access to users with the 'owner', 'admin', 'staff', or 'user' role.
	 */
	user: ['owner', 'admin', 'staff', 'user'],

	/**
	 * The onlyGuest role grants access to unauthenticated users.
	 */
	onlyGuest: []
};

export default authRoles;
