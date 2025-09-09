// Mother model
interface Mother {
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

// Doctor model
interface Doctor {
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

// Fetal Record model
interface FetalRecord {
	id: string;
	name: string;
	note: string;
	dateOfPregnancyStart: string;
	expectedDeliveryDate: string;
	actualDeliveryDate: string | null;
	healthStatus: string;
	status: string;
	isDeleted: number;
	createdAt: string;
	updatedAt: string;
	checkupRecords: any[];  // Assuming checkup records will be another model, currently using an array
	mother: Mother;
}

// Appointment model
export interface AppointmentDetail {
	id: string;
	appointmentDate: string;
	status: string;
	isFollow: boolean;
	fetalRecord: FetalRecord;
	doctor: Doctor;
	appointmentServices: any[];  // Placeholder for appointment services
	medicationBills: any[];      // Placeholder for medication bills
	history: any[];              // Placeholder for history (potentially past status updates)
}