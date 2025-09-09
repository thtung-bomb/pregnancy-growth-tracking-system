export interface User {
	id: string;
	username: string;
	password: string;
	email: string;
	fullName: string;
	image: string | null;
	phone: string;
	role: string;
	isDeleted: boolean;
}