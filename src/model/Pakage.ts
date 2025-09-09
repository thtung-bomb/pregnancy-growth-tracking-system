import { Services } from "./service";

export interface Package {
	id: string;
	name: string;
	price: string;
	description?: string;
	packageServices: Services[];
	image: string;
	delivery_included: number;
	alerts_included: number;
	period: string;
	isDeleted: number;
	createdAt: string;
	updatedAt: string;
}

// services
// Define the interface for the User
export interface User {
	id: string;
	username: string;
	email: string;
	fullName: string;
	phone: string;
	role: string;
	isDeleted: boolean;
}

// Define the interface for the Purchase
export interface Purchase {
	id: string;
	status: string;
	isActive: boolean;
	isDeleted: boolean;
	createdAt: string;
	updatedAt: string;
	package: Package;
	user: User;
}
