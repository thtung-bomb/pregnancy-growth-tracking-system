// Appointment model
interface Appointment {
	id: string;
	appointmentDate: string;
	status: string;
	isFollow: boolean;
}

// Fetal create appointment
export interface FetalRecordSubmit {
	name: string,
	note: string,
	dateOfPregnancyStart: string,
	expectedDeliveryDate: string,
	actualDeliveryDate: string,
	healthStatus: string,
	status: "PREGNANT" | "BORN" | "MISSED" | "STILLBIRTH" | "ABORTED" | "MISCARRIAGE";
}

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

// Fetal Record model
export interface FetalRecord {
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
	appointments: Appointment[];
	mother: Mother;
}