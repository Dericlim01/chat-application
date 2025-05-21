'use client';

import { useState } from 'react';
import Field from '@/components/Field';
import Checkbox from '@/components/Checkbox';

const SignUp = ({ setIsSignUp }) => {
    //useState initialization
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        agreeEmail: false,
        conditions: false,
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        //handleChange function
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };


    const handleCheckboxChange = (field) => {
        //handleCheckboxChange function
        setFormData({...formData, [field]: !formData[field]});
    };

    const validateForm = () => {
        //validateForm function
        if (!formData.email) return 'Email is required';
        if (!formData.name) return 'Name is required';
        if (!formData.password) return 'Password is required';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
        if (!formData.conditions) return 'You must agree to the terms and conditions';
        return null;
    };

    const register = async (event) => {
        event.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const response = await fetch('http://localhost:3000/api/SignUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    password: formData.password,
                    passwordConfirm: formData.confirmPassword,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Registration failed');
            }

            setIsSignUp(false);
            // Handle successful registration
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className='mb-1 text-h1'>Sign up</div>
            <div className='mb-12 text-sm text-n-2 dark:text-white/50'>
                Before we start, please enter your details
            </div>
            <form onSubmit={register}>
                {error && <p className='text-red-500 mb-4'>{error}</p>}

                {/* Email Field */}
                <Field
                    className='mb-4'
                    label='Email'
                    name='email'
                    type='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleChange}
                />
                {/* Name Field */}
                <Field
                    className='mb-4'
                    label='Name'
                    name='name'
                    type='text'
                    placeholder='Name'
                    value={formData.name}
                    onChange={handleChange}
                />
                {/* Password Field */}
                <Field
                    className='mb-4'
                    label='Password'
                    name='password'
                    type='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                />
                {/* Confirm Password Field */}
                <Field
                    className='mb-4'
                    label='Confirm password'
                    name='confirmPassword'
                    type='password'
                    placeholder='Confirm password'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                {/* Agree Email Checkbox */}
                <Checkbox
                    label='I agree to receive emails'
                    checked={formData.agreeEmail}
                    onChange={() => handleCheckboxChange('agreeEmail')}
                />
                {/* Conditions Checkbox */}
                <Checkbox
                    label='I agree to the terms and conditions'
                    checked={formData.conditions}
                    onChange={() => handleCheckboxChange('conditions')}
                />

                <button
                    className='btn-purple btn-shadow w-full h-14'
                    type='submit'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating...' : 'Create account'}
                </button>
            </form>
        </div>
    );
};

export default SignUp;
