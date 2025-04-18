'use client';
import { useState, useEffect } from 'react';
import "./Job.css";
import { useRouter } from 'next/navigation';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Link from 'next/link';

const JobDetail = () => {
    const router = useRouter();
    const [jobData, setJobData] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const jobId = localStorage.getItem('jobId');
        if (!jobId) {
            router.push('/pages/profile');
            return;
        }

        const fetchJobData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await fetch(`http://5.83.153.81:25608/jobs/${jobId}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }

                const data = await response.json();
                setJobData(data);
                setApplicants(data.applicants);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobData();
    }, [router]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <>
            <Header />
            <div className="job-detail-container">
                {jobData && (
                    <div className="job-detail">
                        <div className="job-header">
                            <h1>{jobData.title}</h1>
                            <div className="job-meta">
                                <span className="budget">
                                    <span className="label">ბიუჯეტი:</span>
                                    {jobData.min_budget} ₾ - {jobData.max_budget} ₾
                                </span>
                            </div>
                        </div>
                        <div className="job-description">
                            <p>{jobData.description}</p>
                        </div>
                    </div>
                )}

                <section className="applicants-section">
                    <h2>აპლიკანტები</h2>
                    {applicants.length > 0 ? (
                        <ul className="applicants-list">
                            {applicants.map((applicant, index) => (
                                <li key={index} className="applicant-card">
                                    <Link href={`/pages/profile/${applicant.username}`} className="applicant-name">
                                    {applicant.username}
                                    </Link>
                                    <p className="applicant-exp">პროფესია: {applicant.user_job}</p>
                                    <p className="applicant-exp">ჯამში გამომუშავებული: {applicant.user_total_earnings}₾</p>
                                    <p className="applicant-letter">{applicant.cover_letter}</p>
                                    <div className="applicant-contact">
                                        <span className="email-icon">📧</span>
                                        {applicant.email}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-applicants">0 აპლიკანტი.</p>
                    )}
                </section>
            </div>
            <Footer />
        </>
    );
};

export default JobDetail;