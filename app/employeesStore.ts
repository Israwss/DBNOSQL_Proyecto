import type { Employee } from './mocks/employees';

let employees: Employee[] = [
  { id: 1, name: 'Israel Martinez', age: 25, joinDate: new Date().toISOString(), role: 'Main Consultant' },
  { id: 2, name: 'Jhosua Alegre', age: 22, joinDate: new Date().toISOString(), role: 'Finantial Analyst' },
  {
    id: 3,
    name: 'Bruno Fonseca',
    age: 19,
    joinDate: new Date().toISOString(),
    role: 'Marketing',
  },
  { id: 4, name: 'Emil Sánchez', age: 30, joinDate: new Date().toISOString(), role: 'Operations' },
  { id: 5, name: 'Melisa Arano', age: 28, joinDate: new Date().toISOString(), role: 'Business Development Director' },
];

export const getEmployeesStore = () => employees;

export const setEmployeesStore = (newEmployees: Employee[]) => {
  employees = newEmployees;
};
