import List "mo:core/List";
import Map "mo:core/Map";

module {
  type OldActor = { /* No persistent state in original actor */ };
  type NewActor = {
    appointments : Map.Map<Text, {
      id : Text;
      customer : {
        name : Text;
        phone : Text;
        email : Text;
      };
      location : Text;
      vehicleType : {
        #sedan;
        #SUV;
        #truck;
        #compact;
        #luxury;
        #van;
      };
      batteryCapacity : {
        #small;
        #medium;
        #large;
      };
      scheduledTime : Int;
      createdTime : Int;
      status : Text;
      owner : Principal;
    }>;
    userProfiles : Map.Map<Principal, {
      name : Text;
      phone : Text;
      email : Text;
    }>;
    servicedZipCodes : List.List<Text>;
    nextId : Nat;
  };

  // Migration function that initializes all new persistent variables with default values.
  public func run(_ : OldActor) : NewActor {
    {
      appointments = Map.empty<Text, {
        id : Text;
        customer : {
          name : Text;
          phone : Text;
          email : Text;
        };
        location : Text;
        vehicleType : {
          #sedan;
          #SUV;
          #truck;
          #compact;
          #luxury;
          #van;
        };
        batteryCapacity : {
          #small;
          #medium;
          #large;
        };
        scheduledTime : Int;
        createdTime : Int;
        status : Text;
        owner : Principal;
      }>();
      userProfiles = Map.empty<Principal, {
        name : Text;
        phone : Text;
        email : Text;
      }>();
      servicedZipCodes = List.fromArray(["02101", "02102", "02103", "02104", "02105"]);
      nextId = 1;
    };
  };
};
