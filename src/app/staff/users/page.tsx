"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './users.module.css'; // Import the styles
import { fetchAllEmployees, addEmployee, removeEmployee } from '@/app/user';
import Modal from '../userPopup/page'; // Import the Modal component
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('../../../components/sidebar/Sidebar'), {
  ssr: false,
});

interface Employee {
  id: number;
  name: string;
  salary: number;
  shift_start: string;
  shift_end: string;
  manager: boolean;
  username: string;
  email: string;
}

interface EmployeeForm {
  name: string;
  salary: string;
  shiftStart: string;
  shiftEnd: string;
  manager: boolean;
  username: string;
  password: string;
  email: string;
}

const UsersPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const allEmployees = await fetchAllEmployees();
      setEmployees(allEmployees);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await removeEmployee(id);
      if (result.success) {
        loadEmployees(); // Reload the list after deletion
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to delete employee');
    }
  };

  const handleAddEmployee = async (employeeData: EmployeeForm) => {
    try {
      const formattedData = {
        ...employeeData,
        salary: parseFloat(employeeData.salary) // Correctly converting string to float
      };
  
      console.log("Adding new employee with formatted data:", formattedData);
  
      await addEmployee(
        formattedData.name,
        formattedData.salary,
        formattedData.shiftStart,
        formattedData.shiftEnd,
        formattedData.manager,
        formattedData.username,
        formattedData.password,
        formattedData.email
      );
      loadEmployees(); // Reload the list after adding a new employee
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Failed to add new employee:', error);
      alert('Failed to add new employee');
    }
  };

  
  return (
    <div className={styles.pageContainer}> 
        <Sidebar />
        <div className={styles.main}>  
            <h1 className={styles.title}>User Management</h1> 
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Salary</th>
                        <th>Shift Start</th>
                        <th>Shift End</th>
                        <th>Manager</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.salary}</td>
                            <td>{employee.shift_start}</td>
                            <td>{employee.shift_end}</td>
                            <td>{employee.manager ? 'Yes' : 'No'}</td>
                            <td>{employee.username}</td>
                            <td>{employee.email}</td>
                            <td><button onClick={() => handleDelete(employee.id)} className={styles.button}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>Add New Employee</button>
        </div>
    
        {/* Navigation Buttons */}
        <div className={styles.buttonsContainer}> 
            <Link href="/staff/order" legacyBehavior>
                <a className={styles.navButton}>Staff Order</a>
            </Link>
            <Link href="/staff/stats" legacyBehavior>
                <a className={styles.navButton}>Staff Stats</a>
            </Link>
            <Link href="/staff/inventory" legacyBehavior>
                <a className={styles.navButton}>Staff Inventory</a>
            </Link>
            <Link href="/staff/users" legacyBehavior>
                <a className={styles.navButton}>Users</a> 
            </Link>
        </div>
    
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddEmployee} />
    </div>
  );
}

export default UsersPage;
