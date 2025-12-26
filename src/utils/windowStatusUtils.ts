import {
  validStatusTransitions,
  WindowStatusType,
} from "../common/constants.js";
import { getApiError } from "../common/HttpResponse.js";

// Helper function to validate status transitions
export const isValidStatusTransition = (
  currentStatus: WindowStatusType,
  newStatus: WindowStatusType
): boolean => {
  return (
    validStatusTransitions[currentStatus] as readonly WindowStatusType[]
  ).includes(newStatus);
};

// Get all possible next statuses for a given current status
export const getPossibleNextStatuses = (
  currentStatus: WindowStatusType
): readonly WindowStatusType[] => {
  return validStatusTransitions[currentStatus] as readonly WindowStatusType[];
};

// Validate if a status transition is allowed and throw error if not
export const validateStatusTransition = (
  currentStatus: WindowStatusType,
  newStatus: WindowStatusType
): void => {
  if (!isValidStatusTransition(currentStatus, newStatus)) {
    throw getApiError("INVALID_STATUS_TRANSITION");
  }
};

// Check if a status is terminal (no further transitions allowed)
export const isTerminalStatus = (status: WindowStatusType): boolean => {
  return getPossibleNextStatuses(status).length === 0;
};
