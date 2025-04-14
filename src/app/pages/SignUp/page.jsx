'use client'
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer'
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('პაროლები არ ემთხვევა');
      return;
    }

    const data = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    try {
      const response = await fetch('http://5.83.153.81:25608/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('მომხმარებელი წარმატებით დარეგისტრირდა');
      } else {
        alert(result.message || 'რეგისტრაცია ვერ მოხერხდა');
      }
    } catch (error) {
      alert('დაფიქსირდა შეცდომა. გთხოვთ, სცადოთ მოგვიანებით');
    }
  };

  const fields = [
    { label: 'სახელი', name: 'username' },
    { label: 'ელფოსტა', name: 'email' },
    { label: 'პაროლი', name: 'password' },
    { label: 'გაიმეორე პაროლი', name: 'confirmPassword' }
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f6f6 0%, #ffffff 100%)',
      padding: '20px'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '2rem',
          fontWeight: '700',
          color: '#000',
          letterSpacing: '-0.025em'
        }}>
          რეგისტრაცია
        </h1>

        {fields.map(({ label, name }) => (
          <div key={name} style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#000'
            }}>
              {label}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={name.includes('password') ? (showPassword[name] ? 'text' : 'password') : name === 'email' ? 'email' : 'text'}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e5e5',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa'
                }}
              />
              {name.includes('password') && (
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({
                    ...prev,
                    [name]: !prev[name]
                  }))}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    color: '#666'
                  }}
                >
                  {showPassword[name] ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
          </div>
        ))}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#000'
          }}>
            როლი
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              border: '2px solid #e5e5e5',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}
          >
            <option value="freelancer">ფრილანსერი</option>
            <option value="employer">დამსაქმებელი</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.875rem',
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.025em'
          }}
        >
          რეგისტრაცია
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          უკვე გაქვთ ანგარიში?{' '}
          <Link
            href="./SignIn"
            style={{
              color: '#000',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            შესვლა
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
