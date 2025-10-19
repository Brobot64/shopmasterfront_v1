import { apiClient } from '../api';
import { ApiResponse, PaginatedResponse } from '../types';
import { LogEntry } from './dashboard.service';

export interface LogFilters {
  level?: 'info' | 'warn' | 'error' | 'debug';
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export class LogsService {
  async getLogs(filters?: LogFilters, pagination?: PaginationParams): Promise<PaginatedResponse<LogEntry>> {
    try {
      const params = {
        ...filters,
        ...pagination
      };
      return await apiClient.get<PaginatedResponse<LogEntry>>('/api/v1/logs', { params });
    } catch (error) {
      console.error('Error fetching logs:', error);
      return { 
        status: 'error', 
        data: { items: [], total: 0, page: 1, limit: 10 }, 
        message: 'Failed to fetch logs' 
      } as PaginatedResponse<LogEntry>;
    }
  }

  async getLogById(id: string): Promise<ApiResponse<LogEntry>> {
    try {
      return await apiClient.get<ApiResponse<LogEntry>>(`/api/v1/logs/${id}`);
    } catch (error) {
      console.error('Error fetching log by ID:', error);
      return { status: 'error', message: 'Failed to fetch log' } as ApiResponse<LogEntry>;
    }
  }

  async createLog(logData: Omit<LogEntry, 'id' | 'timestamp'>): Promise<ApiResponse<LogEntry>> {
    try {
      return await apiClient.post<ApiResponse<LogEntry>>('/api/v1/logs', logData);
    } catch (error) {
      console.error('Error creating log:', error);
      return { status: 'error', message: 'Failed to create log' } as ApiResponse<LogEntry>;
    }
  }

  async getLogsByUser(userId: string, filters?: Omit<LogFilters, 'userId'>, pagination?: PaginationParams): Promise<PaginatedResponse<LogEntry>> {
    try {
      const params = {
        ...filters,
        ...pagination,
        userId
      };
      return await apiClient.get<PaginatedResponse<LogEntry>>('/api/v1/logs', { params });
    } catch (error) {
      console.error('Error fetching logs by user:', error);
      return { 
        status: 'error', 
        data: { items: [], total: 0, page: 1, limit: 10 }, 
        message: 'Failed to fetch logs' 
      } as PaginatedResponse<LogEntry>;
    }
  }

  async getLogsByDateRange(startDate: string, endDate: string, filters?: Omit<LogFilters, 'startDate' | 'endDate'>, pagination?: PaginationParams): Promise<PaginatedResponse<LogEntry>> {
    try {
      const params = {
        startDate,
        endDate,
        ...filters,
        ...pagination
      };
      return await apiClient.get<PaginatedResponse<LogEntry>>('/api/v1/logs', { params });
    } catch (error) {
      console.error('Error fetching logs by date range:', error);
      return { 
        status: 'error', 
        data: { items: [], total: 0, page: 1, limit: 10 }, 
        message: 'Failed to fetch logs' 
      } as PaginatedResponse<LogEntry>;
    }
  }

  async getLogsByLevel(level: 'info' | 'warn' | 'error' | 'debug', filters?: Omit<LogFilters, 'level'>, pagination?: PaginationParams): Promise<PaginatedResponse<LogEntry>> {
    try {
      const params = {
        ...filters,
        ...pagination,
        level
      };
      return await apiClient.get<PaginatedResponse<LogEntry>>('/api/v1/logs', { params });
    } catch (error) {
      console.error('Error fetching logs by level:', error);
      return { 
        status: 'error', 
        data: { items: [], total: 0, page: 1, limit: 10 }, 
        message: 'Failed to fetch logs' 
      } as PaginatedResponse<LogEntry>;
    }
  }

  async searchLogs(query: string, filters?: Omit<LogFilters, 'search'>, pagination?: PaginationParams): Promise<PaginatedResponse<LogEntry>> {
    try {
      const params = {
        ...filters,
        ...pagination,
        search: query
      };
      return await apiClient.get<PaginatedResponse<LogEntry>>('/api/v1/logs', { params });
    } catch (error) {
      console.error('Error searching logs:', error);
      return { 
        status: 'error', 
        data: { items: [], total: 0, page: 1, limit: 10 }, 
        message: 'Failed to search logs' 
      } as PaginatedResponse<LogEntry>;
    }
  }

  async getRecentLogs(limit: number = 50): Promise<ApiResponse<LogEntry[]>> {
    try {
      const response = await this.getLogs({}, { page: 1, limit });
      return {
        status: response.status,
        data: response.data?.items || [],
        message: response.message
      };
    } catch (error) {
      console.error('Error fetching recent logs:', error);
      return { status: 'error', data: [], message: 'Failed to fetch recent logs' } as ApiResponse<LogEntry[]>;
    }
  }

  async getErrorLogs(filters?: Omit<LogFilters, 'level'>, pagination?: PaginationParams): Promise<PaginatedResponse<LogEntry>> {
    return this.getLogsByLevel('error', filters, pagination);
  }

  async getWarningLogs(filters?: Omit<LogFilters, 'level'>, pagination?: PaginationParams): Promise<PaginatedResponse<LogEntry>> {
    return this.getLogsByLevel('warn', filters, pagination);
  }

  async getInfoLogs(filters?: Omit<LogFilters, 'level'>, pagination?: PaginationParams): Promise<PaginatedResponse<LogEntry>> {
    return this.getLogsByLevel('info', filters, pagination);
  }

  async getDebugLogs(filters?: Omit<LogFilters, 'level'>, pagination?: PaginationParams): Promise<PaginatedResponse<LogEntry>> {
    return this.getLogsByLevel('debug', filters, pagination);
  }

  // Legacy method for backward compatibility
  async getLogsLegacy(): Promise<ApiResponse<{ logs: LogEntry[] }>> {
    try {
      const response = await this.getLogs();
      return {
        status: response.status,
        data: { logs: response.data?.items || [] },
        message: response.message
      };
    } catch (error) {
      console.error('Error fetching logs (legacy):', error);
      return { status: 'error', data: { logs: [] }, message: 'Failed to fetch logs' } as ApiResponse<{ logs: LogEntry[] }>;
    }
  }
}

export const logsService = new LogsService();
export default logsService;