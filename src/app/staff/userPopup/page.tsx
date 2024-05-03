"use client"
import React, { useState } from 'react';
import styles from './popup.module.css'; // Your styles import

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: EmployeeForm) => void;
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

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EmployeeForm>({
    name: '',
    salary: '',
    shiftStart: '',
    shiftEnd: '',
    manager: false,
    username: '',
    password: '',
    email: ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return isOpen ? (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>&times;</span>
        <form onSubmit={handleSubmit}>
          {/* Form fields here */}
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" />
          <input type="time" name="shiftStart" value={formData.shiftStart} onChange={handleChange} placeholder="Shift Start" />
          <input type="time" name="shiftEnd" value={formData.shiftEnd} onChange={handleChange} placeholder="Shift End" />
          <label>
            <input type="checkbox" name="manager" checked={formData.manager} onChange={handleChange} /> Manager
          </label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <button type="submit">Add Employee</button>
        </form>
      </div>
    </div>
  ) : null;
};

export default Modal;
