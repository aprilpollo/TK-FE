import _ from 'lodash';
import type { PartialDeep } from 'type-fest';
import { type User } from '@/auth/user';

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data?: PartialDeep<User>): User {
	data = data || {};

	return _.defaults(data, {
		id: null,
		role: null, // guest
		displayName: null,
		firstName: null,
		lastName: null,
		bio: null,
		photoURL: '',
		email: '',
		shortcuts: [],
		settings: {},
		organization: {},
		loginRedirectUrl: '/'
	}) as User;
}

export default UserModel;
