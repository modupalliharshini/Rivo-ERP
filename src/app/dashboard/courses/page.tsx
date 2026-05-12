'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, CodeSquare, FlaskConical, Calculator, LineChart, ArrowRight, BookOpen, Globe, AlertCircle } from 'lucide-react';

import { RIVO_SUBJECTS } from '../../constants/subjects';

export default function CoursesPage() {
  const [selectedGrade, setSelectedGrade] = useState('Playgroup');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    tag: 'Degree',
    modules: '',
    faculty: ''
  });

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple icon/color assignment logic
    let CourseIcon = BookOpen;
    let ColorClass = styles.iconWrapperBlue;
    
    if (newCourse.title.toLowerCase().includes('science')) {
      CourseIcon = FlaskConical;
      ColorClass = styles.iconWrapperGreen;
    } else if (newCourse.title.toLowerCase().includes('math') || newCourse.title.toLowerCase().includes('calc')) {
      CourseIcon = Calculator;
      ColorClass = styles.iconWrapperRed;
    } else if (newCourse.title.toLowerCase().includes('computer') || newCourse.title.toLowerCase().includes('code')) {
      CourseIcon = CodeSquare;
      ColorClass = styles.iconWrapperBlue;
    } else if (newCourse.title.toLowerCase().includes('history') || newCourse.title.toLowerCase().includes('world')) {
      CourseIcon = Globe;
      ColorClass = styles.iconWrapperGreen;
    }

    const course = {
      id: courses.length + 1,
      title: newCourse.title,
      sub: `${newCourse.modules} Modules | ${newCourse.faculty} Faculty`,
      tag: newCourse.tag,
      icon: CourseIcon,
      colorClass: ColorClass
    };

    setCourses([course, ...courses]);
    setIsModalOpen(false);
    setNewCourse({ title: '', tag: 'Degree', modules: '', faculty: '' });
  };

  return (
    <div className={styles.container}>
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
        {(RIVO_SUBJECTS[selectedGrade as keyof typeof RIVO_SUBJECTS] || []).map((subject, index) => {
          let Icon = BookOpen;
          let colorClass = styles.iconWrapperBlue;
          
          if (subject.toLowerCase().includes('science')) { Icon = FlaskConical; colorClass = styles.iconWrapperGreen; }
          if (subject.toLowerCase().includes('math')) { Icon = Calculator; colorClass = styles.iconWrapperRed; }
          if (subject.toLowerCase().includes('draw') || subject.toLowerCase().includes('color')) { Icon = Globe; colorClass = styles.iconWrapperYellow; }

          return (
            <div key={index} className={`${styles.courseCard} card-shadow`}>
              <div className={styles.iconContainer}>
                <div className={`${styles.iconWrapper} ${colorClass}`}>
                  <Icon size={24} />
                </div>
              </div>
              <h3 className={styles.courseTitle}>{subject}</h3>
              <p className={styles.courseSub}>Core Module | {selectedGrade}</p>
              
              <div className={styles.cardFooter}>
                <span className={styles.pillGray}>Standard</span>
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
