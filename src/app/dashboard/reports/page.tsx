import React from 'react';
import PageHeader from '../../components/PageHeader';
import styles from './page.module.css';
import { FileText, Download, Table, File } from 'lucide-react';

const MOCK_REPORTS = [
  { id: 1, name: 'Academic Performance Report Q3', sub: 'Generated on Oct 20, 2026', type: 'PDF', icon: FileText, colorClass: styles.bgRed, btnClass: styles.btnPdf },
  { id: 2, name: 'Financial Summary Annual 2026', sub: 'Generated on Oct 15, 2026', type: 'CSV', icon: Table, colorClass: styles.bgGreen, btnClass: styles.btnCsv },
  { id: 3, name: 'NAAC Compliance Document', sub: 'Updated 2 days ago', type: 'DOCX', icon: File, colorClass: styles.bgBlue, btnClass: styles.btnDocx },
];

export default function ReportsPage() {
  return (
    <div className={styles.container}>
      <PageHeader
        titleStart="Institutional"
        titleHighlight="Reports"
      />

      <div className={styles.layout}>
        <section className={styles.downloadsCard}>
          <h2 className={styles.cardTitle}>Available Downloads</h2>
          <div className={styles.downloadList}>
            {MOCK_REPORTS.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className={styles.downloadItem}>
                  <div className={styles.fileInfo}>
                    <div className={`${styles.fileIconWrapper} ${report.colorClass}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className={styles.fileName}>{report.name}</p>
                      <p className={styles.fileSubText}>{report.sub}</p>
                    </div>
                  </div>
                  <a href="#" className={`${styles.downloadBtn} ${report.btnClass}`}>
                    <Download size={16} /> {report.type}
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.insightCard}>
          <h2 className={styles.cardTitle}>Quick Insight</h2>
          <div className={styles.insightValue}>
            <span className={styles.percentage}>98%</span>
            <span className={styles.accuracyLabel}>Data Accuracy Score</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.insightStats}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Last Sync: 10 mins ago</span>
              <span className={styles.statValueSmall}>Cloud Server: AWS Mumbai</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
