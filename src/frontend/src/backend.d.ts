import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
}
export interface Appointment {
    id: string;
    status: string;
    vehicleType: VehicleType;
    customer: CustomerInfo;
    owner: Principal;
    scheduledTime: bigint;
    createdTime: bigint;
    location: string;
    batteryCapacity: BatteryCapacity;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum BatteryCapacity {
    large = "large",
    small = "small",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VehicleType {
    SUV = "SUV",
    van = "van",
    truck = "truck",
    sedan = "sedan",
    compact = "compact",
    luxury = "luxury"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAppointment(customer: CustomerInfo, location: string, vehicleType: VehicleType, batteryCapacity: BatteryCapacity, scheduledTime: bigint): Promise<string>;
    getAppointment(id: string): Promise<Appointment | null>;
    getAppointmentsByDateRange(startTime: bigint, endTime: bigint): Promise<Array<Appointment>>;
    getAvailableAppointmentSlots(): Promise<Array<bigint>>;
    getBusinessInfo(): Promise<{
        hours: string;
        name: string;
        email: string;
        address: string;
        phone: string;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyAppointments(): Promise<Array<Appointment>>;
    getPrice(vehicleType: VehicleType, batteryCapacity: BatteryCapacity): Promise<bigint>;
    getServicedZipCodes(): Promise<Array<string>>;
    getSupportedBatteryCapacities(): Promise<Array<string>>;
    getSupportedVehicleTypes(): Promise<Array<string>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isZipCodeServiced(zipCode: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAppointmentStatus(appointmentId: string, newStatus: string): Promise<void>;
    uploadLogo(imageRef: ExternalBlob): Promise<void>;
}
