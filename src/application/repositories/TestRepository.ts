// Define interfaces that present the contracts for data access and persistence operations related to the domain eities.
// The purpose of the repository pattern is to abstract away the details of how data is fetched, stored, or manipulated,
// and provide a clean and consistent API for the application to interact with data

import { TimeSleep } from "../../domain/entities/TestEntity";

export interface TestRepository {
  getModeratorAccess(): Promise<any>;
  getAdminAccess(): Promise<any>;
  getUserAccess(): Promise<any>;
  getPublicAccess(): Promise<any>;
  getTimeSleep(params: TimeSleep): Promise<any>;
}
