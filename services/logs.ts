import { api } from './api';

export interface LogEntry {
  id: string;
  action: string;
  performerId: string;
  receiverType?: string;
  receiverId?: string;
  description: string;
  businessId: string;
  outletId?: string;
  timestamp: string;
  performer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userType: string;
  };
}

export interface LogsResponse {
  status: string;
  data: {
    logs: LogEntry[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export const logsService = {
  async getLogs(params?: {
    page?: number;
    limit?: number;
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    performerId?: string;
  }): Promise<LogsResponse> {
    const response = await api.get('/logs', { params });
    return response.data;
  }
};