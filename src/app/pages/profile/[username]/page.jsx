'use client';
import { useState, useEffect } from 'react';
import "./username.css";
import { useRouter, usePathname } from 'next/navigation';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';

const Profile = () => {
    const pathname = usePathname();
    const router = useRouter();

    const encodedUsername = pathname?.split('/').pop();
    const username = encodedUsername ? decodeURIComponent(encodedUsername) : null;

    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [education, setEducation] = useState([]);
    const [experience, setExperience] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);

        if (!username) {
            if (user?.username) {
                router.push(`/pages/profile/${encodeURIComponent(user.username)}`);
            }
            return;
        }

        const isOwner = user?.username === username;
        setIsOwnProfile(isOwner);

        const fetchProfileData = async () => {
            try {
                const response = await fetch(`http://5.83.153.81:25608/profile/${encodeURIComponent(username)}`, {
                    headers: user?.token ? {
                        'Authorization': `Bearer ${user.token}`
                    } : {}
                });

                if (!response.ok) {
                    throw new Error('პროფილის მონაცემების მიღება ვერ მოხერხდა');
                }

                const data = await response.json();
                setUserData(data);
                setEducation(data.education || []);
                setExperience(data.experience || []);

                if (isOwner) {
                    setFormData({
                        name: data.username || '',
                        job: data.job || '',
                        phone: data.phone || '',
                        address: data.address || '',
                        cover_letter: data.cover_letter || '',
                        education: data.education || [],
                        experience: data.experience || []
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [username, router]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://5.83.153.81:25608/profile/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    ...formData,
                    education: education,
                    experience: experience
                })
            });

            if (!response.ok) {
                throw new Error('პროფილის განახლება ვერ მოხერხდა');
            }

            const data = await response.json();
            setUserData(prevData => ({
                ...prevData,
                username: formData.name,
                job: formData.job,
                phone: formData.phone,
                address: formData.address,
                cover_letter: formData.cover_letter,
                education: education,
                experience: experience
            }));
            setIsEditing(false);
        } catch (err) {
            console.log(err.message)
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...education];
        newEducation[index] = {
            ...newEducation[index],
            [field]: value
        };
        setEducation(newEducation);
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...experience];
        newExperience[index] = {
            ...newExperience[index],
            [field]: value
        };
        setExperience(newExperience);
    };

    const addEducation = () => {
        setEducation([...education, {
            degree: '',
            field: '',
            start_date: '',
            end_date: '',
            school_name: ''
        }]);
    };

    const addExperience = () => {
        setExperience([...experience, {
            position: '',
            company_name: '',
            start_date: '',
            end_date: ''
        }]);
    };

    const handleDeleteEducation = async (educationId) => {
        if (!window.confirm('ნამდვილად გსურთ განათლების ჩანაწერის წაშლა?')) {
            return;
        }
    
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://5.83.153.81:25608/profile/${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    type: 'education',
                    id: educationId
                })
            });
    
            if (!response.ok) {
                throw new Error('განათლების ჩანაწერის წაშლა ვერ მოხერხდა');
            }
    
            setEducation(prevEducation => 
                prevEducation.filter(edu => edu.id !== educationId)
            );
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleDeleteExperience = async (experienceId) => {
        if (!window.confirm('ნამდვილად გსურთ გამოცდილების ჩანაწერის წაშლა?')) {
            return;
        }
    
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch(`http://5.83.153.81:25608/profile/${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    type: 'experience',
                    id: experienceId
                })
            });
    
            if (!response.ok) {
                throw new Error('გამოცდილების ჩანაწერის წაშლა ვერ მოხერხდა');
            }
    
            setExperience(prevExperience => 
                prevExperience.filter(exp => exp.id !== experienceId)
            );
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    if (loading) return <div>მიმდინარეობს ჩამოტვირთვა...</div>;
    if (error) return <div>შეცდომა: {error}</div>;
    if (!userData) return <div>პროფილი ვერ მოიძებნა</div>;


    const handleViewDetails = (jobId) => {
        // Save the job ID in localStorage
        localStorage.setItem('jobId', jobId);
        // Navigate to the job detail page
        router.push(`/pages/JobDetail`);
    };

    const profileImage = userData.profileImage
        ? userData.profileImage
        : `https://ui-avatars.com/api/?name=${userData.username[0]}`;

    return (
        <>
            <Header />
            <div className="profile-bg">
                <main className="profile-container">
                    <div className="sidebar">
                        <div className="profile-image">
                            <img src={profileImage} alt="პროფილი" />
                            <span className="status-badge">{userData.job || 'ხელმისაწვდომი სამუშაოდ'}</span>
                        </div>
                        <div className="role-badge">
                            <span>{userData.role}</span>
                        </div>
                        <div className="message">
                        {!isOwnProfile && (
                        <button
                            className="message-button"
                            onClick={() => router.push(`/pages/Chat/${userData.user_id}`)}
                        >
                            მიწერა
                        </button>
                    )}
                        </div>
                        <div className="profile-stats">
                            <div className="stat">
                                <span className="number">{userData.recoins}</span>
                                <span className="label">ReCoins</span>
                            </div>
                            <div className="stat">
                                <span className="number">₾{userData.totalEarnings}</span>
                                <span className="label">სრული შემოსავალი</span>
                            </div>
                        </div>
                        <div className="contact-info">
                            <h3>კონტაქტი</h3>
                            {!isEditing ? (
                                <>
                                    <div className="info-item">
                                        <i>📧</i>
                                        <span>{userData.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <i>📍</i>
                                        <span>{userData.address || 'მისამართი არ არის მითითებული'}</span>
                                    </div>
                                    <div className="info-item">
                                        <i>📱</i>
                                        <span>{userData.phone || 'ტელეფონი არ არის მითითებული'}</span>
                                    </div>
                                    <div className="info-item">
                                        <i>💼</i>
                                        <span>{userData.job || 'არ არის მითითებული'}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="info-item">
                                        <i>📧</i>
                                        <span>{userData.email}</span>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="მისამართი"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="ტელეფონი"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="job"
                                            value={formData.job}
                                            onChange={handleChange}
                                            placeholder="სამუშაო"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="main-content">
                        {!isEditing ? (
                            <>
                                <div className="profile-header">
                                    <h1>{userData.username}</h1>
                                    <span className="verified">
                                        {userData.is_confirmed ? '✓ ვერიფიცირებული პროფესიონალი' : 'არ არის ვერიფიცირებული'}
                                    </span>
                                </div>

                                <section className="about-section">
                                    <h2>პროფესიული შეჯამება</h2>
                                    <p>{userData.cover_letter || 'შეჯამება არ არის მითითებული.'}</p>
                                </section>

                                <section className="resume-section">
                                    <h2>რეზიუმე</h2>
                                    <div className="upload-area">
                                        <input
                                            type="file"
                                            id="resume"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="resume">
                                            {selectedFile ? selectedFile.name : userData.resume_file || 'რეზიუმე არ არის ატვირთული'}
                                        </label>
                                    </div>
                                </section>
                                <section className="education-section">
                                    <h2>განათლება</h2>
                                    {education.map((edu, index) => (
                                        <div key={index} className="education-item">
                                            <h3>{edu.degree} - {edu.field}</h3>
                                            <p>{edu.school_name}</p>
                                            <p>{edu.start_date} - {edu.end_date}</p>
                                        </div>
                                    ))}
                                </section>
                                <section className="experience-section">
                                    <h2>გამოცდილება</h2>
                                    {experience.map((exp, index) => (
                                        <div key={index} className="experience-item">
                                            <h3>{exp.position}</h3>
                                            <p>{exp.company_name}</p>
                                            <p>{exp.start_date} - {exp.end_date}</p>
                                        </div>
                                    ))}
                                </section>
                            </>
                        ) : (
                            <form onSubmit={handleUpdate}>
                                <div className="form-group">
                                    <label>სახელი</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>პროფესიული შეჯამება</label>
                                    <textarea
                                        name="cover_letter"
                                        value={formData.cover_letter}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>

                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'მიმდინარეობს...' : 'შენახვა'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setIsEditing(false)}
                                >
                                    გაუქმება
                                </button>
                                <section className="education-section">
                                    <h2>განათლება</h2>
                                    {education.map((edu, index) => (
                                        <div key={index} className="education-form">
                                            <input
                                                type="text"
                                                value={edu.degree}
                                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                                placeholder="ხარისხი"
                                            />
                                            <input
                                                type="text"
                                                value={edu.field}
                                                onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                                                placeholder="სფერო"
                                            />
                                            <input
                                                type="text"
                                                value={edu.school_name}
                                                onChange={(e) => handleEducationChange(index, 'school_name', e.target.value)}
                                                placeholder="სასწავლებლის სახელი"
                                            />
                                            <input
                                                type="date"
                                                value={edu.start_date}
                                                onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                                            />
                                            <input
                                                type="date"
                                                value={edu.end_date}
                                                onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                                            />
                                            <button type="button" onClick={() => handleDeleteEducation(edu.id)}>
                                                წაშლა
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addEducation}>
                                        განათლების დამატება
                                    </button>
                                </section>

                                <section className="experience-section">
                                    <h2>გამოცდილება</h2>
                                    {experience.map((exp, index) => (
                                        <div key={index} className="experience-form">
                                            <input
                                                type="text"
                                                value={exp.position}
                                                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                                placeholder="პოზიცია"
                                            />
                                            <input
                                                type="text"
                                                value={exp.company_name}
                                                onChange={(e) => handleExperienceChange(index, 'company_name', e.target.value)}
                                                placeholder="კომპანიის სახელი"
                                            />
                                            <input
                                                type="date"
                                                value={exp.start_date}
                                                onChange={(e) => handleExperienceChange(index, 'start_date', e.target.value)}
                                            />
                                            <input
                                                type="date"
                                                value={exp.end_date}
                                                onChange={(e) => handleExperienceChange(index, 'end_date', e.target.value)}
                                            />
                                            <button type="button" onClick={() => handleDeleteExperience(exp.id)}>
                                                წაშლა
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addExperience}>
                                        გამოცდილების დამატება
                                    </button>
                                </section>

                                <div className="form-buttons">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'მიმდინარეობს...' : 'შენახვა'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        გაუქმება
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="action-buttons">
                            {isOwnProfile && !isEditing && (
                                <>
                                    <button
                                        className="btn-primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        პროფილის განახლება
                                    </button>
                                    <button className="btn-secondary">პროფილის წაშლა</button>
                                </>
                            )}
                        </div>
                    </div>
                    
                </main>
                <section className="jobs-section">
                <h2>გამოქვეყნებული სამუშაოები</h2>
                <div className="jobs-grid">
                    {userData.jobs?.map((job, index) => (
                        <article key={index} className="job-card">
                            <div className="job-header">
                                <h3 title={job.title}>
                                    {job.title.length > 50 ? `${job.title.substring(0, 50)}...` : job.title}
                                </h3>
                            </div>

                            <div className="job-details">
                                <div className="detail-item">
                                    <span className="icon">💰</span>
                                    <span className="value">{job.min_budget} ₾ - {job.max_budget} ₾</span>
                                </div>
                            </div>

                            <p className="job-description" title={job.description}>
                                {job.description.length > 100 ?
                                    `${job.description.substring(0, 100)}...` :
                                    job.description}
                            </p>

                            <div className="job-footer">
                                <span className="date">{job.created_at}</span>
                                <button className="view-details" onClick={() => handleViewDetails(job.id)}>
                                    დეტალურად
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
            </div>
            <Footer />
        </>
    );
};

export default Profile;