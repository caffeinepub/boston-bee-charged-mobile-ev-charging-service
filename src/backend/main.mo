import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";



actor {
  // Image Storage
  include MixinStorage();

  // Authorization extension
  let accessControlState = AccessControl.initState();

  // Data Types
  type VehicleType = {
    #sedan;
    #SUV;
    #truck;
    #compact;
    #luxury;
    #van;
  };

  type BatteryCapacity = {
    #small; // < 40 kWh
    #medium; // 40-60 kWh
    #large; // > 60 kWh
  };

  type CustomerInfo = {
    name : Text;
    phone : Text;
    email : Text;
  };

  type Appointment = {
    id : Text;
    customer : CustomerInfo;
    location : Text;
    vehicleType : VehicleType;
    batteryCapacity : BatteryCapacity;
    scheduledTime : Int;
    createdTime : Int;
    status : Text;
    owner : Principal;
  };

  public type UserProfile = {
    name : Text;
    phone : Text;
    email : Text;
  };

  // State Variables
  let appointments = Map.empty<Text, Appointment>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let servicedZipCodes = List.fromArray(["02101", "02102", "02103", "02104", "02105"]);
  var nextId = 1;

  // Initialization
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  // Role Management
  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Appointment Management
  public shared ({ caller }) func createAppointment(
    customer : CustomerInfo,
    location : Text,
    vehicleType : VehicleType,
    batteryCapacity : BatteryCapacity,
    scheduledTime : Int,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create appointments");
    };

    let now = Time.now();

    let appointment : Appointment = {
      id = nextId.toText();
      customer;
      location;
      vehicleType;
      batteryCapacity;
      scheduledTime;
      createdTime = now;
      status = "pending";
      owner = caller;
    };

    appointments.add(appointment.id, appointment);
    nextId += 1;
    appointment.id;
  };

  public query ({ caller }) func getAppointmentsByDateRange(startTime : Int, endTime : Int) : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all appointments");
    };
    appointments.values().toArray();
  };

  public shared ({ caller }) func updateAppointmentStatus(appointmentId : Text, newStatus : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update appointment status");
    };
    switch (appointments.get(appointmentId)) {
      case (null) { Runtime.trap("Appointment not found") };
      case (?appointment) {
        let updatedAppointment = { appointment with status = newStatus };
        appointments.add(appointmentId, updatedAppointment);
      };
    };
  };

  public query ({ caller }) func getAppointment(id : Text) : async ?Appointment {
    switch (appointments.get(id)) {
      case (null) { null };
      case (?appointment) {
        // Allow owner to view their own appointment or admin to view any
        if (caller == appointment.owner or AccessControl.isAdmin(accessControlState, caller)) {
          ?appointment;
        } else {
          Runtime.trap("Unauthorized: Can only view your own appointments");
        };
      };
    };
  };

  public query ({ caller }) func getMyAppointments() : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view appointments");
    };

    let userAppointments = appointments.values().filter(func(apt : Appointment) : Bool {
      apt.owner == caller;
    });
    userAppointments.toArray();
  };

  // Coverage Area Management
  public query ({ caller }) func getServicedZipCodes() : async [Text] {
    servicedZipCodes.toArray();
  };

  public query ({ caller }) func isZipCodeServiced(zipCode : Text) : async Bool {
    let iterator = servicedZipCodes.values();
    iterator.any(func(current) { current == zipCode });
  };

  // Pricing Info
  public query ({ caller }) func getPrice(vehicleType : VehicleType, batteryCapacity : BatteryCapacity) : async Nat {
    switch (vehicleType, batteryCapacity) {
      case (#sedan, #small) { 2999 }; // $29.99
      case (#sedan, #medium) { 3999 }; // $39.99
      case (#SUV, #medium) { 4999 }; // $49.99
      case (#SUV, #large) { 5999 }; // $59.99
      case (#truck, #large) { 6999 }; // $69.99
      case (_) { 3999 };
    };
  };

  public query ({ caller }) func getAvailableAppointmentSlots() : async [Int] {
    // Placeholder: should return available time slots in future
    [];
  };

  // Logo Storage
  public shared ({ caller }) func uploadLogo(imageRef : Storage.ExternalBlob) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can upload logos");
    };
    ignore imageRef;
    // Image saved via prefabricated storage component
  };

  public query ({ caller }) func getSupportedVehicleTypes() : async [Text] {
    ["Sedan", "SUV", "Truck", "Compact", "Luxury", "Van"];
  };

  public query ({ caller }) func getSupportedBatteryCapacities() : async [Text] {
    ["Small", "Medium", "Large"];
  };

  public query ({ caller }) func getBusinessInfo() : async {
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    hours : Text;
  } {
    {
      name = "Boston Bee Charged";
      phone = "888-675-9555";
      email = "bostonbeecharged@gmail.com";
      address = "Boston, MA";
      hours = "Mon-Fri 8am-8pm";
    };
  };
};
