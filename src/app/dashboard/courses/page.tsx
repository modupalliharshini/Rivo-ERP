'use client';
import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../../components/PageHeader';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, CodeSquare, FlaskConical, Calculator, LineChart, ArrowRight, BookOpen, Globe, AlertCircle, Upload, CheckCircle } from 'lucide-react';
import { createClient } from '../../../utils/supabase/client';

import { RIVO_SUBJECTS } from '../../constants/subjects';

export default function CoursesPage() {
  const supabase = createClient();
  const [selectedGrade, setSelectedGrade] = useState('Playgroup');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);

  const [newCourse, setNewCourse] = useState({
    title: '',
    tag: 'Degree',
    modules: '',
    faculty: ''
  });

  useEffect(() => {
    fetchCourses();
  }, [selectedGrade]);

  const fetchCourses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('grade', selectedGrade)
      .order('title', { ascending: true });

    if (data) {
      setCourses(data);
    }
    setIsLoading(false);
  };

  const triggerUpload = (courseId: string) => {
    setCurrentCourseId(courseId);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentCourseId) return;

    setUploadingId(currentCourseId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentCourseId}-${Math.random()}.${fileExt}`;
      const filePath = `syllabuses/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('syllabuses')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('syllabuses')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('courses')
        .update({ syllabus_url: publicUrl })
        .eq('id', currentCourseId);

      if (updateError) throw updateError;

      fetchCourses();
    } catch (error) {
      console.error('Error uploading syllabus:', error);
      alert('Failed to upload syllabus. Please try again.');
    } finally {
      setUploadingId(null);
      setCurrentCourseId(null);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase.from('profiles').select('institution_id').eq('id', user.id).single();
    if (!profile) return;

    const { data, error } = await supabase
      .from('courses')
      .insert({
        institution_id: profile.institution_id,
        title: newCourse.title,
        grade: selectedGrade,
        module_count: parseInt(newCourse.modules) || 0,
        faculty_count: parseInt(newCourse.faculty) || 0
      })
      .select()
      .single();

    if (data) {
      setCourses([data, ...courses]);
      setIsModalOpen(false);
      setNewCourse({ title: '', tag: 'Degree', modules: '', faculty: '' });
    }
  };

  return (
    <div className={styles.container}>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx"
      />
      <PageHeader
        titleStart="Course"
        titleHighlight="Catalog"
        actionElement={
          <button className="btn-info" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Course
          </button>
        }
      />

      <div className={styles.filterSection}>
        {Object.keys(RIVO_SUBJECTS).map(grade => (
          <button 
            key={grade} 
            className={`${styles.filterBtn} ${selectedGrade === grade ? styles.active : ''}`}
            onClick={() => setSelectedGrade(grade)}
          >
            {grade}
          </button>
        ))}
      </div>

      <section className={styles.courseCardsGrid}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        ) : courses.map((course) => {
          let Icon = BookOpen;
          let colorClass = styles.iconWrapperBlue;
          const subject = course.title;
          
          if (subject.toLowerCase().includes('science')) { Icon = FlaskConical; colorClass = styles.iconWrapperGreen; }
          if (subject.toLowerCase().includes('math')) { Icon = Calculator; colorClass = styles.iconWrapperRed; }
          if (subject.toLowerCase().includes('draw') || subject.toLowerCase().includes('color')) { Icon = Globe; colorClass = styles.iconWrapperYellow; }

          return (
            <div key={course.id} className={`${styles.courseCard} card-shadow`}>
              <div className={styles.headerRow}>
                <div className={styles.iconContainer}>
                  <div className={`${styles.iconWrapper} ${colorClass}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <span className={styles.codeBadge}>{course.course_code}</span>
              </div>
              <h3 className={styles.courseTitle}>{subject}</h3>
              <p className={styles.courseSub}>Core Module | {course.grade}</p>
              
              <div className={styles.cardFooter}>
                <button 
                  className={`${styles.pillGray} ${course.syllabus_url ? styles.pillSuccess : ''}`}
                  onClick={() => triggerUpload(course.id)}
                  disabled={uploadingId === course.id}
                >
                  {uploadingId === course.id ? (
                    'Uploading...'
                  ) : course.syllabus_url ? (
                    <><CheckCircle size={14} /> Syllabus Uploaded</>
                  ) : (
                    <><Upload size={14} /> Upload Syllabus</>
                  )}
                </button>
                <button 
                  className={styles.manageBtn} 
                  onClick={() => setIsComingSoonOpen(true)}
                >
                  Manage <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <section className={styles.graphSection}>
        <h2 className={styles.sectionTitle}>Course Enrollment Trends</h2>
        <div className={styles.graphPlaceholder}>
          <LineChart size={20} /> Enrollment Analytics Graph Placeholder
        </div>
      </section>

      {/* Add Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Course"
      >
        <form className="erp-form" onSubmit={handleAddCourse}>
          <div className="erp-form-group">
            <label>Course Title</label>
            <input
              className="erp-input"
              type="text"
              placeholder="e.g. Data Science"
              required
              value={newCourse.title}
              onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
            />
          </div>

          <div className="erp-form-row">
            <div className="erp-form-group">
              <label>Academic Level / Tag</label>
              <select
                className="erp-select"
                value={newCourse.tag}
                onChange={(e) => setNewCourse({...newCourse, tag: e.target.value})}
              >
                <option value="Degree">Degree</option>
                <option value="Diploma">Diploma</option>
                <option value="K-12">K-12</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>
            <div className="erp-form-group">
              <label>Module Count</label>
              <input
                className="erp-input"
                type="number"
                placeholder="e.g. 10"
                required
                value={newCourse.modules}
                onChange={(e) => setNewCourse({...newCourse, modules: e.target.value})}
              />
            </div>
          </div>

          <div className="erp-form-group">
            <label>Faculty assigned</label>
            <input
              className="erp-input"
              type="number"
              placeholder="e.g. 3"
              required
              value={newCourse.faculty}
              onChange={(e) => setNewCourse({...newCourse, faculty: e.target.value})}
            />
          </div>

          <div className="erp-form-actions">
            <button type="button" className="erp-btn-cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="erp-btn-submit">
              Register Course
            </button>
          </div>
        </form>
      </Modal>

      {/* Feature Not Available Modal */}
      <Modal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
        title="System Notice"
      >
        <div className={styles.comingSoonContent}>
          <div className={styles.comingSoonIcon}>
            <AlertCircle size={48} color="#f59e0b" />
          </div>
          <h3>Feature Not Available</h3>
          <p>The Course Management module is currently under maintenance. Detailed editing and analytics for individual subjects will be enabled in the next update.</p>
          <div className={styles.modalFooter}>
            <button className="erp-btn-submit" onClick={() => setIsComingSoonOpen(false)}>
              Understood
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
