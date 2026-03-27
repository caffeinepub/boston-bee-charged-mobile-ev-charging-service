import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, VehicleType, BatteryCapacity, CustomerInfo } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      customer: CustomerInfo;
      location: string;
      vehicleType: VehicleType;
      batteryCapacity: BatteryCapacity;
      scheduledTime: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createAppointment(
        params.customer,
        params.location,
        params.vehicleType,
        params.batteryCapacity,
        params.scheduledTime
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
    },
  });
}

export function useGetMyAppointments() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['myAppointments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetServicedZipCodes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['servicedZipCodes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServicedZipCodes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPrice(
  vehicleType: VehicleType,
  batteryCapacity: BatteryCapacity,
  enabled: boolean = true
) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['price', vehicleType, batteryCapacity],
    queryFn: async () => {
      if (!actor) return undefined;
      return actor.getPrice(vehicleType, batteryCapacity);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useGetBusinessInfo() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['businessInfo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBusinessInfo();
    },
    enabled: !!actor && !isFetching,
  });
}
