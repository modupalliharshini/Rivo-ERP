'use client';

import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Modal from '../components/Modal';
import styles from './page.module.css';
import { Plus, CodeSquare, FlaskConical, Calculator, LineChart, ArrowRight, BookOpen, Globe } from 'lucide-react';

const INITIAL_COURSES = [
  { id: 1, title: 'Computer Science', sub: '12 Modules | 4 Faculty', tag: 'Degree', icon: CodeSquare, colorClass: styles.iconWrapperBlue },
  { id: 2, title: 'Chemical Sciences', sub: '8 Modules | 2 Faculty', tag: 'Diploma', icon: FlaskConical, colorClass: styles.iconWrapperGreen },
  { id: 3, title: 'Advanced Mathematics', sub: '14 Modules | 6 Faculty', tag: 'K-12', icon: Calculator, colorClass: styles.iconWrapperRed },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      <section className={styles.courseCardsGrid}>
        {courses.map((course) => {
          const Icon = course.icon;
          return (
            <div key={course.id} className={`${styles.courseCard} card-shadow`}>
              <div className={styles.iconContainer}>
                <div className={`${styles.iconWrapper} ${course.colorClass}`}>
                  <Icon size={24} />
                </div>
              </div>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <p className={styles.courseSub}>{course.sub}</p>
              
              <div className={styles.cardFooter}>
                <span className={styles.pillGray}>{course.tag}</span>
                <a href="#" className={styles.manageLink}>
                  Manage <ArrowRight size={16} />
                </a>
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
    </div>
  );
}
